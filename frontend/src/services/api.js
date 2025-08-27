import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('procultura_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('procultura_token');
      localStorage.removeItem('procultura_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Mock data for development
const mockData = {
  estatisticas: {
    totalMunicipios: 497,
    totalProdutores: 8542,
    totalProjetosFAC: 2847,
    totalProjetosLIC: 1923,
    totalNoticias: 156
  },
  municipios: [
    { id: 1, nome: 'Porto Alegre', produtores: 1245 },
    { id: 2, nome: 'Caxias do Sul', produtores: 687 },
    { id: 3, nome: 'Pelotas', produtores: 423 },
    { id: 4, nome: 'Canoas', produtores: 312 },
    { id: 5, nome: 'Santa Maria', produtores: 298 }
  ],
  produtores: [
    {
      id: 1,
      cepc: 'CEPC001234',
      nome: 'Associação Cultural Gaúcha',
      responsavelLegal: 'João Silva',
      tipoPessoa: 'Jurídica',
      municipio: 'Porto Alegre',
      email: 'contato@acgaucha.org.br',
      situacao: 'Ativo',
      projetosVinculados: 'FAC, LIC'
    },
    {
      id: 2,
      cepc: 'CEPC005678',
      nome: 'Maria Santos',
      responsavelLegal: null,
      tipoPessoa: 'Física',
      municipio: 'Caxias do Sul',
      email: 'maria.santos@email.com',
      situacao: 'Ativo',
      projetosVinculados: 'FAC'
    },
    {
      id: 3,
      cepc: 'CEPC009876',
      nome: 'Centro Cultural Pelotense',
      responsavelLegal: 'Ana Costa',
      tipoPessoa: 'Jurídica',
      municipio: 'Pelotas',
      email: 'centro@pelotense.org.br',
      situacao: 'Ativo',
      projetosVinculados: 'LIC'
    }
  ],
  projetosFAC: [
    {
      id: 1,
      titulo: 'Festival de Música Gaúcha',
      situacao: 'Aprovado',
      numeroProcesso: 'FAC2024001',
      edital: 'Edital FAC 2024',
      modalidade: 'Música',
      finalidade: 'Produção Cultural',
      segmentoCultural: 'Música',
      municipios: 'Porto Alegre',
      valorOpcao: 'R$ 50.000,00'
    },
    {
      id: 2,
      titulo: 'Mostra de Teatro Regional',
      situacao: 'Em Análise',
      numeroProcesso: 'FAC2024002',
      edital: 'Edital FAC 2024',
      modalidade: 'Teatro',
      finalidade: 'Difusão Cultural',
      segmentoCultural: 'Artes Cênicas',
      municipios: 'Caxias do Sul',
      valorOpcao: 'R$ 35.000,00'
    }
  ],
  projetosLIC: [
    {
      id: 1,
      processo: 'LIC2024001',
      dataEntrada: '2024-01-15',
      situacao: 'Aprovado',
      segmento: 'Música',
      localizacao: 'Porto Alegre',
      descricao: 'Concerto Sinfônico de Inverno',
      periodoRealizacao: '2024-06-01 a 2024-06-30',
      valorAprovado: 'R$ 120.000,00',
      valorCaptado: 'R$ 85.000,00',
      valorLiberado: 'R$ 60.000,00',
      valorAutorizado: 'R$ 120.000,00',
      prestacaoContasFisica: 'Aprovada',
      prestacaoContasFinanceira: 'Em Análise',
      empresasPatrocinadoras: 'Empresa A (CNPJ: 12.345.678/0001-90)',
      valorConcedido: 'R$ 120.000,00'
    }
  ],
  noticias: [
    {
      id: 1,
      dataPublicacao: '2024-01-20',
      titulo: 'Governador anuncia investimento de R$ 30,93 milhões para cultura',
      conteudo: 'Além dos repasses oriundos do Fundo de Apoio à Cultura e das prefeituras, também foram liberados R$ 10,7 milhões por meio da LIC'
    },
    {
      id: 2,
      dataPublicacao: '2024-01-18',
      titulo: 'Em terceira seletiva, editais da LIC contemplam mais 14 projetos culturais',
      conteudo: 'Voltadas a ações de produção e fruição cultural e de patrimônio e espaços públicos, seleções recebem inscrições até fim do mês'
    }
  ]
};

// API functions
export const apiService = {
  // Statistics
  getEstatisticas: async () => {
    try {
      const response = await api.get('/estatisticas');
      return response.data;
    } catch (error) {
      console.log('Using mock data for statistics');
      return mockData.estatisticas;
    }
  },

  // Municipalities
  getMunicipios: async (params = {}) => {
    try {
      const response = await api.get('/municipios', { params });
      return response.data;
    } catch (error) {
      console.log('Using mock data for municipalities');
      return mockData.municipios;
    }
  },

  // Producers
  getProdutores: async (params = {}) => {
    try {
      const response = await api.get('/produtores', { params });
      return response.data;
    } catch (error) {
      console.log('Using mock data for producers');
      return mockData.produtores;
    }
  },

  getProdutorById: async (id) => {
    try {
      const response = await api.get(`/produtores/${id}`);
      return response.data;
    } catch (error) {
      console.log('Using mock data for producer details');
      return mockData.produtores.find(p => p.id === parseInt(id));
    }
  },

  // FAC Projects
  getProjetosFAC: async (params = {}) => {
    try {
      const response = await api.get('/projetos/fac', { params });
      return response.data;
    } catch (error) {
      console.log('Using mock data for FAC projects');
      return mockData.projetosFAC;
    }
  },

  // LIC Projects
  getProjetosLIC: async (params = {}) => {
    try {
      const response = await api.get('/projetos/lic', { params });
      return response.data;
    } catch (error) {
      console.log('Using mock data for LIC projects');
      return mockData.projetosLIC;
    }
  },

  // News
  getNoticias: async (params = {}) => {
    try {
      const response = await api.get('/noticias', { params });
      return response.data;
    } catch (error) {
      console.log('Using mock data for news');
      return mockData.noticias;
    }
  },

  // Scraping control
  startScraping: async () => {
    try {
      const response = await api.post('/scraping/start');
      return response.data;
    } catch (error) {
      console.log('Mock scraping started');
      return { success: true, message: 'Scraping iniciado com sucesso (modo demo)' };
    }
  },

  getScrapingStatus: async () => {
    try {
      const response = await api.get('/scraping/status');
      return response.data;
    } catch (error) {
      console.log('Using mock scraping status');
      return {
        status: 'idle',
        lastRun: '2024-01-20 10:30:00',
        progress: 0,
        logs: [
          { timestamp: '2024-01-20 10:30:00', message: 'Scraping iniciado' },
          { timestamp: '2024-01-20 10:31:00', message: 'Coletando municípios...' },
          { timestamp: '2024-01-20 10:32:00', message: 'Scraping concluído com sucesso' }
        ]
      };
    }
  },

  // Export data
  exportData: async (type, format = 'csv') => {
    try {
      const response = await api.get(`/export/${type}`, {
        params: { format },
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      throw new Error('Erro ao exportar dados');
    }
  }
};

export default api;
