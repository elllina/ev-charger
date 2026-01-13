import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon, type LatLngExpression } from 'leaflet';
import type { Station } from '../types';
import 'leaflet/dist/leaflet.css';

interface StationMapProps {
  stations: Station[];
  center?: [number, number];
  zoom?: number;
}

// Fix for default marker icon
const defaultIcon = new Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

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
        {stations.map((station) => (
          <Marker
            key={station.id}
            position={[station.latitude, station.longitude]}
            icon={defaultIcon}
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
        ))}
      </MapContainer>
    </div>
  );
};
