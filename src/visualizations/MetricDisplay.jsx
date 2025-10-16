// src/visualizations/MetricDisplay.jsx

import React, { useState, useEffect } from 'react';
import { dbRTDB, ref, onValue } from '../firebase/rtdb';
import VisualizationCard from '../components/VisualizationCard';
import './MetricDisplay.css'; // File CSS yang akan kita buat

function MetricDisplay({ title, dataPath, unit }) {
  // State untuk menyimpan nilai dari Firebase
  const [currentValue, setCurrentValue] = useState(null);

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

  // Fungsi untuk memformat angka dengan pemisah ribuan (misal: 1,234.5)
  const formatNumber = (num) => {
    if (num === null || num === undefined) return '...';
    return num.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  };

  return (
    <div className="page-container">
      <VisualizationCard title={title}>
        <div className="metric-wrapper">
          {currentValue === null ? (
            <p className="loading-text">Menunggu data...</p>
          ) : (
            <>
              <span className="metric-value">{formatNumber(currentValue)}</span>
              <span className="metric-unit">{unit}</span>
            </>
          )}
        </div>
      </VisualizationCard>
    </div>
  );
}

export default MetricDisplay;