import { useEffect, useState } from 'react';
import { StationMap } from '../components/StationMap';
import { ChargePointCard } from '../components/ChargePointCard';
import { ocmApi } from '../api/ocm';
import { ocppApi } from '../api/ocpp';
import { Station, ChargePoint } from '../types';

export const Home: React.FC = () => {
  const [stations, setStations] = useState<Station[]>([]);
  const [chargePoints, setChargePoints] = useState<ChargePoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Yerevan, Armenia coordinates
  const [latitude, setLatitude] = useState(40.1872);
  const [longitude, setLongitude] = useState(44.5152);
  const [radius, setRadius] = useState(50);

  const fetchStations = async () => {
    try {
      const data = await ocmApi.getNearbyStations({
        latitude,
        longitude,
        radius,
        maxResults: 50,
      });
      setStations(data);
    } catch (err: any) {
      console.error('Error fetching stations:', err);
      setError('Failed to load charging stations');
    }
  };

  const fetchChargePoints = async () => {
    try {
      const data = await ocppApi.getChargePoints();
      setChargePoints(data);
    } catch (err: any) {
      console.error('Error fetching charge points:', err);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    await Promise.all([fetchStations(), fetchChargePoints()]);

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [latitude, longitude, radius]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchData();
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Loading...</h2>
      </div>
    );
  }

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
          />
        </div>

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
  );
};
