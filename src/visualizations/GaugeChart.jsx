// src/visualizations/GaugeChart.jsx

import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js';
import { dbRTDB, ref, onValue } from '../firebase/rtdb';
import VisualizationCard from '../components/VisualizationCard';
import './GaugeChart.css';

ChartJS.register(ArcElement, Tooltip);

// ✅ DIUBAH: Tambahkan minValue dan maxValue ke dalam props
// Kita juga memberikan nilai default (0 dan 100) jika tidak dikirim
function GaugeChart({ title, dataPath, unit, minValue = 0, maxValue = 100 }) {
  const [currentValue, setCurrentValue] = useState(null);
  
  const cardContentRef = useRef(null);
  const scalableWrapperRef = useRef(null);

  // --- Konfigurasi Awal ---
  // ❌ HAPUS: Nilai min/max tidak lagi ditentukan di sini
  // const minValue = 0;
  // const maxValue = 100;

  useEffect(() => {
    const dataRef = ref(dbRTDB, dataPath);
    const unsubscribe = onValue(dataRef, (snapshot) => {
      const data = snapshot.val();
      if (data !== null) setCurrentValue(parseFloat(data));
    });
    return () => unsubscribe();
  }, [dataPath]);

  useLayoutEffect(() => {
    // ... (Logika scaling biarkan sama persis) ...
    const cardContent = cardContentRef.current;
    const scalableWrapper = scalableWrapperRef.current;
    if (!cardContent || !scalableWrapper) return;

    const idealWidth = 400;
    const idealHeight = 250;

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
    datasets: [{
      // ✅ DIUBAH: Menggunakan props minValue dan maxValue
      data: [currentValue - minValue, maxValue - currentValue],
      backgroundColor: ['#A0E8A8', '#444752'],
      borderWidth: 0,
      circumference: 180,
      rotation: 270,
      cutout: '80%',
      borderRadius: 8,
    }],
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
          <div ref={scalableWrapperRef} className="scalable-wrapper-gauge">
            <div className="visual-elements-wrapper">
              <div className="gauge-chart-wrapper">
                <Doughnut data={chartData} options={chartOptions} />
                <div className="gauge-chart-center-text">
                  <span className="value">{currentValue?.toFixed(2) || '0.00'}</span>
                  <span className="unit">{unit}</span>
                </div>
              </div>
              <div className="internal-labels">
                {/* ✅ DIUBAH: Menampilkan props minValue dan maxValue */}
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

export default GaugeChart;