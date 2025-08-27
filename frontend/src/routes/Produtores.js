import React, { useState, useEffect } from 'react';
import DataTable from '../components/DataTable';
import { apiService } from '../services/api';

const Produtores = () => {
  const [produtores, setProdutores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    municipio: '',
    tipoPessoa: '',
    situacao: '',
    cepc: '',
    nome: ''
  });
  const [selectedProdutor, setSelectedProdutor] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadProdutores();
  }, []);

  const loadProdutores = async () => {
    setLoading(true);
    try {
      const data = await apiService.getProdutores(filters);
      setProdutores(data);
    } catch (error) {
      console.error('Erro ao carregar produtores:', error);
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
    loadProdutores();
  };

  const clearFilters = () => {
    setFilters({
      municipio: '',
      tipoPessoa: '',
      situacao: '',
      cepc: '',
      nome: ''
    });
    setTimeout(() => {
      loadProdutores();
    }, 100);
  };

  const handleRowClick = async (produtor) => {
    try {
      const detailedData = await apiService.getProdutorById(produtor.id);
      setSelectedProdutor(detailedData);
      setShowModal(true);
    } catch (error) {
      console.error('Erro ao carregar detalhes do produtor:', error);
    }
  };

  const exportData = async (format) => {
    try {
      const blob = await apiService.exportData('produtores', format);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `produtores.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Erro ao exportar dados:', error);
      alert('Erro ao exportar dados. Funcionalidade em desenvolvimento.');
    }
  };

  const columns = [
    {
      key: 'cepc',
      label: 'CEPC',
      render: (value) => (
        <span className="font-monospace text-primary">{value}</span>
      )
    },
    {
      key: 'nome',
      label: 'Nome do Produtor',
      render: (value) => (
        <span className="fw-semibold">{value}</span>
      )
    },
    {
      key: 'responsavelLegal',
      label: 'Responsável Legal',
      render: (value) => value || '-'
    },
    {
      key: 'tipoPessoa',
      label: 'Tipo',
      render: (value) => (
        <span className={`badge ${value === 'Física' ? 'bg-info' : 'bg-success'}`}>
          {value}
        </span>
      )
    },
    {
      key: 'municipio',
      label: 'Município'
    },
    {
      key: 'email',
      label: 'E-mail',
      render: (value) => (
        <a href={`mailto:${value}`} className="text-decoration-none">
          {value}
        </a>
      )
    },
    {
      key: 'situacao',
      label: 'Situação',
      render: (value) => (
        <span className={`badge ${value === 'Ativo' ? 'bg-success' : 'bg-warning'}`}>
          {value}
        </span>
      )
    },
    {
      key: 'projetosVinculados',
      label: 'Projetos',
      render: (value) => (
        <span className="small text-muted">{value}</span>
      )
    }
  ];

  // Get unique values for filter dropdowns
  const uniqueMunicipios = [...new Set(produtores.map(p => p.municipio))].sort();
  const uniqueTipos = [...new Set(produtores.map(p => p.tipoPessoa))].sort();
  const uniqueSituacoes = [...new Set(produtores.map(p => p.situacao))].sort();

  return (
    <div className="produtores-container">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-1">Produtores Culturais</h1>
          <p className="text-muted mb-0">
            Consulta e gerenciamento de produtores culturais cadastrados
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
            onClick={loadProdutores}
          >
            Atualizar
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-container">
        <h6 className="mb-3">Filtros de Busca</h6>
        <div className="filters-grid">
          <div className="filter-group">
            <label className="filter-label">CEPC</label>
            <input
              type="text"
              className="filter-input"
              placeholder="Digite o CEPC..."
              value={filters.cepc}
              onChange={(e) => handleFilterChange('cepc', e.target.value)}
            />
          </div>
          
          <div className="filter-group">
            <label className="filter-label">Nome do Produtor</label>
            <input
              type="text"
              className="filter-input"
              placeholder="Digite o nome..."
              value={filters.nome}
              onChange={(e) => handleFilterChange('nome', e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label className="filter-label">Município</label>
            <select
              className="filter-input"
              value={filters.municipio}
              onChange={(e) => handleFilterChange('municipio', e.target.value)}
            >
              <option value="">Todos os municípios</option>
              {uniqueMunicipios.map(municipio => (
                <option key={municipio} value={municipio}>
                  {municipio}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Tipo de Pessoa</label>
            <select
              className="filter-input"
              value={filters.tipoPessoa}
              onChange={(e) => handleFilterChange('tipoPessoa', e.target.value)}
            >
              <option value="">Todos os tipos</option>
              {uniqueTipos.map(tipo => (
                <option key={tipo} value={tipo}>
                  {tipo}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Situação</label>
            <select
              className="filter-input"
              value={filters.situacao}
              onChange={(e) => handleFilterChange('situacao', e.target.value)}
            >
              <option value="">Todas as situações</option>
              {uniqueSituacoes.map(situacao => (
                <option key={situacao} value={situacao}>
                  {situacao}
                </option>
              ))}
            </select>
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

      {/* Data Table */}
      <DataTable
        data={produtores}
        columns={columns}
        loading={loading}
        onRowClick={handleRowClick}
        searchable={false} // We have custom filters
        emptyMessage="Nenhum produtor encontrado com os filtros aplicados"
      />

      {/* Modal for Producer Details */}
      {showModal && selectedProdutor && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Detalhes do Produtor</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <h6 className="text-muted mb-2">Informações Básicas</h6>
                    <div className="mb-3">
                      <strong>CEPC:</strong> {selectedProdutor.cepc}
                    </div>
                    <div className="mb-3">
                      <strong>Nome:</strong> {selectedProdutor.nome}
                    </div>
                    <div className="mb-3">
                      <strong>Tipo de Pessoa:</strong> {selectedProdutor.tipoPessoa}
                    </div>
                    {selectedProdutor.responsavelLegal && (
                      <div className="mb-3">
                        <strong>Responsável Legal:</strong> {selectedProdutor.responsavelLegal}
                      </div>
                    )}
                  </div>
                  <div className="col-md-6">
                    <h6 className="text-muted mb-2">Contato e Localização</h6>
                    <div className="mb-3">
                      <strong>E-mail:</strong> 
                      <a href={`mailto:${selectedProdutor.email}`} className="ms-2">
                        {selectedProdutor.email}
                      </a>
                    </div>
                    <div className="mb-3">
                      <strong>Município:</strong> {selectedProdutor.municipio}
                    </div>
                    <div className="mb-3">
                      <strong>Situação:</strong> 
                      <span className={`badge ms-2 ${selectedProdutor.situacao === 'Ativo' ? 'bg-success' : 'bg-warning'}`}>
                        {selectedProdutor.situacao}
                      </span>
                    </div>
                    <div className="mb-3">
                      <strong>Projetos Vinculados:</strong> {selectedProdutor.projetosVinculados}
                    </div>
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

export default Produtores;
