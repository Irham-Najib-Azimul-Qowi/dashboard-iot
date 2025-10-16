// src/visualizations/RadialGaugeChart.jsx

import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js';

import { dbRTDB, ref, onValue } from '../firebase/rtdb';
import VisualizationCard from '../components/VisualizationCard';
import './RadialGaugeChart.css';

ChartJS.register(ArcElement, Tooltip);

function RadialGaugeChart({ title, dataPath }) {
  const [currentValue, setCurrentValue] = useState(null);
  
  // Ref untuk menunjuk ke elemen DOM
  const cardContentRef = useRef(null);
  const scalableWrapperRef = useRef(null);

  // --- Konfigurasi Awal ---
  const minValue = 45.0;
  const maxValue = 55.0;
  const unit = 'Hz';

  // useEffect untuk mengambil data dari Firebase (tidak berubah)
  useEffect(() => {
    const dataRef = ref(dbRTDB, dataPath);
    const unsubscribe = onValue(dataRef, (snapshot) => {
      const data = snapshot.val();
      if (data !== null) {
        setCurrentValue(parseFloat(data));
      }
    });
    return () => unsubscribe();
  }, [dataPath]);

  // ✅ LOGIKA BARU: Mengamati ukuran kontainer dan menerapkan skala
  useLayoutEffect(() => {
    const cardContent = cardContentRef.current;
    const scalableWrapper = scalableWrapperRef.current;
    if (!cardContent || !scalableWrapper) return;

    // Ideal size of our visualization
    const idealWidth = 400; 
    const idealHeight = 400;

    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        const scale = Math.min(width / idealWidth, height / idealHeight);
        scalableWrapper.style.transform = `scale(${scale})`;
      }
    });

    resizeObserver.observe(cardContent);

    return () => resizeObserver.disconnect();
  }, []);


  const chartData = {
    datasets: [
      {
        data: [currentValue - minValue, maxValue - currentValue],
        backgroundColor: ['#A0E8A8', '#444752'],
        borderColor: '#2a2d34',
        borderWidth: 3,
        circumference: 270,
        rotation: 225,
        cutout: '75%',
        borderRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { tooltip: { enabled: false } },
  };

  return (
    <div className="page-container">
      <VisualizationCard title={title}>
        <div ref={cardContentRef} className="card-content-wrapper">
          <div ref={scalableWrapperRef} className="scalable-wrapper">
            {/* Wrapper untuk semua elemen visual */}
            <div className="visual-elements-wrapper">
              <div className="radial-chart-wrapper">
                <Doughnut data={chartData} options={chartOptions} />
                <div className="radial-chart-center-text">
                  <span className="value">{currentValue?.toFixed(2) || '0.00'}</span>
                  <span className="unit">{unit}</span>
                </div>
              </div>
              {/* ✅ LABEL MIN/MAX DI DALAM AREA SKALA, TAPI TERPISAH */}
              <div className="internal-labels">
                <span className="label-min">Min: {minValue} {unit}</span>
                <span className="label-max">Max: {maxValue} {unit}</span>
              </div>
            </div>
          </div>
        </div>
      </VisualizationCard>
    </div>
  );
}

export default RadialGaugeChart;