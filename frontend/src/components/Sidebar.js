import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = ({ isOpen }) => {
  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', description: 'Visão geral' },
    { path: '/produtores', label: 'Produtores', description: 'Produtores culturais' },
    { path: '/projetos-fac', label: 'Projetos FAC', description: 'Fundo de Apoio à Cultura' },
    { path: '/projetos-lic', label: 'Projetos LIC', description: 'Lei de Incentivo à Cultura' },
    { path: '/noticias', label: 'Notícias', description: 'Avisos e notícias' },
    { path: '/scraping', label: 'Controle Scraping', description: 'Gerenciar coleta de dados' }
  ];

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <nav>
        <ul className="sidebar-nav">
          {menuItems.map((item) => (
            <li key={item.path} className="sidebar-nav-item">
              <NavLink
                to={item.path}
                className={({ isActive }) => 
                  `sidebar-nav-link ${isActive ? 'active' : ''}`
                }
              >
                <div>
                  <div className="fw-semibold">{item.label}</div>
                  <small className="text-muted">{item.description}</small>
                </div>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
