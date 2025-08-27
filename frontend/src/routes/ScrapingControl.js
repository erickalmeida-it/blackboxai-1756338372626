import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';

const ScrapingControl = () => {
  const [scrapingStatus, setScrapingStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState([]);
  const [lastRun, setLastRun] = useState(null);

  useEffect(() => {
    loadScrapingStatus();
    // Poll status every 5 seconds when scraping is running
    const interval = setInterval(() => {
      if (isRunning) {
        loadScrapingStatus();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isRunning]);

  const loadScrapingStatus = async () => {
    try {
      const status = await apiService.getScrapingStatus();
      setScrapingStatus(status);
      setIsRunning(status.status === 'running');
      setProgress(status.progress || 0);
      setLogs(status.logs || []);
      setLastRun(status.lastRun);
    } catch (error) {
      console.error('Erro ao carregar status do scraping:', error);
    } finally {
      setLoading(false);
    }
  };

  const startScraping = async () => {
    try {
      setIsRunning(true);
      setProgress(0);
      const result = await apiService.startScraping();
      if (result.success) {
        addLog('Scraping iniciado com sucesso');
        // Simulate progress for demo
        simulateProgress();
      } else {
        addLog('Erro ao iniciar scraping: ' + result.message);
        setIsRunning(false);
      }
    } catch (error) {
      console.error('Erro ao iniciar scraping:', error);
      addLog('Erro ao iniciar scraping: ' + error.message);
      setIsRunning(false);
    }
  };

  const simulateProgress = () => {
    let currentProgress = 0;
    const steps = [
      { progress: 10, message: 'Conectando ao site ProCultura...' },
      { progress: 20, message: 'Coletando lista de municípios...' },
      { progress: 35, message: 'Processando produtores culturais...' },
      { progress: 50, message: 'Coletando projetos FAC...' },
      { progress: 70, message: 'Coletando projetos LIC...' },
      { progress: 85, message: 'Coletando notícias e avisos...' },
      { progress: 95, message: 'Salvando dados no banco...' },
      { progress: 100, message: 'Scraping concluído com sucesso!' }
    ];

    steps.forEach((step, index) => {
      setTimeout(() => {
        setProgress(step.progress);
        addLog(step.message);
        if (step.progress === 100) {
          setIsRunning(false);
          setLastRun(new Date().toLocaleString('pt-BR'));
        }
      }, (index + 1) * 2000);
    });
  };

  const addLog = (message) => {
    const newLog = {
      timestamp: new Date().toLocaleString('pt-BR'),
      message: message
    };
    setLogs(prev => [newLog, ...prev.slice(0, 49)]); // Keep last 50 logs
  };

  const clearLogs = () => {
    setLogs([]);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'running':
        return <span className="badge bg-warning">Em Execução</span>;
      case 'completed':
        return <span className="badge bg-success">Concluído</span>;
      case 'error':
        return <span className="badge bg-danger">Erro</span>;
      case 'idle':
      default:
        return <span className="badge bg-secondary">Parado</span>;
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'Nunca executado';
    return new Date(dateString).toLocaleString('pt-BR');
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="scraping-control-container">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-1">Controle de Scraping</h1>
          <p className="text-muted mb-0">
            Gerenciamento da coleta automática de dados do ProCultura RS
          </p>
        </div>
        <div className="d-flex gap-2">
          <button 
            className="btn-secondary-custom"
            onClick={loadScrapingStatus}
          >
            Atualizar Status
          </button>
          <button 
            className="btn-primary-custom"
            onClick={startScraping}
            disabled={isRunning}
          >
            {isRunning ? 'Executando...' : 'Iniciar Scraping'}
          </button>
        </div>
      </div>

      {/* Status Cards */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="stat-card">
            <div className="stat-number">
              {getStatusBadge(scrapingStatus?.status || 'idle')}
            </div>
            <div className="stat-label">Status Atual</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="stat-card">
            <div className="stat-number">{progress}%</div>
            <div className="stat-label">Progresso</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="stat-card">
            <div className="stat-number">{logs.length}</div>
            <div className="stat-label">Logs Registrados</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="stat-card">
            <div className="stat-number" style={{ fontSize: '1rem' }}>
              {formatDateTime(lastRun)}
            </div>
            <div className="stat-label">Última Execução</div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      {isRunning && (
        <div className="card-custom mb-4">
          <div className="card-header-custom">
            Progresso da Execução
          </div>
          <div className="card-body-custom">
            <div className="progress mb-3" style={{ height: '20px' }}>
              <div 
                className="progress-bar progress-bar-striped progress-bar-animated bg-primary" 
                role="progressbar" 
                style={{ width: `${progress}%` }}
              >
                {progress}%
              </div>
            </div>
            <div className="d-flex justify-content-between text-muted small">
              <span>Iniciado</span>
              <span>Coletando dados...</span>
              <span>Concluído</span>
            </div>
          </div>
        </div>
      )}

      {/* Configuration */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card-custom">
            <div className="card-header-custom">
              Configurações de Scraping
            </div>
            <div className="card-body-custom">
              <div className="mb-3">
                <label className="form-label">URL Base</label>
                <input 
                  type="text" 
                  className="filter-input" 
                  value="https://procultura.rs.gov.br/" 
                  readOnly 
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Intervalo entre Requisições (ms)</label>
                <input 
                  type="number" 
                  className="filter-input" 
                  defaultValue="1000" 
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Timeout (segundos)</label>
                <input 
                  type="number" 
                  className="filter-input" 
                  defaultValue="30" 
                />
              </div>
              <div className="form-check">
                <input 
                  className="form-check-input" 
                  type="checkbox" 
                  id="updateExisting" 
                  defaultChecked 
                />
                <label className="form-check-label" htmlFor="updateExisting">
                  Atualizar registros existentes
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card-custom">
            <div className="card-header-custom">
              Estatísticas da Última Execução
            </div>
            <div className="card-body-custom">
              <div className="row text-center">
                <div className="col-6 mb-3">
                  <div className="border rounded p-2">
                    <div className="h5 text-primary mb-1">497</div>
                    <small className="text-muted">Municípios</small>
                  </div>
                </div>
                <div className="col-6 mb-3">
                  <div className="border rounded p-2">
                    <div className="h5 text-success mb-1">8,542</div>
                    <small className="text-muted">Produtores</small>
                  </div>
                </div>
                <div className="col-6 mb-3">
                  <div className="border rounded p-2">
                    <div className="h5 text-info mb-1">2,847</div>
                    <small className="text-muted">Projetos FAC</small>
                  </div>
                </div>
                <div className="col-6 mb-3">
                  <div className="border rounded p-2">
                    <div className="h5 text-warning mb-1">1,923</div>
                    <small className="text-muted">Projetos LIC</small>
                  </div>
                </div>
              </div>
              <div className="text-center mt-3">
                <small className="text-muted">
                  Tempo de execução: 45 minutos<br />
                  Dados atualizados: 156 registros
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Logs */}
      <div className="card-custom">
        <div className="card-header-custom">
          <div className="d-flex justify-content-between align-items-center">
            <span>Logs de Execução</span>
            <button 
              className="btn btn-sm btn-outline-secondary"
              onClick={clearLogs}
            >
              Limpar Logs
            </button>
          </div>
        </div>
        <div className="card-body-custom p-0">
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {logs.length === 0 ? (
              <div className="p-3 text-center text-muted">
                Nenhum log disponível
              </div>
            ) : (
              logs.map((log, index) => (
                <div 
                  key={index} 
                  className={`p-3 border-bottom ${index % 2 === 0 ? 'bg-light' : ''}`}
                >
                  <div className="d-flex justify-content-between align-items-start">
                    <div className="flex-grow-1">
                      <span className="text-dark">{log.message}</span>
                    </div>
                    <small className="text-muted ms-3 text-nowrap">
                      {log.timestamp}
                    </small>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Schedule Configuration */}
      <div className="card-custom mt-4">
        <div className="card-header-custom">
          Agendamento Automático
        </div>
        <div className="card-body-custom">
          <div className="row">
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label">Frequência</label>
                <select className="filter-input">
                  <option value="manual">Manual</option>
                  <option value="daily">Diário</option>
                  <option value="weekly">Semanal</option>
                  <option value="monthly">Mensal</option>
                </select>
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label">Horário</label>
                <input 
                  type="time" 
                  className="filter-input" 
                  defaultValue="02:00" 
                />
              </div>
            </div>
          </div>
          <div className="d-flex gap-2">
            <button className="btn-primary-custom">
              Salvar Configuração
            </button>
            <button className="btn-secondary-custom">
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScrapingControl;
