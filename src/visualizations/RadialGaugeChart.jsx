// src/visualizations/RadialGaugeChart.jsx

import React, { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js';

import { dbRTDB, ref, onValue } from '../firebase/rtdb';
import VisualizationCard from '../components/VisualizationCard';
import './RadialGaugeChart.css'; // File CSS yang akan kita buat

// Daftarkan elemen Chart.js yang akan digunakan
ChartJS.register(ArcElement, Tooltip);

function RadialGaugeChart({ title, dataPath }) {
  // State untuk menyimpan nilai dari Firebase
  const [currentValue, setCurrentValue] = useState(null);

  // --- Konfigurasi dan Data Simulasi Awal ---
  // Anda bisa sesuaikan nilai min/max ini sesuai kebutuhan sensor
  const minValue = 45.0;
  const maxValue = 55.0;
  const unit = 'Hz';

  // useEffect untuk mengambil data dari Firebase saat komponen dimuat
  useEffect(() => {
    const dataRef = ref(dbRTDB, dataPath);
    
    const unsubscribe = onValue(dataRef, (snapshot) => {
      const data = snapshot.val();
      if (data !== null) {
        // Memastikan data yang diterima adalah angka
        setCurrentValue(parseFloat(data));
      }
    });

    // Berhenti mendengarkan data saat komponen tidak lagi ditampilkan
    return () => unsubscribe();
  }, [dataPath]); // Efek ini akan dijalankan ulang jika `dataPath` berubah

  // Menyiapkan data untuk Chart.js
  const chartData = {
    datasets: [
      {
        data: [currentValue - minValue, maxValue - currentValue],
        backgroundColor: ['#A0E8A8', '#444752'], // Warna [Terisi, Sisa]
        borderColor: '#2a2d34', // Warna border antar segmen
        borderWidth: 3,
        circumference: 270, // Membuat busur 270 derajat
        rotation: 225,      // Memutar chart agar titik nol di kiri bawah
        cutout: '75%',      // Ketebalan donat
        borderRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: { enabled: false }, // Matikan tooltip bawaan
    },
  };

  return (
    <div className="page-container">
      <VisualizationCard title={title}>
        {currentValue === null ? (
          <p className="loading-text">Menunggu data dari Firebase...</p>
        ) : (
          <div className="radial-chart-wrapper">
            <Doughnut data={chartData} options={chartOptions} />
            <div className="radial-chart-center-text">
              <span className="value">{currentValue.toFixed(2)}</span>
              <span className="unit">{unit}</span>
            </div>
            <div className="radial-tolerance-info">
              <span>{minValue} {unit}</span>
              <span>{maxValue} {unit}</span>
            </div>
          </div>
        )}
      </VisualizationCard>
    </div>
  );
}

export default RadialGaugeChart;