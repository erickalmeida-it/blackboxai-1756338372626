import React from 'react';
import { useAuth } from '../services/auth';

const Navbar = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar-custom">
      <div className="d-flex justify-content-between align-items-center w-100">
        <div className="d-flex align-items-center">
          <button 
            className="navbar-toggle"
            onClick={toggleSidebar}
            type="button"
          >
            ☰
          </button>
          <a href="/" className="navbar-brand ms-3">
            ProCultura RS
          </a>
        </div>
        
        <div className="d-flex align-items-center">
          <span className="navbar-user">
            Olá, {user?.name || 'Usuário'}
          </span>
          <button 
            className="navbar-logout"
            onClick={logout}
            type="button"
          >
            Sair
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
