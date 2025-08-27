import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

// Fix for default markers in Leaflet with React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.8.0/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.8.0/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.8.0/images/marker-shadow.png',
});

const MapView = ({ 
  data = [], 
  center = [-30.0346, -51.2177], // Porto Alegre coordinates
  zoom = 7,
  height = 500,
  onMarkerClick = null,
  showClusters = true
}) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  // Custom marker colors based on data type
  const getMarkerColor = (item) => {
    if (item.type === 'produtor') return '#007bff';
    if (item.type === 'fac') return '#28a745';
    if (item.type === 'lic') return '#ffc107';
    return '#6c757d';
  };

  // Create custom marker icon
  const createCustomIcon = (color, type) => {
    const svgIcon = `
      <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
        <path fill="${color}" stroke="#fff" stroke-width="2" 
              d="M12.5 0C5.6 0 0 5.6 0 12.5c0 12.5 12.5 28.5 12.5 28.5s12.5-16 12.5-28.5C25 5.6 19.4 0 12.5 0z"/>
        <circle fill="#fff" cx="12.5" cy="12.5" r="6"/>
        <text x="12.5" y="17" text-anchor="middle" font-size="8" font-weight="bold" fill="${color}">
          ${type === 'produtor' ? 'P' : type === 'fac' ? 'F' : type === 'lic' ? 'L' : '?'}
        </text>
      </svg>
    `;
    
    return L.divIcon({
      html: svgIcon,
      className: 'custom-marker',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34]
    });
  };

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    mapInstanceRef.current = L.map(mapRef.current).setView(center, zoom);

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 18
    }).addTo(mapInstanceRef.current);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [center, zoom]);

  // Update markers when data changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => {
      mapInstanceRef.current.removeLayer(marker);
    });
    markersRef.current = [];

    // Add new markers
    data.forEach(item => {
      if (item.latitude && item.longitude) {
        const marker = L.marker([item.latitude, item.longitude], {
          icon: createCustomIcon(getMarkerColor(item), item.type)
        });

        // Create popup content
        const popupContent = `
          <div style="font-family: Inter, sans-serif; min-width: 200px;">
            <h6 style="margin: 0 0 8px 0; color: #212529; font-weight: 600;">
              ${item.name || item.title || 'Sem título'}
            </h6>
            <div style="font-size: 12px; color: #6c757d; margin-bottom: 8px;">
              <strong>Tipo:</strong> ${item.type === 'produtor' ? 'Produtor Cultural' : 
                                      item.type === 'fac' ? 'Projeto FAC' : 
                                      item.type === 'lic' ? 'Projeto LIC' : 'Desconhecido'}
            </div>
            ${item.municipality ? `
              <div style="font-size: 12px; color: #6c757d; margin-bottom: 8px;">
                <strong>Município:</strong> ${item.municipality}
              </div>
            ` : ''}
            ${item.segment ? `
              <div style="font-size: 12px; color: #6c757d; margin-bottom: 8px;">
                <strong>Segmento:</strong> ${item.segment}
              </div>
            ` : ''}
            ${item.status ? `
              <div style="font-size: 12px; color: #6c757d; margin-bottom: 8px;">
                <strong>Status:</strong> ${item.status}
              </div>
            ` : ''}
            ${item.value ? `
              <div style="font-size: 12px; color: #6c757d; margin-bottom: 8px;">
                <strong>Valor:</strong> ${item.value}
              </div>
            ` : ''}
            ${onMarkerClick ? `
              <button onclick="window.handleMarkerClick('${item.id}')" 
                      style="background: #007bff; color: white; border: none; 
                             padding: 4px 8px; border-radius: 4px; font-size: 11px; 
                             cursor: pointer; margin-top: 8px;">
                Ver Detalhes
              </button>
            ` : ''}
          </div>
        `;

        marker.bindPopup(popupContent);
        marker.addTo(mapInstanceRef.current);
        markersRef.current.push(marker);

        // Handle marker click
        if (onMarkerClick) {
          marker.on('click', () => onMarkerClick(item));
        }
      }
    });

    // Fit map to markers if there are any
    if (markersRef.current.length > 0) {
      const group = new L.featureGroup(markersRef.current);
      mapInstanceRef.current.fitBounds(group.getBounds().pad(0.1));
    }

  }, [data, onMarkerClick]);

  // Global function for popup button clicks
  useEffect(() => {
    window.handleMarkerClick = (itemId) => {
      const item = data.find(d => d.id.toString() === itemId);
      if (item && onMarkerClick) {
        onMarkerClick(item);
      }
    };

    return () => {
      delete window.handleMarkerClick;
    };
  }, [data, onMarkerClick]);

  return (
    <div className="map-container">
      <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
        <h6 className="mb-0">Mapa de Localização</h6>
        <div className="d-flex gap-3">
          <div className="d-flex align-items-center">
            <div style={{
              width: '12px',
              height: '12px',
              backgroundColor: '#007bff',
              borderRadius: '50%',
              marginRight: '6px'
            }}></div>
            <small>Produtores</small>
          </div>
          <div className="d-flex align-items-center">
            <div style={{
              width: '12px',
              height: '12px',
              backgroundColor: '#28a745',
              borderRadius: '50%',
              marginRight: '6px'
            }}></div>
            <small>FAC</small>
          </div>
          <div className="d-flex align-items-center">
            <div style={{
              width: '12px',
              height: '12px',
              backgroundColor: '#ffc107',
              borderRadius: '50%',
              marginRight: '6px'
            }}></div>
            <small>LIC</small>
          </div>
        </div>
      </div>
      <div 
        ref={mapRef} 
        style={{ height: `${height}px`, width: '100%' }}
      />
    </div>
  );
};

