
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import HomePage from './pages/HomePage';
import HostPage from './pages/HostPage';
import PlayerPage from './pages/PlayerPage';
import OverlayPage from './pages/OverlayPage';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/host" element={<HostPage />} />
        <Route path="/player/:token?" element={<PlayerPage />} />
        <Route path="/overlay" element={<OverlayPage />} />
      </Routes>
      <Toaster richColors position="top-right" />
    </div>
  );
}

export default App;
