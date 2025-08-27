import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const ChartComponent = ({ 
  type = 'bar', 
  data, 
  options = {}, 
  title = '',
  height = 300 
}) => {
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            family: 'Inter, sans-serif',
            size: 12
          }
        }
      },
      title: {
        display: !!title,
        text: title,
        font: {
          family: 'Inter, sans-serif',
          size: 16,
          weight: '600'
        },
        padding: {
          bottom: 20
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#dee2e6',
        borderWidth: 1,
        cornerRadius: 6,
        displayColors: true,
        font: {
          family: 'Inter, sans-serif'
        }
      }
    },
    scales: type !== 'doughnut' ? {
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            family: 'Inter, sans-serif',
            size: 11
          }
        }
      },
      y: {
        grid: {
          color: '#f1f3f4'
        },
        ticks: {
          font: {
            family: 'Inter, sans-serif',
            size: 11
          }
        }
      }
    } : undefined,
    ...options
  };

  const chartColors = {
    primary: '#007bff',
    secondary: '#6c757d',
    success: '#28a745',
    info: '#17a2b8',
    warning: '#ffc107',
    danger: '#dc3545',
    light: '#f8f9fa',
    dark: '#343a40'
  };

  const generateColors = (count) => {
    const colors = Object.values(chartColors);
    const result = [];
    for (let i = 0; i < count; i++) {
      result.push(colors[i % colors.length]);
    }
    return result;
  };

  const processedData = {
    ...data,
    datasets: data.datasets?.map((dataset, index) => ({
      ...dataset,
      backgroundColor: dataset.backgroundColor || (
        type === 'doughnut' 
          ? generateColors(data.labels?.length || 1)
          : generateColors(1)[0]
      ),
      borderColor: dataset.borderColor || (
        type === 'line' 
          ? generateColors(1)[0]
          : 'transparent'
      ),
      borderWidth: dataset.borderWidth || (type === 'line' ? 2 : 0),
      borderRadius: type === 'bar' ? 4 : 0,
      tension: type === 'line' ? 0.4 : 0
    }))
  };

  const renderChart = () => {
    switch (type) {
      case 'bar':
        return <Bar data={processedData} options={defaultOptions} />;
      case 'doughnut':
        return <Doughnut data={processedData} options={defaultOptions} />;
      case 'line':
        return <Line data={processedData} options={defaultOptions} />;
      default:
        return <Bar data={processedData} options={defaultOptions} />;
    }
  };

  return (
    <div className="chart-container" style={{ height: `${height}px` }}>
      {renderChart()}
    </div>
  );
};

// Predefined chart configurations for common use cases
export const StatisticsCharts = {
  // Distribution by segment
  segmentDistribution: (data) => ({
    type: 'doughnut',
    data: {
      labels: data.map(item => item.segment),
      datasets: [{
        data: data.map(item => item.count),
        backgroundColor: [
          '#007bff', '#28a745', '#ffc107', '#dc3545', 
          '#17a2b8', '#6c757d', '#fd7e14', '#6f42c1'
        ]
      }]
    },
    title: 'Distribuição por Segmento Cultural'
  }),

  // Projects by municipality
  municipalityProjects: (data) => ({
    type: 'bar',
    data: {
      labels: data.map(item => item.municipality),
      datasets: [{
        label: 'Projetos',
        data: data.map(item => item.projects),
        backgroundColor: '#007bff'
      }]
    },
    title: 'Projetos por Município'
  }),

  // Monthly trend
  monthlyTrend: (data) => ({
    type: 'line',
    data: {
      labels: data.map(item => item.month),
      datasets: [{
        label: 'Projetos Aprovados',
        data: data.map(item => item.approved),
        borderColor: '#28a745',
        backgroundColor: 'rgba(40, 167, 69, 0.1)'
      }, {
        label: 'Projetos Submetidos',
        data: data.map(item => item.submitted),
        borderColor: '#007bff',
        backgroundColor: 'rgba(0, 123, 255, 0.1)'
      }]
    },
    title: 'Tendência Mensal de Projetos'
  }),

  // Budget distribution
  budgetDistribution: (data) => ({
    type: 'bar',
    data: {
      labels: data.map(item => item.category),
      datasets: [{
        label: 'Valor Aprovado (R$)',
        data: data.map(item => item.approved),
        backgroundColor: '#28a745'
      }, {
        label: 'Valor Captado (R$)',
        data: data.map(item => item.raised),
        backgroundColor: '#007bff'
      }]
    },
    title: 'Distribuição Orçamentária'
  })
};

export default ChartComponent;
