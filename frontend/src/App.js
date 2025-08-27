import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './routes/Dashboard';
import Produtores from './routes/Produtores';
import ProjetosFAC from './routes/ProjetosFAC';
import ProjetosLIC from './routes/ProjetosLIC';
import Noticias from './routes/Noticias';
import ScrapingControl from './routes/ScrapingControl';
import Login from './components/Login';
import { AuthProvider, useAuth } from './services/auth';

function AppContent() {
  const { isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <div className="app-container">
      <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="main-content">
        <Sidebar isOpen={sidebarOpen} />
        <div className={`content-area ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/produtores" element={<Produtores />} />
            <Route path="/projetos-fac" element={<ProjetosFAC />} />
            <Route path="/projetos-lic" element={<ProjetosLIC />} />
            <Route path="/noticias" element={<Noticias />} />
            <Route path="/scraping" element={<ScrapingControl />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
