import React, { useState, useEffect } from 'react';
import ChartComponent, { StatisticsCharts } from '../components/ChartComponent';
import MapView, { generateMockMapData } from '../components/MapView';
import { apiService } from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mapData, setMapData] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState('2024');

  useEffect(() => {
    loadDashboardData();
  }, [selectedPeriod]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const statisticsData = await apiService.getEstatisticas();
      setStats(statisticsData);
      
      // Generate mock map data
      const mockMapData = generateMockMapData();
      setMapData(mockMapData);
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  // Mock chart data
  const segmentData = [
    { segment: 'Música', count: 1245 },
    { segment: 'Teatro', count: 987 },
    { segment: 'Dança', count: 654 },
    { segment: 'Artes Visuais', count: 543 },
    { segment: 'Literatura', count: 432 },
    { segment: 'Cinema', count: 321 }
  ];

  const municipalityData = [
    { municipality: 'Porto Alegre', projects: 245 },
    { municipality: 'Caxias do Sul', projects: 187 },
    { municipality: 'Pelotas', projects: 123 },
    { municipality: 'Canoas', projects: 98 },
    { municipality: 'Santa Maria', projects: 87 }
  ];

  const monthlyData = [
    { month: 'Jan', approved: 45, submitted: 67 },
    { month: 'Fev', approved: 52, submitted: 78 },
    { month: 'Mar', approved: 48, submitted: 71 },
    { month: 'Abr', approved: 61, submitted: 89 },
    { month: 'Mai', approved: 55, submitted: 82 },
    { month: 'Jun', approved: 67, submitted: 95 }
  ];

  const budgetData = [
    { category: 'FAC', approved: 2500000, raised: 1800000 },
    { category: 'LIC', approved: 3200000, raised: 2900000 },
    { category: 'PNAB', approved: 1800000, raised: 1200000 }
  ];

  const handleMapMarkerClick = (item) => {
    console.log('Marker clicked:', item);
    // Here you could open a modal or navigate to details
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-1">Dashboard ProCultura RS</h1>
          <p className="text-muted mb-0">Visão geral dos dados culturais do Rio Grande do Sul</p>
        </div>
        <div className="d-flex gap-2">
          <select 
            className="filter-input"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
          >
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
          </select>
          <button 
            className="btn-primary-custom"
            onClick={loadDashboardData}
          >
            Atualizar
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{stats?.totalMunicipios || 0}</div>
          <div className="stat-label">Municípios</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats?.totalProdutores?.toLocaleString('pt-BR') || 0}</div>
          <div className="stat-label">Produtores Culturais</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats?.totalProjetosFAC?.toLocaleString('pt-BR') || 0}</div>
          <div className="stat-label">Projetos FAC</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats?.totalProjetosLIC?.toLocaleString('pt-BR') || 0}</div>
          <div className="stat-label">Projetos LIC</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats?.totalNoticias || 0}</div>
          <div className="stat-label">Notícias</div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="row mb-4">
        <div className="col-lg-6">
          <div className="card-custom">
            <div className="card-header-custom">
              Distribuição por Segmento Cultural
            </div>
            <div className="card-body-custom">
              <ChartComponent 
                {...StatisticsCharts.segmentDistribution(segmentData)}
                height={350}
              />
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="card-custom">
            <div className="card-header-custom">
              Top 5 Municípios por Projetos
            </div>
            <div className="card-body-custom">
              <ChartComponent 
                {...StatisticsCharts.municipalityProjects(municipalityData)}
                height={350}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="row mb-4">
        <div className="col-lg-8">
          <div className="card-custom">
            <div className="card-header-custom">
              Tendência Mensal de Projetos - {selectedPeriod}
            </div>
            <div className="card-body-custom">
              <ChartComponent 
                {...StatisticsCharts.monthlyTrend(monthlyData)}
                height={350}
              />
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card-custom">
            <div className="card-header-custom">
              Distribuição Orçamentária
            </div>
            <div className="card-body-custom">
              <ChartComponent 
                {...StatisticsCharts.budgetDistribution(budgetData)}
                height={350}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="row mb-4">
        <div className="col-12">
          <MapView 
            data={mapData}
            onMarkerClick={handleMapMarkerClick}
            height={500}
          />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="row">
        <div className="col-lg-6">
          <div className="card-custom">
            <div className="card-header-custom">
              Últimas Notícias
            </div>
            <div className="card-body-custom">
              <div className="list-group list-group-flush">
                <div className="list-group-item border-0 px-0">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h6 className="mb-1">Governador anuncia investimento de R$ 30,93 milhões</h6>
                      <p className="mb-1 text-muted small">
                        Além dos repasses oriundos do Fundo de Apoio à Cultura...
                      </p>
                      <small className="text-muted">25/08/2025</small>
                    </div>
                  </div>
                </div>
                <div className="list-group-item border-0 px-0">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h6 className="mb-1">Editais da LIC contemplam mais 14 projetos</h6>
                      <p className="mb-1 text-muted small">
                        Voltadas a ações de produção e fruição cultural...
                      </p>
                      <small className="text-muted">14/08/2025</small>
                    </div>
                  </div>
                </div>
                <div className="list-group-item border-0 px-0">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h6 className="mb-1">Sedac lança novo edital da LIC</h6>
                      <p className="mb-1 text-muted small">
                        Voltada a eventos continuados e temáticos...
                      </p>
                      <small className="text-muted">01/08/2025</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-lg-6">
          <div className="card-custom">
            <div className="card-header-custom">
              Resumo de Atividades
            </div>
            <div className="card-body-custom">
              <div className="row text-center">
                <div className="col-6 mb-3">
                  <div className="border rounded p-3">
                    <div className="h4 text-success mb-1">156</div>
                    <small className="text-muted">Projetos Aprovados</small>
                  </div>
                </div>
                <div className="col-6 mb-3">
                  <div className="border rounded p-3">
                    <div className="h4 text-warning mb-1">89</div>
                    <small className="text-muted">Em Análise</small>
                  </div>
                </div>
                <div className="col-6 mb-3">
                  <div className="border rounded p-3">
                    <div className="h4 text-info mb-1">234</div>
                    <small className="text-muted">Produtores Ativos</small>
                  </div>
                </div>
                <div className="col-6 mb-3">
                  <div className="border rounded p-3">
                    <div className="h4 text-primary mb-1">67</div>
                    <small className="text-muted">Municípios Participantes</small>
                  </div>
                </div>
              </div>
              
              <div className="mt-3 pt-3 border-top">
                <h6 className="mb-2">Últimas Atualizações</h6>
                <div className="small text-muted">
                  <div className="mb-1">• Scraping executado em 20/01/2024 às 10:30</div>
                  <div className="mb-1">• 15 novos produtores cadastrados</div>
                  <div className="mb-1">• 8 projetos FAC aprovados</div>
                  <div className="mb-1">• 3 projetos LIC em captação</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
