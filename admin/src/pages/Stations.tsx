import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import api from '../api/client';

interface ChargePoint {
  chargePointId: string;
  status: string;
  vendor?: string;
  model?: string;
  firmwareVersion?: string;
  lastSeen?: string;
  connectors?: Array<{
    connectorId: number;
    status: string;
  }>;
}

const Stations: React.FC = () => {
  const [chargePoints, setChargePoints] = useState<ChargePoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchChargePoints = async () => {
    try {
      const response = await api.getChargePoints();
      setChargePoints(response.data || []);
    } catch (error) {
      console.error('Error fetching charge points:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChargePoints();
    const interval = setInterval(fetchChargePoints, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleStartCharging = async (chargePointId: string) => {
    setActionLoading(chargePointId);
    try {
      await api.startCharging(chargePointId, 1, 'admin');
      await fetchChargePoints();
    } catch (error) {
      console.error('Error starting charging:', error);
      alert('Failed to start charging');
    } finally {
      setActionLoading(null);
    }
  };

  const handleStopCharging = async (chargePointId: string) => {
    setActionLoading(chargePointId);
    try {
      await api.stopCharging(chargePointId, 1);
      await fetchChargePoints();
    } catch (error) {
      console.error('Error stopping charging:', error);
      alert('Failed to stop charging');
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status?.toLowerCase()) {
      case 'available':
        return '#10b981';
      case 'charging':
        return '#3b82f6';
      case 'preparing':
        return '#f59e0b';
      case 'faulted':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <Header title="Stations Management" />
        <div style={styles.loading}>Loading stations...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <Header title="Stations Management" />

      <div style={styles.toolbar}>
        <button style={styles.refreshButton} onClick={fetchChargePoints}>
          🔄 Refresh
        </button>
        <span style={styles.count}>
          {chargePoints.length} charge point{chargePoints.length !== 1 ? 's' : ''} connected
        </span>
      </div>

      <div style={styles.grid}>
        {chargePoints.length === 0 ? (
          <div style={styles.emptyState}>
            <span style={styles.emptyIcon}>⚡</span>
            <h3 style={styles.emptyTitle}>No Charge Points Connected</h3>
            <p style={styles.emptyText}>
              Charge points will appear here once they connect via OCPP.
            </p>
          </div>
        ) : (
          chargePoints.map((cp) => (
            <div key={cp.chargePointId} style={styles.card}>
              <div style={styles.cardHeader}>
                <h3 style={styles.cardTitle}>{cp.chargePointId}</h3>
                <span style={{
                  ...styles.statusBadge,
                  backgroundColor: getStatusColor(cp.status),
                }}>
                  {cp.status}
                </span>
              </div>

              <div style={styles.cardBody}>
                <div style={styles.infoRow}>
                  <span style={styles.label}>Vendor:</span>
                  <span style={styles.value}>{cp.vendor || 'Unknown'}</span>
                </div>
                <div style={styles.infoRow}>
                  <span style={styles.label}>Model:</span>
                  <span style={styles.value}>{cp.model || 'Unknown'}</span>
                </div>
                <div style={styles.infoRow}>
                  <span style={styles.label}>Firmware:</span>
                  <span style={styles.value}>{cp.firmwareVersion || 'N/A'}</span>
                </div>
                <div style={styles.infoRow}>
                  <span style={styles.label}>Last Seen:</span>
                  <span style={styles.value}>
                    {cp.lastSeen ? new Date(cp.lastSeen).toLocaleString() : 'N/A'}
                  </span>
                </div>
              </div>

              <div style={styles.cardActions}>
                {cp.status === 'Available' && (
                  <button
                    style={styles.startButton}
                    onClick={() => handleStartCharging(cp.chargePointId)}
                    disabled={actionLoading === cp.chargePointId}
                  >
                    {actionLoading === cp.chargePointId ? 'Starting...' : '▶ Start Charging'}
                  </button>
                )}
                {cp.status === 'Charging' && (
                  <button
                    style={styles.stopButton}
                    onClick={() => handleStopCharging(cp.chargePointId)}
                    disabled={actionLoading === cp.chargePointId}
                  >
                    {actionLoading === cp.chargePointId ? 'Stopping...' : '⏹ Stop Charging'}
                  </button>
                )}
                <button style={styles.detailsButton}>
                  View Details
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: '0 30px 30px',
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '200px',
    color: '#6b7280',
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  refreshButton: {
    padding: '10px 20px',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  },
  count: {
    color: '#6b7280',
    fontSize: '14px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '20px',
  },
  emptyState: {
    gridColumn: '1 / -1',
    textAlign: 'center',
    padding: '60px 20px',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },
  emptyIcon: {
    fontSize: '48px',
    display: 'block',
    marginBottom: '16px',
  },
  emptyTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#111827',
    margin: '0 0 8px 0',
  },
  emptyText: {
    color: '#6b7280',
    margin: 0,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 20px',
    borderBottom: '1px solid #e5e7eb',
  },
  cardTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#111827',
    margin: 0,
  },
  statusBadge: {
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '500',
    color: 'white',
  },
  cardBody: {
    padding: '16px 20px',
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px',
  },
  label: {
    color: '#6b7280',
    fontSize: '14px',
  },
  value: {
    color: '#111827',
    fontSize: '14px',
    fontWeight: '500',
  },
  cardActions: {
    display: 'flex',
    gap: '10px',
    padding: '16px 20px',
    borderTop: '1px solid #e5e7eb',
    backgroundColor: '#f9fafb',
  },
  startButton: {
    flex: 1,
    padding: '10px',
    backgroundColor: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  },
  stopButton: {
    flex: 1,
    padding: '10px',
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  },
  detailsButton: {
    flex: 1,
    padding: '10px',
    backgroundColor: 'white',
    color: '#374151',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  },
};

export default Stations;
