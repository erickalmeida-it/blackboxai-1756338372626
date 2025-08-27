import React, { useState, useEffect } from 'react';
import DataTable from '../components/DataTable';
import { apiService } from '../services/api';

const ProjetosFAC = () => {
  const [projetos, setProjetos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    titulo: '',
    situacao: '',
    edital: '',
    modalidade: '',
    segmentoCultural: '',
    municipios: '',
    numeroProcesso: ''
  });
  const [selectedProjeto, setSelectedProjeto] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadProjetosFAC();
  }, []);

  const loadProjetosFAC = async () => {
    setLoading(true);
    try {
      const data = await apiService.getProjetosFAC(filters);
      setProjetos(data);
    } catch (error) {
      console.error('Erro ao carregar projetos FAC:', error);
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
    loadProjetosFAC();
  };

  const clearFilters = () => {
    setFilters({
      titulo: '',
      situacao: '',
      edital: '',
      modalidade: '',
      segmentoCultural: '',
      municipios: '',
      numeroProcesso: ''
    });
    setTimeout(() => {
      loadProjetosFAC();
    }, 100);
  };

  const handleRowClick = (projeto) => {
    setSelectedProjeto(projeto);
    setShowModal(true);
  };

  const exportData = async (format) => {
    try {
      const blob = await apiService.exportData('projetos-fac', format);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `projetos-fac.${format}`;
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
      case 'em execução':
        return 'bg-info';
      case 'concluído':
        return 'bg-secondary';
      default:
        return 'bg-light text-dark';
    }
  };

  const columns = [
    {
      key: 'numeroProcesso',
      label: 'Nº Processo',
      render: (value) => (
        <span className="font-monospace text-primary fw-semibold">{value}</span>
      )
    },
    {
      key: 'titulo',
      label: 'Título do Projeto',
      render: (value) => (
        <div>
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
      key: 'modalidade',
      label: 'Modalidade',
      render: (value) => (
        <span className="badge bg-light text-dark">{value}</span>
      )
    },
    {
      key: 'segmentoCultural',
      label: 'Segmento',
      render: (value) => (
        <span className="small text-muted">{value}</span>
      )
    },
    {
      key: 'municipios',
      label: 'Município(s)'
    },
    {
      key: 'valorOpcao',
      label: 'Valor',
      render: (value) => (
        <span className="fw-semibold text-success">{value}</span>
      )
    }
  ];

  // Get unique values for filter dropdowns
  const uniqueSituacoes = [...new Set(projetos.map(p => p.situacao))].sort();
  const uniqueEditais = [...new Set(projetos.map(p => p.edital))].sort();
  const uniqueModalidades = [...new Set(projetos.map(p => p.modalidade))].sort();
  const uniqueSegmentos = [...new Set(projetos.map(p => p.segmentoCultural))].sort();
  const uniqueMunicipios = [...new Set(projetos.map(p => p.municipios))].sort();

  return (
    <div className="projetos-fac-container">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-1">Projetos FAC</h1>
          <p className="text-muted mb-0">
            Fundo de Apoio à Cultura - Consulta de projetos aprovados e em análise
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
            onClick={loadProjetosFAC}
          >
            Atualizar
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="stat-card">
            <div className="stat-number">{projetos.length}</div>
            <div className="stat-label">Total de Projetos</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="stat-card">
            <div className="stat-number">
              {projetos.filter(p => p.situacao === 'Aprovado').length}
            </div>
            <div className="stat-label">Aprovados</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="stat-card">
            <div className="stat-number">
              {projetos.filter(p => p.situacao === 'Em Análise').length}
            </div>
            <div className="stat-label">Em Análise</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="stat-card">
            <div className="stat-number">
              {projetos.reduce((sum, p) => {
                const valor = parseFloat(p.valorOpcao?.replace(/[R$\s.]/g, '').replace(',', '.') || 0);
                return sum + valor;
              }, 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </div>
            <div className="stat-label">Valor Total</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-container">
        <h6 className="mb-3">Filtros de Busca</h6>
        <div className="filters-grid">
          <div className="filter-group">
            <label className="filter-label">Nº Processo</label>
            <input
              type="text"
              className="filter-input"
              placeholder="Digite o número..."
              value={filters.numeroProcesso}
              onChange={(e) => handleFilterChange('numeroProcesso', e.target.value)}
            />
          </div>
          
          <div className="filter-group">
            <label className="filter-label">Título do Projeto</label>
            <input
              type="text"
              className="filter-input"
              placeholder="Digite o título..."
              value={filters.titulo}
              onChange={(e) => handleFilterChange('titulo', e.target.value)}
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
            <label className="filter-label">Edital</label>
            <select
              className="filter-input"
              value={filters.edital}
              onChange={(e) => handleFilterChange('edital', e.target.value)}
            >
              <option value="">Todos os editais</option>
              {uniqueEditais.map(edital => (
                <option key={edital} value={edital}>
                  {edital}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Modalidade</label>
            <select
              className="filter-input"
              value={filters.modalidade}
              onChange={(e) => handleFilterChange('modalidade', e.target.value)}
            >
              <option value="">Todas as modalidades</option>
              {uniqueModalidades.map(modalidade => (
                <option key={modalidade} value={modalidade}>
                  {modalidade}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Segmento Cultural</label>
            <select
              className="filter-input"
              value={filters.segmentoCultural}
              onChange={(e) => handleFilterChange('segmentoCultural', e.target.value)}
            >
              <option value="">Todos os segmentos</option>
              {uniqueSegmentos.map(segmento => (
                <option key={segmento} value={segmento}>
                  {segmento}
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
        data={projetos}
        columns={columns}
        loading={loading}
        onRowClick={handleRowClick}
        searchable={false}
        emptyMessage="Nenhum projeto FAC encontrado com os filtros aplicados"
      />

      {/* Modal for Project Details */}
      {showModal && selectedProjeto && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Detalhes do Projeto FAC</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-8">
                    <h6 className="text-muted mb-3">Informações do Projeto</h6>
                    <div className="mb-3">
                      <strong>Título:</strong>
                      <div className="mt-1">{selectedProjeto.titulo}</div>
                    </div>
                    <div className="mb-3">
                      <strong>Número do Processo:</strong> {selectedProjeto.numeroProcesso}
                    </div>
                    <div className="mb-3">
                      <strong>Edital:</strong> {selectedProjeto.edital}
                    </div>
                    <div className="mb-3">
                      <strong>Finalidade:</strong> {selectedProjeto.finalidade}
                    </div>
                    <div className="mb-3">
                      <strong>Município(s):</strong> {selectedProjeto.municipios}
                    </div>
                  </div>
                  <div className="col-md-4">
                    <h6 className="text-muted mb-3">Status e Classificação</h6>
                    <div className="mb-3">
                      <strong>Situação:</strong>
                      <div className="mt-1">
                        <span className={`badge ${getSituacaoBadgeClass(selectedProjeto.situacao)}`}>
                          {selectedProjeto.situacao}
                        </span>
                      </div>
                    </div>
                    <div className="mb-3">
                      <strong>Modalidade:</strong> {selectedProjeto.modalidade}
                    </div>
                    <div className="mb-3">
                      <strong>Segmento Cultural:</strong> {selectedProjeto.segmentoCultural}
                    </div>
                    <div className="mb-3">
                      <strong>Valor da Opção:</strong>
                      <div className="mt-1">
                        <span className="h5 text-success">{selectedProjeto.valorOpcao}</span>
                      </div>
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

export default ProjetosFAC;
