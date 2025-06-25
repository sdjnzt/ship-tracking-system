import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import ShipTracking from './pages/ShipTracking';
import CargoTracking from './pages/CargoTracking';
import './App.css';

// Import Ant Design styles
import 'antd/dist/antd.min.css';

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/ship-tracking" element={<ShipTracking />} />
          <Route path="/cargo-tracking" element={<CargoTracking />} />
          {/* 其他路由可在此添加 */}
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;
