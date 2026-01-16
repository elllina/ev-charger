import { useEffect, useState, useCallback, useRef } from 'react';
import { StationMap } from '../components/StationMap';
import { ChargePointCard } from '../components/ChargePointCard';
import { ocmApi } from '../api/ocm';
import { ocppApi } from '../api/ocpp';
import { demoSessionsApi } from '../api/client';
import type { Station, ChargePoint, Connector, ChargingSession } from '../types';

export const Home: React.FC = () => {
  const [stations, setStations] = useState<Station[]>([]);
  const [chargePoints, setChargePoints] = useState<ChargePoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSessions, setActiveSessions] = useState<Map<string, ChargingSession>>(new Map());

  // Yerevan, Armenia coordinates
  const [latitude, setLatitude] = useState(40.1872);
  const [longitude, setLongitude] = useState(44.5152);
  const [radius, setRadius] = useState(200);

  // Track if initial load has happened
  const initialLoadDone = useRef(false);
  const sessionIntervals = useRef<Map<string, ReturnType<typeof setInterval>>>(new Map());

  const fetchStations = useCallback(async (lat: number, lng: number, rad: number) => {
    try {
      const data = await ocmApi.getNearbyStations({
        latitude: lat,
        longitude: lng,
        radius: rad,
        maxResults: 50,
      });
      setStations(data);
      setError(null);
    } catch (err: unknown) {
      console.error('Error fetching stations:', err);
      setError('Failed to load charging stations. Please try again.');
    }
  }, []);

  const fetchChargePoints = useCallback(async () => {
    try {
      const data = await ocppApi.getChargePoints();
      setChargePoints(data);
    } catch (err: unknown) {
      console.error('Error fetching charge points:', err);
      setChargePoints([]);
    }
  }, []);

  const fetchData = useCallback(async (lat: number, lng: number, rad: number) => {
    setLoading(true);
    setError(null);

    await Promise.all([
      fetchStations(lat, lng, rad),
      fetchChargePoints()
    ]);

    setLoading(false);
  }, [fetchStations, fetchChargePoints]);

  // Initial load only
  useEffect(() => {
    if (!initialLoadDone.current) {
      initialLoadDone.current = true;
      fetchData(latitude, longitude, radius);
    }
  }, [fetchData, latitude, longitude, radius]);

  // Cleanup intervals on unmount
  useEffect(() => {
    return () => {
      sessionIntervals.current.forEach((interval) => clearInterval(interval));
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchData(latitude, longitude, radius);
  };

  // Start charging from map
  const handleStartCharging = useCallback((station: Station, connector: Connector) => {
    const sessionId = `session-${Date.now()}`;
    const startTime = new Date();

    // Create new session
    const newSession: ChargingSession = {
      id: sessionId,
      stationId: station.id,
      stationName: station.name,
      connectorId: connector.id,
      connectorType: connector.type,
      powerKW: connector.powerKW || 50,
      startTime,
      energyKwh: 0,
      currentPowerKw: 0,
      duration: '00:00:00',
      cost: 0,
      status: 'charging',
    };

    // Update station connector availability
    setStations(prevStations =>
      prevStations.map(s => {
        if (s.id === station.id) {
          return {
            ...s,
            connectors: s.connectors.map(c =>
              c.id === connector.id ? { ...c, available: false, status: 'Charging' } : c
            ),
          };
        }
        return s;
      })
    );

    // Add session to active sessions
    setActiveSessions(prev => {
      const newMap = new Map(prev);
      newMap.set(station.id, newSession);
      return newMap;
    });

    // Sync session to backend for dashboard access (initial)
    demoSessionsApi.postSession({
      ...newSession,
      startTime: startTime.toISOString(),
    });

    // Counter for backend sync (every 5 seconds instead of every second)
    let syncCounter = 0;

    // Start real-time updates (UI updates every second, backend sync every 5 seconds)
    const interval = setInterval(() => {
      syncCounter++;

      setActiveSessions(prev => {
        const session = prev.get(station.id);
        if (!session || session.status !== 'charging') {
          clearInterval(interval);
          sessionIntervals.current.delete(station.id);
          return prev;
        }

        const now = new Date();
        const elapsed = Math.floor((now.getTime() - new Date(session.startTime).getTime()) / 1000);
        const hours = Math.floor(elapsed / 3600);
        const minutes = Math.floor((elapsed % 3600) / 60);
        const seconds = elapsed % 60;
        const duration = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        // Simulate power fluctuation
        const basePower = session.powerKW;
        const currentPowerKw = basePower * (0.8 + Math.random() * 0.4);

        // Calculate energy: power (kW) * time (hours)
        const hoursElapsed = elapsed / 3600;
        const energyKwh = currentPowerKw * hoursElapsed;

        // Calculate cost (100 AMD per kWh)
        const cost = Math.round(energyKwh * 100);

        const updatedSession: ChargingSession = {
          ...session,
          duration,
          currentPowerKw: Math.round(currentPowerKw * 10) / 10,
          energyKwh: Math.round(energyKwh * 100) / 100,
          cost,
        };

        // Sync to backend every 5 seconds (not every second)
        if (syncCounter % 5 === 0) {
          demoSessionsApi.postSession({
            ...updatedSession,
            startTime: new Date(session.startTime).toISOString(),
          });
        }

        const newMap = new Map(prev);
        newMap.set(station.id, updatedSession);
        return newMap;
      });
    }, 1000);

    sessionIntervals.current.set(station.id, interval);
  }, []);

  // Stop charging
  const handleStopCharging = useCallback((stationId: string) => {
    // Clear interval
    const interval = sessionIntervals.current.get(stationId);
    if (interval) {
      clearInterval(interval);
      sessionIntervals.current.delete(stationId);
    }

    // Get session before updating
    const session = activeSessions.get(stationId);

    // Update session status
    setActiveSessions(prev => {
      const currentSession = prev.get(stationId);
      if (!currentSession) return prev;

      const finalSession: ChargingSession = {
        ...currentSession,
        status: 'completed',
      };

      // Sync completed session to backend
      demoSessionsApi.postSession({
        ...finalSession,
        startTime: new Date(currentSession.startTime).toISOString(),
      });

      const newMap = new Map(prev);
      newMap.delete(stationId);
      return newMap;
    });

    // Update station connector availability
    if (session) {
      setStations(prevStations =>
        prevStations.map(s => {
          if (s.id === stationId) {
            return {
              ...s,
              connectors: s.connectors.map(c =>
                c.id === session.connectorId ? { ...c, available: true, status: 'Available' } : c
              ),
            };
          }
          return s;
        })
      );
    }
  }, [activeSessions]);

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Loading...</h2>
      </div>
    );
  }

  // Count active sessions
  const activeSessionCount = activeSessions.size;

  return (
    <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
      <header style={{ marginBottom: '30px' }}>
        <h1 style={{ margin: '0 0 10px 0' }}>EV Charging Armenia</h1>
        <p style={{ color: '#666', margin: 0 }}>
          Find charging stations and manage OCPP charge points
        </p>
      </header>

      {error && (
        <div
          style={{
            padding: '12px 16px',
            backgroundColor: '#fee2e2',
            color: '#dc2626',
            borderRadius: '8px',
            marginBottom: '20px',
          }}
        >
          {error}
        </div>
      )}

      {/* Active Sessions Banner */}
      {activeSessionCount > 0 && (
        <div
          style={{
            padding: '16px 20px',
            backgroundColor: '#fef3c7',
            border: '1px solid #f59e0b',
            borderRadius: '8px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '12px',
              height: '12px',
              backgroundColor: '#f59e0b',
              borderRadius: '50%',
              animation: 'pulse 2s infinite',
            }} />
            <span style={{ fontWeight: '600', color: '#b45309' }}>
              {activeSessionCount} Active Charging Session{activeSessionCount > 1 ? 's' : ''}
            </span>
          </div>
          <div style={{ fontSize: '14px', color: '#92400e' }}>
            Total Energy: {Array.from(activeSessions.values()).reduce((sum, s) => sum + s.energyKwh, 0).toFixed(2)} kWh
          </div>
        </div>
      )}

      {/* Search Form */}
      <div
        style={{
          backgroundColor: '#f9fafb',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '30px',
        }}
      >
        <h2 style={{ margin: '0 0 16px 0', fontSize: '18px' }}>Search Charging Stations</h2>
        <form onSubmit={handleSearch}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>
                Latitude
              </label>
              <input
                type="number"
                step="0.0001"
                value={latitude}
                onChange={(e) => setLatitude(parseFloat(e.target.value))}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>
                Longitude
              </label>
              <input
                type="number"
                step="0.0001"
                value={longitude}
                onChange={(e) => setLongitude(parseFloat(e.target.value))}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>
                Radius (km)
              </label>
              <input
                type="number"
                value={radius}
                onChange={(e) => setRadius(parseInt(e.target.value))}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                }}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button
                type="submit"
                style={{
                  padding: '8px 24px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: '500',
                }}
              >
                Search
              </button>
            </div>
          </div>
        </form>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
        {/* Map Section */}
        <div>
          <h2 style={{ margin: '0 0 16px 0', fontSize: '20px' }}>
            Charging Stations Map
            <span style={{ color: '#6b7280', fontSize: '16px', marginLeft: '8px' }}>
              ({stations.length} stations)
            </span>
          </h2>
          <StationMap
            stations={stations}
            center={[latitude, longitude]}
            zoom={12}
            activeSessions={activeSessions}
            onStartCharging={handleStartCharging}
            onStopCharging={handleStopCharging}
          />
        </div>

        {/* Right Sidebar */}
        <div>
          {/* Active Sessions Section */}
          {activeSessionCount > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ margin: '0 0 16px 0', fontSize: '20px' }}>
                Active Sessions
                <span style={{ color: '#f59e0b', fontSize: '16px', marginLeft: '8px' }}>
                  ({activeSessionCount})
                </span>
              </h2>
              {Array.from(activeSessions.values()).map(session => (
                <div
                  key={session.id}
                  style={{
                    backgroundColor: '#fffbeb',
                    border: '1px solid #f59e0b',
                    borderRadius: '8px',
                    padding: '16px',
                    marginBottom: '12px',
                  }}
                >
                  <div style={{ fontWeight: '600', marginBottom: '8px', color: '#1f2937' }}>
                    {session.stationName}
                  </div>
                  <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '12px' }}>
                    {session.connectorType} - {session.powerKW} kW
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '14px' }}>
                    <div>
                      <span style={{ color: '#6b7280' }}>Energy:</span>
                      <div style={{ fontWeight: '600' }}>{session.energyKwh.toFixed(2)} kWh</div>
                    </div>
                    <div>
                      <span style={{ color: '#6b7280' }}>Power:</span>
                      <div style={{ fontWeight: '600' }}>{session.currentPowerKw.toFixed(1)} kW</div>
                    </div>
                    <div>
                      <span style={{ color: '#6b7280' }}>Duration:</span>
                      <div style={{ fontWeight: '600' }}>{session.duration}</div>
                    </div>
                    <div>
                      <span style={{ color: '#6b7280' }}>Cost:</span>
                      <div style={{ fontWeight: '600' }}>{session.cost} AMD</div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleStopCharging(session.stationId)}
                    style={{
                      width: '100%',
                      marginTop: '12px',
                      padding: '8px 16px',
                      backgroundColor: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: '500',
                    }}
                  >
                    Stop Charging
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* OCPP Charge Points Section */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ margin: 0, fontSize: '20px' }}>
                OCPP Charge Points
                <span style={{ color: '#6b7280', fontSize: '16px', marginLeft: '8px' }}>
                  ({chargePoints.length})
                </span>
              </h2>
              <button
                onClick={fetchChargePoints}
                style={{
                  padding: '6px 12px',
                  backgroundColor: '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                Refresh
              </button>
            </div>

            {chargePoints.length === 0 ? (
              <div
                style={{
                  padding: '20px',
                  backgroundColor: '#f9fafb',
                  borderRadius: '8px',
                  textAlign: 'center',
                  color: '#6b7280',
                }}
              >
                <p>No charge points connected</p>
                <p style={{ fontSize: '14px', marginTop: '8px' }}>
                  Connect a charge point via WebSocket to:<br />
                  <code style={{ backgroundColor: '#e5e7eb', padding: '2px 6px', borderRadius: '4px' }}>
                    ws://localhost:3000/ocpp/[chargePointId]
                  </code>
                </p>
              </div>
            ) : (
              <div>
                {chargePoints.map((cp) => (
                  <ChargePointCard
                    key={cp.chargePointId}
                    chargePoint={cp}
                    onUpdate={fetchChargePoints}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};