// Mock data generator for demonstration
export const generateMockMapData = () => {
  const municipalities = [
    { name: 'Porto Alegre', lat: -30.0346, lng: -51.2177 },
    { name: 'Caxias do Sul', lat: -29.1678, lng: -51.1794 },
    { name: 'Pelotas', lat: -31.7654, lng: -52.3376 },
    { name: 'Canoas', lat: -29.9177, lng: -51.1794 },
    { name: 'Santa Maria', lat: -29.6842, lng: -53.8069 },
    { name: 'Gravataí', lat: -29.9442, lng: -50.9929 },
    { name: 'Viamão', lat: -30.0811, lng: -51.0233 },
    { name: 'Novo Hamburgo', lat: -29.6783, lng: -51.1309 },
    { name: 'São Leopoldo', lat: -29.7604, lng: -51.1480 },
    { name: 'Rio Grande', lat: -32.0350, lng: -52.0986 }
  ];

  const types = ['produtor', 'fac', 'lic'];
  const segments = ['Música', 'Teatro', 'Dança', 'Artes Visuais', 'Literatura', 'Cinema'];
  const statuses = ['Ativo', 'Aprovado', 'Em Análise', 'Concluído'];

  return municipalities.flatMap(municipality => 
    Array.from({ length: Math.floor(Math.random() * 5) + 1 }, (_, index) => {
      const type = types[Math.floor(Math.random() * types.length)];
      return {
        id: `${municipality.name}-${type}-${index}`,
        name: type === 'produtor' 
          ? `Produtor Cultural ${index + 1}`
          : `Projeto ${type.toUpperCase()} ${index + 1}`,
        type,
        latitude: municipality.lat + (Math.random() - 0.5) * 0.1,
        longitude: municipality.lng + (Math.random() - 0.5) * 0.1,
        municipality: municipality.name,
        segment: segments[Math.floor(Math.random() * segments.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        value: type !== 'produtor' ? `R$ ${(Math.random() * 100000 + 10000).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}` : null
      };
    })
  );
};

export default MapView;
