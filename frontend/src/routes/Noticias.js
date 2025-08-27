import React, { useState, useEffect } from 'react';
import DataTable from '../components/DataTable';
import { apiService } from '../services/api';

const Noticias = () => {
  const [noticias, setNoticias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    titulo: '',
    dataInicio: '',
    dataFim: '',
    conteudo: ''
  });
  const [selectedNoticia, setSelectedNoticia] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadNoticias();
  }, []);

  const loadNoticias = async () => {
    setLoading(true);
    try {
      const data = await apiService.getNoticias(filters);
      setNoticias(data);
    } catch (error) {
      console.error('Erro ao carregar notícias:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const applyFilters = () => {
    loadNoticias();
  };

  const clearFilters = () => {
    setFilters({
      titulo: '',
      dataInicio: '',
      dataFim: '',
      conteudo: ''
    });
    setTimeout(() => {
      loadNoticias();
    }, 100);
  };

  const handleRowClick = (noticia) => {
    setSelectedNoticia(noticia);
    setShowModal(true);
  };

  const exportData = async (format) => {
    try {
      const blob = await apiService.exportData('noticias', format);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `noticias.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Erro ao exportar dados:', error);
      alert('Erro ao exportar dados. Funcionalidade em desenvolvimento.');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const truncateText = (text, maxLength = 100) => {
    if (!text) return '-';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Ontem';
    if (diffDays < 7) return `${diffDays} dias atrás`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} semanas atrás`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} meses atrás`;
    return `${Math.floor(diffDays / 365)} anos atrás`;
  };

  const columns = [
    {
      key: 'dataPublicacao',
      label: 'Data',
      render: (value) => (
        <div>
          <div className="fw-semibold">{formatDate(value)}</div>
          <small className="text-muted">{getTimeAgo(value)}</small>
        </div>
      )
    },
    {
      key: 'titulo',
      label: 'Título',
      render: (value) => (
        <div style={{ maxWidth: '300px' }}>
          <span className="fw-semibold text-primary">{value}</span>
        </div>
      )
    },
    {
      key: 'conteudo',
      label: 'Resumo',
      render: (value) => (
        <div style={{ maxWidth: '400px' }}>
          <span className="text-muted">{truncateText(value, 150)}</span>
        </div>
      )
    },
    {
      key: 'actions',
      label: 'Ações',
      render: (value, row) => (
        <button
          className="btn btn-sm btn-outline-primary"
          onClick={(e) => {
            e.stopPropagation();
            handleRowClick(row);
          }}
        >
          Ver Completa
        </button>
      )
    }
  ];

  return (
    <div className="noticias-container">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-1">Notícias e Avisos</h1>
          <p className="text-muted mb-0">
            Últimas notícias e comunicados da Secretaria de Cultura do RS
          </p>
        </div>
        <div className="d-flex gap-2">
          <div className="dropdown">
            <button 
              className="btn-secondary-custom dropdown-toggle" 
              type="button" 
              data-bs-toggle="dropdown"
            >
              Exportar
            </button>
            <ul className="dropdown-menu">
              <li>
                <button 
                  className="dropdown-item" 
                  onClick={() => exportData('csv')}
                >
                  Exportar CSV
                </button>
              </li>
              <li>
                <button 
                  className="dropdown-item" 
                  onClick={() => exportData('xlsx')}
                >
                  Exportar Excel
                </button>
              </li>
              <li>
                <button 
                  className="dropdown-item" 
                  onClick={() => exportData('pdf')}
                >
                  Exportar PDF
                </button>
              </li>
            </ul>
          </div>
          <button 
            className="btn-primary-custom"
            onClick={loadNoticias}
          >
            Atualizar
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="stat-card">
            <div className="stat-number">{noticias.length}</div>
            <div className="stat-label">Total de Notícias</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="stat-card">
            <div className="stat-number">
              {noticias.filter(n => {
                const date = new Date(n.dataPublicacao);
                const now = new Date();
                const diffTime = Math.abs(now - date);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                return diffDays <= 7;
              }).length}
            </div>
            <div className="stat-label">Última Semana</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="stat-card">
            <div className="stat-number">
              {noticias.filter(n => {
                const date = new Date(n.dataPublicacao);
                const now = new Date();
                return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
              }).length}
            </div>
            <div className="stat-label">Este Mês</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="stat-card">
            <div className="stat-number">
              {noticias.filter(n => {
                const date = new Date(n.dataPublicacao);
                const now = new Date();
                return date.getFullYear() === now.getFullYear();
              }).length}
            </div>
            <div className="stat-label">Este Ano</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-container">
        <h6 className="mb-3">Filtros de Busca</h6>
        <div className="filters-grid">
          <div className="filter-group">
            <label className="filter-label">Título</label>
            <input
              type="text"
              className="filter-input"
              placeholder="Digite o título..."
              value={filters.titulo}
              onChange={(e) => handleFilterChange('titulo', e.target.value)}
            />
          </div>
          
          <div className="filter-group">
            <label className="filter-label">Conteúdo</label>
            <input
              type="text"
              className="filter-input"
              placeholder="Buscar no conteúdo..."
              value={filters.conteudo}
              onChange={(e) => handleFilterChange('conteudo', e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label className="filter-label">Data Início</label>
            <input
              type="date"
              className="filter-input"
              value={filters.dataInicio}
              onChange={(e) => handleFilterChange('dataInicio', e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label className="filter-label">Data Fim</label>
            <input
              type="date"
              className="filter-input"
              value={filters.dataFim}
              onChange={(e) => handleFilterChange('dataFim', e.target.value)}
            />
          </div>
        </div>

        <div className="d-flex gap-2 mt-3">
          <button 
            className="btn-primary-custom"
            onClick={applyFilters}
          >
            Aplicar Filtros
          </button>
          <button 
            className="btn-secondary-custom"
            onClick={clearFilters}
          >
            Limpar Filtros
          </button>
        </div>
      </div>

      {/* News Cards View */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card-custom">
            <div className="card-header-custom">
              <div className="d-flex justify-content-between align-items-center">
                <span>Últimas Notícias</span>
                <small className="text-muted">Clique em uma notícia para ver o conteúdo completo</small>
              </div>
            </div>
            <div className="card-body-custom p-0">
              {noticias.slice(0, 5).map((noticia, index) => (
                <div 
                  key={noticia.id} 
                  className={`p-3 ${index < 4 ? 'border-bottom' : ''}`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleRowClick(noticia)}
                >
                  <div className="row align-items-start">
                    <div className="col-md-2">
                      <div className="text-center">
                        <div className="fw-bold text-primary">{formatDate(noticia.dataPublicacao)}</div>
                        <small className="text-muted">{getTimeAgo(noticia.dataPublicacao)}</small>
                      </div>
                    </div>
                    <div className="col-md-10">
                      <h6 className="mb-2 text-primary">{noticia.titulo}</h6>
                      <p className="mb-0 text-muted">{truncateText(noticia.conteudo, 200)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        data={noticias}
        columns={columns}
        loading={loading}
        onRowClick={handleRowClick}
        searchable={false}
        emptyMessage="Nenhuma notícia encontrada com os filtros aplicados"
      />

      {/* Modal for News Details */}
      {showModal && selectedNoticia && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Notícia Completa</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="badge bg-primary">{formatDate(selectedNoticia.dataPublicacao)}</span>
                    <small className="text-muted">{getTimeAgo(selectedNoticia.dataPublicacao)}</small>
                  </div>
                  <h4 className="mb-3">{selectedNoticia.titulo}</h4>
                  <div className="text-justify" style={{ lineHeight: '1.6' }}>
                    {selectedNoticia.conteudo?.split('\n').map((paragraph, index) => (
                      <p key={index} className="mb-3">{paragraph}</p>
                    ))}
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn-secondary-custom" 
                  onClick={() => setShowModal(false)}
                >
                  Fechar
                </button>
                <button 
                  type="button" 
                  className="btn-primary-custom"
                  onClick={() => {
                    const text = `${selectedNoticia.titulo}\n\n${selectedNoticia.conteudo}\n\nFonte: ProCultura RS - ${formatDate(selectedNoticia.dataPublicacao)}`;
                    navigator.clipboard.writeText(text);
                    alert('Notícia copiada para a área de transferência!');
                  }}
                >
                  Copiar Texto
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Backdrop */}
      {showModal && (
        <div 
          className="modal-backdrop fade show" 
          onClick={() => setShowModal(false)}
        ></div>
      )}
    </div>
  );
};

export default Noticias;
