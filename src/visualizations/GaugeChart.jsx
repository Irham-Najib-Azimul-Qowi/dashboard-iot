// src/visualizations/GaugeChart.jsx

import React, { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js';

import { dbRTDB, ref, onValue } from '../firebase/rtdb';
import VisualizationCard from '../components/VisualizationCard';
import './GaugeChart.css'; // File CSS yang akan kita buat

// Daftarkan elemen Chart.js
ChartJS.register(ArcElement, Tooltip);

function GaugeChart({ title, dataPath, unit }) {
  const [currentValue, setCurrentValue] = useState(null);

  // --- Konfigurasi Awal ---
  // Anda bisa sesuaikan nilai min/max ini untuk setiap gauge di App.jsx nanti
  // jika rentangnya berbeda, atau set default di sini.
  const minValue = 0;
  const maxValue = 100; // Contoh rentang default

  // useEffect untuk mengambil data dari Firebase
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

  // Data untuk chart
  const data = {
    datasets: [
      {
        data: [currentValue - minValue, maxValue - currentValue],
        backgroundColor: ['#A0E8A8', '#444752'],
        borderWidth: 0,
        circumference: 180, // Setengah lingkaran
        rotation: 270,      // Alas di bawah
        cutout: '80%',
        borderRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: { enabled: false },
    },
  };

  return (
    <div className="page-container">
      <VisualizationCard title={title}>
        {currentValue === null ? (
          <p className="loading-text">Menunggu data...</p>
        ) : (
          <div className="gauge-chart-wrapper">
            <Doughnut data={data} options={options} />
            <div className="gauge-chart-center-text">
              <span className="value">{currentValue.toFixed(2)}</span>
              <span className="unit">{unit}</span>
            </div>
            <div className="gauge-tolerance-info">
              <span>Min: {minValue} {unit}</span>
              <span>Max: {maxValue} {unit}</span>
            </div>
          </div>
        )}
      </VisualizationCard>
    </div>
  );
}

export default GaugeChart;