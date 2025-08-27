import React, { useState, useEffect } from 'react';
import DataTable from '../components/DataTable';
import { apiService } from '../services/api';

const ProjetosLIC = () => {
  const [projetos, setProjetos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    processo: '',
    situacao: '',
    segmento: '',
    localizacao: '',
    descricao: '',
    dataEntradaInicio: '',
    dataEntradaFim: ''
  });
  const [selectedProjeto, setSelectedProjeto] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadProjetosLIC();
  }, []);

  const loadProjetosLIC = async () => {
    setLoading(true);
    try {
      const data = await apiService.getProjetosLIC(filters);
      setProjetos(data);
    } catch (error) {
      console.error('Erro ao carregar projetos LIC:', error);
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
    loadProjetosLIC();
  };

  const clearFilters = () => {
    setFilters({
      processo: '',
      situacao: '',
      segmento: '',
      localizacao: '',
      descricao: '',
      dataEntradaInicio: '',
      dataEntradaFim: ''
    });
    setTimeout(() => {
      loadProjetosLIC();
    }, 100);
  };

  const handleRowClick = (projeto) => {
    setSelectedProjeto(projeto);
    setShowModal(true);
  };

  const exportData = async (format) => {
    try {
      const blob = await apiService.exportData('projetos-lic', format);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `projetos-lic.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Erro ao exportar dados:', error);
      alert('Erro ao exportar dados. Funcionalidade em desenvolvimento.');
    }
  };

  const getSituacaoBadgeClass = (situacao) => {
    switch (situacao?.toLowerCase()) {
      case 'aprovado':
        return 'bg-success';
      case 'em análise':
        return 'bg-warning';
      case 'rejeitado':
        return 'bg-danger';
      case 'em captação':
        return 'bg-info';
      case 'concluído':
        return 'bg-secondary';
      case 'em execução':
        return 'bg-primary';
      default:
        return 'bg-light text-dark';
    }
  };

  const getPrestacaoContasStatus = (status) => {
    switch (status?.toLowerCase()) {
      case 'aprovada':
        return 'bg-success';
      case 'em análise':
        return 'bg-warning';
      case 'pendente':
        return 'bg-danger';
      default:
        return 'bg-light text-dark';
    }
  };

  const formatCurrency = (value) => {
    if (!value) return '-';
    return value.replace(/[^\d,]/g, '').replace(',', '.') 
      ? parseFloat(value.replace(/[^\d,]/g, '').replace(',', '.')).toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        })
      : value;
  };

  const columns = [
    {
      key: 'processo',
      label: 'Processo',
      render: (value) => (
        <span className="font-monospace text-primary fw-semibold">{value}</span>
      )
    },
    {
      key: 'dataEntrada',
      label: 'Data Entrada',
      render: (value) => {
        const date = new Date(value);
        return date.toLocaleDateString('pt-BR');
      }
    },
    {
      key: 'descricao',
      label: 'Descrição',
      render: (value) => (
        <div style={{ maxWidth: '200px' }}>
          <span className="fw-semibold">{value}</span>
        </div>
      )
    },
    {
      key: 'situacao',
      label: 'Situação',
      render: (value) => (
        <span className={`badge ${getSituacaoBadgeClass(value)}`}>
          {value}
        </span>
      )
    },
    {
      key: 'segmento',
      label: 'Segmento',
      render: (value) => (
        <span className="badge bg-light text-dark">{value}</span>
      )
    },
    {
      key: 'localizacao',
      label: 'Localização'
    },
    {
      key: 'valorAprovado',
      label: 'Valor Aprovado',
      render: (value) => (
        <span className="fw-semibold text-success">{formatCurrency(value)}</span>
      )
    },
    {
      key: 'valorCaptado',
      label: 'Valor Captado',
      render: (value) => (
        <span className="fw-semibold text-info">{formatCurrency(value)}</span>
      )
    }
  ];

  // Get unique values for filter dropdowns
  const uniqueSituacoes = [...new Set(projetos.map(p => p.situacao))].sort();
  const uniqueSegmentos = [...new Set(projetos.map(p => p.segmento))].sort();
  const uniqueLocalizacoes = [...new Set(projetos.map(p => p.localizacao))].sort();

  return (
    <div className="projetos-lic-container">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-1">Projetos LIC</h1>
          <p className="text-muted mb-0">
            Lei de Incentivo à Cultura - Consulta de projetos e captação de recursos
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
            onClick={loadProjetosLIC}
          >
            Atualizar
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="row mb-4">
        <div className="col-md-2">
          <div className="stat-card">
            <div className="stat-number">{projetos.length}</div>
            <div className="stat-label">Total de Projetos</div>
          </div>
        </div>
        <div className="col-md-2">
          <div className="stat-card">
            <div className="stat-number">
              {projetos.filter(p => p.situacao === 'Aprovado').length}
            </div>
            <div className="stat-label">Aprovados</div>
          </div>
        </div>
        <div className="col-md-2">
          <div className="stat-card">
            <div className="stat-number">
              {projetos.filter(p => p.situacao === 'Em Captação').length}
            </div>
            <div className="stat-label">Em Captação</div>
          </div>
        </div>
        <div className="col-md-2">
          <div className="stat-card">
            <div className="stat-number">
              {projetos.reduce((sum, p) => {
                const valor = parseFloat(p.valorAprovado?.replace(/[R$\s.]/g, '').replace(',', '.') || 0);
                return sum + valor;
              }, 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}
            </div>
            <div className="stat-label">Valor Aprovado</div>
          </div>
        </div>
        <div className="col-md-2">
          <div className="stat-card">
            <div className="stat-number">
              {projetos.reduce((sum, p) => {
                const valor = parseFloat(p.valorCaptado?.replace(/[R$\s.]/g, '').replace(',', '.') || 0);
                return sum + valor;
              }, 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}
            </div>
            <div className="stat-label">Valor Captado</div>
          </div>
        </div>
        <div className="col-md-2">
          <div className="stat-card">
            <div className="stat-number">
              {projetos.length > 0 ? 
                Math.round((projetos.reduce((sum, p) => {
                  const aprovado = parseFloat(p.valorAprovado?.replace(/[R$\s.]/g, '').replace(',', '.') || 0);
                  const captado = parseFloat(p.valorCaptado?.replace(/[R$\s.]/g, '').replace(',', '.') || 0);
                  return sum + (aprovado > 0 ? (captado / aprovado) * 100 : 0);
                }, 0) / projetos.length)) : 0}%
              </div>
            <div className="stat-label">% Captação Média</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-container">
        <h6 className="mb-3">Filtros de Busca</h6>
        <div className="filters-grid">
          <div className="filter-group">
            <label className="filter-label">Processo</label>
            <input
              type="text"
              className="filter-input"
              placeholder="Digite o processo..."
              value={filters.processo}
              onChange={(e) => handleFilterChange('processo', e.target.value)}
            />
          </div>
          
          <div className="filter-group">
            <label className="filter-label">Descrição</label>
            <input
              type="text"
              className="filter-input"
              placeholder="Digite a descrição..."
              value={filters.descricao}
              onChange={(e) => handleFilterChange('descricao', e.target.value)}
            />
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

          <div className="filter-group">
            <label className="filter-label">Segmento</label>
            <select
              className="filter-input"
              value={filters.segmento}
              onChange={(e) => handleFilterChange('segmento', e.target.value)}
            >
              <option value="">Todos os segmentos</option>
              {uniqueSegmentos.map(segmento => (
                <option key={segmento} value={segmento}>
                  {segmento}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Localização</label>
            <select
              className="filter-input"
              value={filters.localizacao}
              onChange={(e) => handleFilterChange('localizacao', e.target.value)}
            >
              <option value="">Todas as localizações</option>
              {uniqueLocalizacoes.map(localizacao => (
                <option key={localizacao} value={localizacao}>
                  {localizacao}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Data Entrada (De)</label>
            <input
              type="date"
              className="filter-input"
              value={filters.dataEntradaInicio}
              onChange={(e) => handleFilterChange('dataEntradaInicio', e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label className="filter-label">Data Entrada (Até)</label>
            <input
              type="date"
              className="filter-input"
              value={filters.dataEntradaFim}
              onChange={(e) => handleFilterChange('dataEntradaFim', e.target.value)}
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

      {/* Data Table */}
      <DataTable
        data={projetos}
        columns={columns}
        loading={loading}
        onRowClick={handleRowClick}
        searchable={false}
        emptyMessage="Nenhum projeto LIC encontrado com os filtros aplicados"
      />

      {/* Modal for Project Details */}
      {showModal && selectedProjeto && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Detalhes do Projeto LIC</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <h6 className="text-muted mb-3">Informações Básicas</h6>
                    <div className="mb-3">
                      <strong>Processo:</strong> {selectedProjeto.processo}
                    </div>
                    <div className="mb-3">
                      <strong>Data de Entrada:</strong> {new Date(selectedProjeto.dataEntrada).toLocaleDateString('pt-BR')}
                    </div>
                    <div className="mb-3">
                      <strong>Descrição:</strong>
                      <div className="mt-1">{selectedProjeto.descricao}</div>
                    </div>
                    <div className="mb-3">
                      <strong>Período de Realização:</strong> {selectedProjeto.periodoRealizacao}
                    </div>
                    <div className="mb-3">
                      <strong>Situação:</strong>
                      <div className="mt-1">
                        <span className={`badge ${getSituacaoBadgeClass(selectedProjeto.situacao)}`}>
                          {selectedProjeto.situacao}
                        </span>
                      </div>
                    </div>
                    <div className="mb-3">
                      <strong>Segmento:</strong> {selectedProjeto.segmento}
                    </div>
                    <div className="mb-3">
                      <strong>Localização:</strong> {selectedProjeto.localizacao}
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <h6 className="text-muted mb-3">Valores e Captação</h6>
                    <div className="row mb-3">
                      <div className="col-6">
                        <strong>Valor Aprovado:</strong>
                        <div className="h5 text-success">{formatCurrency(selectedProjeto.valorAprovado)}</div>
                      </div>
                      <div className="col-6">
                        <strong>Valor Captado:</strong>
                        <div className="h5 text-info">{formatCurrency(selectedProjeto.valorCaptado)}</div>
                      </div>
                    </div>
                    <div className="row mb-3">
                      <div className="col-6">
                        <strong>Valor Liberado:</strong>
                        <div className="h6 text-primary">{formatCurrency(selectedProjeto.valorLiberado)}</div>
                      </div>
                      <div className="col-6">
                        <strong>Valor Autorizado:</strong>
                        <div className="h6 text-secondary">{formatCurrency(selectedProjeto.valorAutorizado)}</div>
                      </div>
                    </div>
                    
                    <h6 className="text-muted mb-3 mt-4">Prestação de Contas</h6>
                    <div className="mb-3">
                      <strong>Prestação Física:</strong>
                      <div className="mt-1">
                        <span className={`badge ${getPrestacaoContasStatus(selectedProjeto.prestacaoContasFisica)}`}>
                          {selectedProjeto.prestacaoContasFisica}
                        </span>
                      </div>
                    </div>
                    <div className="mb-3">
                      <strong>Prestação Financeira:</strong>
                      <div className="mt-1">
                        <span className={`badge ${getPrestacaoContasStatus(selectedProjeto.prestacaoContasFinanceira)}`}>
                          {selectedProjeto.prestacaoContasFinanceira}
                        </span>
                      </div>
                    </div>
                    
                    {selectedProjeto.empresasPatrocinadoras && (
                      <div className="mb-3">
                        <strong>Empresas Patrocinadoras:</strong>
                        <div className="mt-1 small">{selectedProjeto.empresasPatrocinadoras}</div>
                      </div>
                    )}
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

export default ProjetosLIC;
