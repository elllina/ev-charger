import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { DivIcon, type LatLngExpression } from 'leaflet';
import type { Station, Connector, ChargingSession } from '../types';
import 'leaflet/dist/leaflet.css';

interface StationMapProps {
  stations: Station[];
  center?: [number, number];
  zoom?: number;
  activeSessions?: Map<string, ChargingSession>;
  onStartCharging?: (station: Station, connector: Connector) => void;
  onStopCharging?: (stationId: string) => void;
}

// Custom EV charger icon using SVG
const createEvIcon = (available: boolean, isCharging: boolean) => {
  let color = '#22c55e'; // green - available
  let bgColor = '#dcfce7';

  if (isCharging) {
    color = '#f59e0b'; // orange - charging
    bgColor = '#fef3c7';
  } else if (!available) {
    color = '#ef4444'; // red - unavailable
    bgColor = '#fee2e2';
  }

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

// Station popup component
interface StationPopupProps {
  station: Station;
  session?: ChargingSession;
  onStartCharging?: (station: Station, connector: Connector) => void;
  onStopCharging?: (stationId: string) => void;
}

const StationPopup: React.FC<StationPopupProps> = ({ station, session, onStartCharging, onStopCharging }) => {
  const [selectedConnector, setSelectedConnector] = useState<Connector | null>(null);
  const [loading, setLoading] = useState(false);

  const availableConnectors = station.connectors?.filter(c => c.available) || [];
  const isCharging = session?.status === 'charging';

  const handleStartCharging = async () => {
    if (!selectedConnector || !onStartCharging) return;
    setLoading(true);
    try {
      onStartCharging(station, selectedConnector);
    } finally {
      setLoading(false);
    }
  };

  const handleStopCharging = async () => {
    if (!onStopCharging) return;
    setLoading(true);
    try {
      onStopCharging(station.id);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minWidth: '250px' }}>
      <h3 style={{ margin: '0 0 8px 0', color: '#1f2937' }}>{station.name}</h3>
      <p style={{ margin: '4px 0', fontSize: '13px', color: '#6b7280' }}>
        {station.address || 'N/A'}{station.city ? `, ${station.city}` : ''}
      </p>
      {station.operatorName && (
        <p style={{ margin: '4px 0', fontSize: '13px' }}>
          <strong>Operator:</strong> {station.operatorName}
        </p>
      )}

      {/* Charging Session Display */}
      {isCharging && session && (
        <div style={{
          backgroundColor: '#fef3c7',
          padding: '12px',
          borderRadius: '8px',
          margin: '12px 0',
          border: '1px solid #f59e0b',
        }}>
          <div style={{ fontWeight: '600', color: '#b45309', marginBottom: '8px' }}>
            Charging in Progress
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '13px' }}>
            <div>
              <span style={{ color: '#6b7280' }}>Energy:</span>
              <div style={{ fontWeight: '600', color: '#1f2937' }}>{session.energyKwh.toFixed(2)} kWh</div>
            </div>
            <div>
              <span style={{ color: '#6b7280' }}>Power:</span>
              <div style={{ fontWeight: '600', color: '#1f2937' }}>{session.currentPowerKw.toFixed(1)} kW</div>
            </div>
            <div>
              <span style={{ color: '#6b7280' }}>Duration:</span>
              <div style={{ fontWeight: '600', color: '#1f2937' }}>{session.duration}</div>
            </div>
            <div>
              <span style={{ color: '#6b7280' }}>Cost:</span>
              <div style={{ fontWeight: '600', color: '#1f2937' }}>{session.cost} AMD</div>
            </div>
          </div>
          <button
            onClick={handleStopCharging}
            disabled={loading}
            style={{
              width: '100%',
              marginTop: '12px',
              padding: '8px 16px',
              backgroundColor: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: '500',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Stopping...' : 'Stop Charging'}
          </button>
        </div>
      )}

      {/* Connector Selection - only show if not charging */}
      {!isCharging && (
        <>
          {station.connectors && station.connectors.length > 0 && (
            <div style={{ marginTop: '12px' }}>
              <strong style={{ fontSize: '13px' }}>Connectors:</strong>
              <div style={{ marginTop: '8px' }}>
                {station.connectors.map((connector) => (
                  <div
                    key={connector.id}
                    onClick={() => connector.available && setSelectedConnector(connector)}
                    style={{
                      padding: '8px 12px',
                      margin: '4px 0',
                      borderRadius: '6px',
                      backgroundColor: selectedConnector?.id === connector.id ? '#dbeafe' : '#f3f4f6',
                      border: selectedConnector?.id === connector.id ? '2px solid #3b82f6' : '1px solid #e5e7eb',
                      cursor: connector.available ? 'pointer' : 'not-allowed',
                      opacity: connector.available ? 1 : 0.5,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '13px',
                    }}
                  >
                    <span>
                      {connector.type}
                      {connector.powerKW && ` - ${connector.powerKW} kW`}
                    </span>
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: '500',
                      backgroundColor: connector.available ? '#dcfce7' : '#fee2e2',
                      color: connector.available ? '#166534' : '#dc2626',
                    }}>
                      {connector.available ? 'Available' : 'In Use'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Start Charging Button */}
          {availableConnectors.length > 0 && onStartCharging && (
            <button
              onClick={handleStartCharging}
              disabled={!selectedConnector || loading}
              style={{
                width: '100%',
                marginTop: '12px',
                padding: '10px 16px',
                backgroundColor: selectedConnector ? '#22c55e' : '#9ca3af',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: selectedConnector && !loading ? 'pointer' : 'not-allowed',
                fontWeight: '500',
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? 'Starting...' : selectedConnector ? 'Start Charging' : 'Select a Connector'}
            </button>
          )}

          {availableConnectors.length === 0 && (
            <div style={{
              marginTop: '12px',
              padding: '10px',
              backgroundColor: '#fee2e2',
              borderRadius: '6px',
              textAlign: 'center',
              color: '#dc2626',
              fontSize: '13px',
            }}>
              No available connectors
            </div>
          )}
        </>
      )}
    </div>
  );
};

export const StationMap: React.FC<StationMapProps> = ({
  stations,
  center = [40.1872, 44.5152], // Yerevan, Armenia
  zoom = 12,
  activeSessions = new Map(),
  onStartCharging,
  onStopCharging,
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
          const session = activeSessions.get(station.id);
          const isCharging = session?.status === 'charging';
          const hasAvailable = station.connectors?.some(c => c.available) ?? true;

          return (
            <Marker
              key={station.id}
              position={[station.latitude, station.longitude]}
              icon={createEvIcon(hasAvailable, isCharging)}
            >
              <Popup>
                <StationPopup
                  station={station}
                  session={session}
                  onStartCharging={onStartCharging}
                  onStopCharging={onStopCharging}
                />
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};
