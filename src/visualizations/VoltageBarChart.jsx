// src/visualizations/VoltageBarChart.jsx

import React, { useState, useEffect } from 'react';
import { dbRTDB, ref, onValue } from '../firebase/rtdb';
import VisualizationCard from '../components/VisualizationCard';
import './VoltageBarChart.css'; // File CSS yang akan kita buat

function VoltageBarChart({ title, dataPath }) {
  // State untuk menyimpan nilai voltage dari Firebase
  const [currentValue, setCurrentValue] = useState(null);

  // --- Konfigurasi dan Data Simulasi Awal ---
  // Sesuaikan rentang normal tegangan (misal: 220V +/- 10%)
  const minValue = 198.0;
  const maxValue = 242.0;
  const unit = 'V';

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

  // Menghitung persentase pengisian bar
  // Ini untuk memastikan bar tidak kurang dari 0% atau lebih dari 100%
  const percentage = Math.max(0, Math.min(100, ((currentValue - minValue) / (maxValue - minValue)) * 100));

  return (
    <div className="page-container">
      <VisualizationCard title={title}>
        {currentValue === null ? (
          <p className="loading-text">Menunggu data dari Firebase...</p>
        ) : (
          <div className="health-bar-wrapper">
            <div className="health-bar-info">
              <span className="current-value">{currentValue.toFixed(1)} {unit}</span>
              <span className="tolerance">
                ({minValue.toFixed(0)} - {maxValue.toFixed(0)} {unit})
              </span>
            </div>
            <div className="health-bar-container">
              <div 
                className="health-bar-fill" 
                style={{ width: `${percentage}%` }}
              >
              </div>
            </div>
          </div>
        )}
      </VisualizationCard>
    </div>
  );
}

export default VoltageBarChart;