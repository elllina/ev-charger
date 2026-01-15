import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { DivIcon, type LatLngExpression } from 'leaflet';
import type { Station } from '../types';
import 'leaflet/dist/leaflet.css';

interface StationMapProps {
  stations: Station[];
  center?: [number, number];
  zoom?: number;
}

// Custom EV charger icon using SVG
const createEvIcon = (available: boolean) => {
  const color = available ? '#22c55e' : '#ef4444'; // green or red
  const bgColor = available ? '#dcfce7' : '#fee2e2';

  return new DivIcon({
    className: 'ev-marker',
    html: `
      <div style="
        width: 36px;
        height: 36px;
        background: ${bgColor};
        border: 3px solid ${color};
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      ">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="${color}">
          <path d="M19.77 7.23l.01-.01-3.72-3.72L15 4.56l2.11 2.11c-.94.36-1.61 1.26-1.61 2.33 0 1.38 1.12 2.5 2.5 2.5.36 0 .69-.08 1-.21v7.21c0 .55-.45 1-1 1s-1-.45-1-1V14c0-1.1-.9-2-2-2h-1V5c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2v16h10v-7.5h1.5v5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V9c0-.69-.28-1.32-.73-1.77zM12 13.5V19H6v-7h6v1.5zm0-3.5H6V5h6v5z"/>
        </svg>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18],
  });
};


// Component to handle map centering
function MapCenterController({ center, stations }: { center: LatLngExpression; stations: Station[] }) {
  const map = useMap();

  useEffect(() => {
    if (stations.length > 0) {
      // Center map on first station if available
      const firstStation = stations[0];
      map.setView([firstStation.latitude, firstStation.longitude], map.getZoom());
    } else {
      map.setView(center, map.getZoom());
    }
  }, [map, center, stations]);

  return null;
}

export const StationMap: React.FC<StationMapProps> = ({
  stations,
  center = [40.1872, 44.5152], // Yerevan, Armenia
  zoom = 12,
}) => {
  return (
    <div style={{ height: '600px', width: '100%' }}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapCenterController center={center} stations={stations} />
        {stations.map((station) => {
          // Check if any connector is available
          const hasAvailable = station.connectors?.some(c => c.available) ?? true;
          return (
          <Marker
            key={station.id}
            position={[station.latitude, station.longitude]}
            icon={createEvIcon(hasAvailable)}
          >
            <Popup>
              <div>
                <h3 style={{ margin: '0 0 8px 0' }}>{station.name}</h3>
                <p style={{ margin: '4px 0' }}>
                  <strong>Address:</strong> {station.address || 'N/A'}
                </p>
                {station.city && (
                  <p style={{ margin: '4px 0' }}>
                    <strong>City:</strong> {station.city}
                  </p>
                )}
                {station.operatorName && (
                  <p style={{ margin: '4px 0' }}>
                    <strong>Operator:</strong> {station.operatorName}
                  </p>
                )}
                {station.distance !== undefined && station.distance !== null && (
                  <p style={{ margin: '4px 0' }}>
                    <strong>Distance:</strong> {station.distance.toFixed(2)} km
                  </p>
                )}
                {station.connectors && station.connectors.length > 0 && (
                  <div style={{ marginTop: '8px' }}>
                    <strong>Connectors:</strong>
                    <ul style={{ margin: '4px 0', paddingLeft: '20px' }}>
                      {station.connectors.map((connector) => (
                        <li key={connector.id}>
                          {connector.type}
                          {connector.powerKW && ` - ${connector.powerKW} kW`}
                          {connector.status && ` (${connector.status})`}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        );
        })}
      </MapContainer>
    </div>
  );
};
