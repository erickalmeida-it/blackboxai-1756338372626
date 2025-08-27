# ProCultura RS - Frontend Dashboard

Sistema de consulta e visualização de dados culturais do Rio Grande do Sul.

## Características

- **Dashboard Interativo**: Visualização de estatísticas com gráficos Chart.js
- **Tabelas de Dados**: Componente DataTable com filtros, ordenação e paginação
- **Mapa Interativo**: Integração com Leaflet para visualização geográfica
- **Interface Responsiva**: Design moderno com Bootstrap 5 e CSS customizado
- **Autenticação**: Sistema de login com JWT
- **Exportação**: Funcionalidade para exportar dados em CSV, Excel e PDF

## Páginas Principais

1. **Dashboard**: Visão geral com estatísticas e gráficos
2. **Produtores**: Consulta de produtores culturais cadastrados
3. **Projetos FAC**: Projetos do Fundo de Apoio à Cultura
4. **Projetos LIC**: Projetos da Lei de Incentivo à Cultura
5. **Notícias**: Últimas notícias e avisos da secretaria
6. **Controle de Scraping**: Gerenciamento da coleta de dados

## Tecnologias Utilizadas

- React 18
- React Router DOM
- Chart.js & React-Chartjs-2
- Leaflet & React-Leaflet
- Bootstrap 5
- Axios
- Google Fonts (Inter)

## Credenciais de Demonstração

- **E-mail**: admin@procultura.rs.gov.br
- **Senha**: admin123

## Como Executar

```bash
npm install
npm start
```

O aplicativo será executado em http://localhost:3000

## Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── ChartComponent.js
│   ├── DataTable.js
│   ├── Login.js
│   ├── MapView.js
│   ├── Navbar.js
│   └── Sidebar.js
├── routes/             # Páginas principais
│   ├── Dashboard.js
│   ├── Noticias.js
│   ├── ProjetosFAC.js
│   ├── ProjetosLIC.js
│   ├── Produtores.js
│   └── ScrapingControl.js
├── services/           # Serviços de API e autenticação
│   ├── api.js
│   └── auth.js
└── styles/            # Estilos CSS
    └── App.css
```

## Funcionalidades

### Dashboard
- Estatísticas gerais do sistema
- Gráficos de distribuição por segmento
- Mapa interativo com marcadores
- Últimas notícias

### Tabelas de Dados
- Filtros avançados por múltiplos campos
- Ordenação por colunas
- Paginação
- Busca textual
- Exportação de dados

### Mapa Interativo
- Visualização geográfica dos dados
- Marcadores customizados por tipo
- Popups informativos
- Legenda de cores

### Autenticação
- Login seguro com JWT
- Controle de sessão
- Proteção de rotas

## API Mock

O sistema inclui dados mock para demonstração, permitindo testar todas as funcionalidades sem necessidade de backend.
