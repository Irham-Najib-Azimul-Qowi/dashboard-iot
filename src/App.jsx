import { useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import './App.css';

// === Firebase Login ===
import { loginRTDB } from './firebase/rtdb';
import { loginFirestore } from './firebase/firestore';

// === Komponen Visualisasi ===
import RadialGaugeChart from './visualizations/RadialGaugeChart';
import VoltageBarChart from './visualizations/VoltageBarChart';
import MetricDisplay from './visualizations/MetricDisplay';
import GaugeChart from './visualizations/GaugeChart';
import KwhForecastChart from './visualizations/KwhForecastChart';
import ForecastDisplay from './visualizations/ForecastDisplay';


// Komponen Halaman Utama untuk navigasi yang mudah
function HomePage() {
  const linkGroups = [
    {
      title: "Monitoring PZEM",
      links: [
        { path: "/frekuensi-1", title: "Frekuensi" },
        { path: "/voltage-fasa-1a", title: "Tegangan" },
        { path: "/total-power-1", title: "Daya Aktif" },
        { path: "/energy-delivery-1", title: "Energi" },
      ]
    },
    {
      title: "Monitoring Machine (Panel 1)",
      links: [
        { path: "/frekuensi-2", title: "Frekuensi Panel" },
        { path: "/voltage-fasa-1b", title: "Voltage L1-N" },
      ]
    },
    {
      title: "Monitoring Panel (Sensor Data)",
      links: [
        { path: "/voltage-fasa-1c", title: "Voltage Fasa 1" },
        { path: "/voltage-fasa-2", title: "Voltage Fasa 2" },
        { path: "/voltage-fasa-3", title: "Voltage Fasa 3" },
        { path: "/total-power-2", title: "Total Power" },
        { path: "/energy-delivery-2", title: "Energy Delivery" },
        { path: "/arus-rata-rata", title: "Arus Rata-rata" },
        { path: "/average-voltage", title: "Voltage Rata-rata" },
      ]
    },
    {
      title: "Analisis & Prediksi",
      links: [
        { path: "/kwh-forecast", title: "Prediksi kWh per Jam" },
        { path: "/monthly-forecast", title: "Prediksi Bulanan" },
      ]
    }
  ];

  return (
    <div className="homepage">
      <h1>Dashboard IoT</h1>
      <p>Pilih visualisasi yang ingin dilihat:</p>
      
      {linkGroups.map(group => (
        <div key={group.title} className="nav-group">
          <h3 className="nav-group-title">{group.title}</h3>
          <nav className="nav-grid">
            {group.links.map(link => (
              <Link key={link.path} to={link.path} className="nav-link">
                {link.title}
              </Link>
            ))}
          </nav>
        </div>
      ))}
    </div>
  );
}


function App() {
  // useEffect ini akan menjalankan fungsi login ke Firebase
  // hanya sekali saat aplikasi pertama kali dimuat.
  useEffect(() => {
    console.log("🚀 Aplikasi dimuat, mencoba login ke Firebase...");
    loginRTDB();
    loginFirestore();
  }, []);

  return (
    <Routes>
      {/* Rute Halaman Utama */}
      <Route path="/" element={<HomePage />} />

      {/* --- Rute untuk data dari Firebase Realtime Database --- */}

      {/* 1. Frekuensi #1 */}
      <Route path="/frekuensi-1" element={<RadialGaugeChart title="Frekuensi #1" dataPath="/pzem/Frekuensi" />} />
      {/* 2. Frekuensi #2 */}
      <Route path="/frekuensi-2" element={<RadialGaugeChart title="Frekuensi #2" dataPath="/Panel1/Frequency" />} />

      {/* 3. Voltage Fasa 1 #1 */}
      <Route path="/voltage-fasa-1a" element={<VoltageBarChart title="Voltage Fasa 1 #1" dataPath="/pzem/Tegangan" />} />
      {/* 4. Voltage Fasa 1 #2 */}
      <Route path="/voltage-fasa-1b" element={<VoltageBarChart title="Voltage Fasa 1 #2" dataPath="/Panel1/Voltage_L1_N" />} />
      {/* 5. Voltage Fasa 1 #3 */}
      <Route path="/voltage-fasa-1c" element={<VoltageBarChart title="Voltage Fasa 1 #3" dataPath="/sensor_data/V1" />} />
      {/* 6. Voltage Fasa 2 */}
      <Route path="/voltage-fasa-2" element={<VoltageBarChart title="Voltage Fasa 2" dataPath="/sensor_data/V2" />} />
      {/* 7. Voltage Fasa 3 */}
      <Route path="/voltage-fasa-3" element={<VoltageBarChart title="Voltage Fasa 3" dataPath="/sensor_data/V3" />} />

      {/* 8. Total Power #1 */}
      <Route path="/total-power-1" element={<MetricDisplay title="Total Power #1" dataPath="/pzem/Daya" unit="kW" />} />
      {/* 9. Total Power #2 */}
      <Route path="/total-power-2" element={<MetricDisplay title="Total Power #2" dataPath="/sensor_data/Ptot" unit="kW" />} />
      
      {/* 10. Energy Delivery #1 */}
      <Route path="/energy-delivery-1" element={<MetricDisplay title="Energy Delivery #1" dataPath="/pzem/Energi" unit="kWh" />} />
      {/* 11. Energy Delivery #2 */}
      <Route path="/energy-delivery-2" element={<MetricDisplay title="Energy Delivery #2" dataPath="/sensor_data/Edel" unit="kWh" />} />

      {/* 12. Arus Rata-rata */}
      <Route path="/arus-rata-rata" element={<GaugeChart title="Arus Rata-rata" dataPath="/sensor_data/Iavg" unit="A" />} />
      {/* 13. Average Voltage */}
      <Route path="/average-voltage" element={<GaugeChart title="Average Voltage" dataPath="/sensor_data/Vavg" unit="V" />} />
      
      {/* --- Rute untuk data dari Firebase Firestore --- */}

      {/* 14. Prediksi kWh per Jam */}
      <Route path="/kwh-forecast" element={<KwhForecastChart />} />
      {/* 15. Prediksi Bulanan */}
      <Route path="/monthly-forecast" element={<ForecastDisplay />} />

    </Routes>
  );
}

export default App;