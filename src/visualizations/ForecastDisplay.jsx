// src/visualizations/ForecastDisplay.jsx

import React, { useState, useEffect } from 'react';
import { firestore, loginFirestore } from '../firebase/firestore';
import { doc, getDoc } from 'firebase/firestore';

import VisualizationCard from '../components/VisualizationCard';
import './ForecastDisplay.css'; // File CSS yang akan kita buat

function ForecastDisplay() {
  const [totalKwh, setTotalKwh] = useState(null);
  const [price, setPrice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      await loginFirestore();

      // --- Logika Pengambilan Data Prediksi ---
      // Asumsi Anda memiliki satu dokumen di Firestore yang menyimpan hasil prediksi.
      // Ganti 'monthlyPredictions' dan 'latest' dengan path dokumen Anda.
      // Contoh path: /predictions/monthly/october-2025
      const docRef = doc(firestore, "monthlyPredictions", "latest");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        // Ganti 'predictedKwh' dan 'predictedPrice' dengan nama field di dokumen Anda
        setTotalKwh(data.predictedKwh || 0);
        setPrice(data.predictedPrice || 0);
      } else {
        // Jika dokumen tidak ditemukan, tampilkan data contoh
        console.warn("Dokumen prediksi tidak ditemukan, menampilkan data simulasi.");
        setTotalKwh(4520.5); // Data simulasi
        setPrice(6780750); // Data simulasi
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  // Fungsi format mata uang Rupiah
  const formatCurrency = (num) => {
    if (num === null) return '...';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(num);
  };

  // Fungsi format angka biasa
  const formatNumber = (num) => {
    if (num === null) return '...';
    return num.toLocaleString('id-ID');
  };

  return (
    <div className="page-container">
      <VisualizationCard title="Prediksi Bulan Depan">
        <div className="forecast-wrapper">
          {loading ? (
            <p className="loading-text">Menghitung prediksi...</p>
          ) : (
            <div className="forecast-metrics">
              <div className="forecast-metric-item">
                <span className="metric-label">Total Estimasi Pemakaian</span>
                <span className="metric-value-large">{formatNumber(totalKwh)}</span>
                <span className="metric-unit-large">kWh</span>
              </div>
              <div className="forecast-separator"></div>
              <div className="forecast-metric-item">
                <span className="metric-label">Total Estimasi Biaya</span>
                <span className="metric-value-large currency">{formatCurrency(price)}</span>
                <span className="metric-unit-large">Rupiah</span>
              </div>
            </div>
          )}
        </div>
      </VisualizationCard>
    </div>
  );
}

export default ForecastDisplay;