import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import api from '../api/client';

interface Session {
  id: string;
  stationId: string;
  stationName: string;
  connectorId: string;
  connectorType: string;
  powerKW: number;
  startTime: string;
  energyKwh: number;
  currentPowerKw: number;
  duration: string;
  cost: number;
  status: 'charging' | 'completed' | 'stopped';
}

const Sessions: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        // Fetch demo sessions from backend
        const response = await api.getDemoSessions();
        const demoSessions = response.data?.sessions || [];
        setSessions(demoSessions);
      } catch (error) {
        console.error('Error fetching sessions:', error);
        setSessions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
    // Refresh every 3 seconds for live updates
    const interval = setInterval(fetchSessions, 3000);
    return () => clearInterval(interval);
  }, []);

  const filteredSessions = sessions.filter((session) => {
    if (filter === 'all') return true;
    if (filter === 'active') return session.status === 'charging';
    if (filter === 'completed') return session.status === 'completed' || session.status === 'stopped';
    return true;
  });

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'charging':
        return '#f59e0b';
      case 'completed':
        return '#10b981';
      case 'stopped':
        return '#6b7280';
      default:
        return '#6b7280';
    }
  };

  const activeCount = sessions.filter(s => s.status === 'charging').length;

  if (loading) {
    return (
      <div style={styles.container}>
        <Header title="Charging Sessions" />
        <div style={styles.loading}>Loading sessions...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <Header title="Charging Sessions" />

      <div style={styles.filters}>
        {(['all', 'active', 'completed'] as const).map((f) => (
          <button
            key={f}
            style={{
              ...styles.filterButton,
              ...(filter === f ? styles.filterButtonActive : {}),
            }}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
            {f === 'active' && (
              <span style={styles.badge}>
                {activeCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Live Sessions Banner */}
      {activeCount > 0 && (
        <div style={styles.liveBanner}>
          <div style={styles.liveDot} />
          <span style={styles.liveText}>
            {activeCount} Active Session{activeCount > 1 ? 's' : ''} - Live Data
          </span>
        </div>
      )}

      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHeader}>
              <th style={styles.th}>Station</th>
              <th style={styles.th}>Connector</th>
              <th style={styles.th}>Start Time</th>
              <th style={styles.th}>Duration</th>
              <th style={styles.th}>Energy (kWh)</th>
              <th style={styles.th}>Power (kW)</th>
              <th style={styles.th}>Cost (AMD)</th>
              <th style={styles.th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredSessions.length === 0 ? (
              <tr>
                <td colSpan={8} style={styles.emptyRow}>
                  {filter === 'active'
                    ? 'No active sessions. Start charging from the frontend map.'
                    : 'No sessions found'}
                </td>
              </tr>
            ) : (
              filteredSessions.map((session) => (
                <tr key={session.id} style={{
                  ...styles.tableRow,
                  backgroundColor: session.status === 'charging' ? '#fffbeb' : 'white',
                }}>
                  <td style={styles.td}>
                    <div style={styles.stationName}>{session.stationName}</div>
                  </td>
                  <td style={styles.td}>
                    <span style={styles.connectorBadge}>{session.connectorType}</span>
                  </td>
                  <td style={styles.td}>
                    {new Date(session.startTime).toLocaleString()}
                  </td>
                  <td style={styles.td}>
                    <span style={session.status === 'charging' ? styles.liveDuration : {}}>
                      {session.duration}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <span style={session.status === 'charging' ? styles.liveValue : {}}>
                      {session.energyKwh.toFixed(2)}
                    </span>
                  </td>
                  <td style={styles.td}>
                    {session.status === 'charging' ? (
                      <span style={styles.liveValue}>{session.currentPowerKw.toFixed(1)}</span>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td style={styles.td}>
                    <span style={session.status === 'charging' ? styles.liveValue : {}}>
                      {session.cost.toLocaleString()}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.statusBadge,
                      backgroundColor: getStatusColor(session.status),
                    }}>
                      {session.status === 'charging' ? 'Charging' : session.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div style={styles.summary}>
        <div style={styles.summaryItem}>
          <span style={styles.summaryLabel}>Total Energy:</span>
          <span style={styles.summaryValue}>
            {filteredSessions.reduce((sum, s) => sum + s.energyKwh, 0).toFixed(2)} kWh
          </span>
        </div>
        <div style={styles.summaryItem}>
          <span style={styles.summaryLabel}>Total Revenue:</span>
          <span style={styles.summaryValue}>
            {filteredSessions.reduce((sum, s) => sum + s.cost, 0).toLocaleString()} AMD
          </span>
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
  filters: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
  },
  filterButton: {
    padding: '10px 20px',
    backgroundColor: 'white',
    color: '#374151',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  filterButtonActive: {
    backgroundColor: '#3b82f6',
    color: 'white',
    borderColor: '#3b82f6',
  },
  badge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: '2px 8px',
    borderRadius: '10px',
    fontSize: '12px',
  },
  liveBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 16px',
    backgroundColor: '#fef3c7',
    border: '1px solid #f59e0b',
    borderRadius: '8px',
    marginBottom: '20px',
  },
  liveDot: {
    width: '10px',
    height: '10px',
    backgroundColor: '#f59e0b',
    borderRadius: '50%',
    animation: 'pulse 2s infinite',
  },
  liveText: {
    color: '#b45309',
    fontWeight: '600',
    fontSize: '14px',
  },
  tableContainer: {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
    marginBottom: '20px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  tableHeader: {
    backgroundColor: '#f9fafb',
  },
  th: {
    padding: '14px 16px',
    textAlign: 'left',
    fontSize: '12px',
    fontWeight: '600',
    color: '#6b7280',
    textTransform: 'uppercase',
    borderBottom: '1px solid #e5e7eb',
  },
  tableRow: {
    borderBottom: '1px solid #e5e7eb',
    transition: 'background-color 0.2s',
  },
  td: {
    padding: '14px 16px',
    fontSize: '14px',
    color: '#374151',
  },
  stationName: {
    fontWeight: '500',
    color: '#1f2937',
  },
  connectorBadge: {
    backgroundColor: '#e5e7eb',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '500',
  },
  liveDuration: {
    fontWeight: '600',
    color: '#b45309',
  },
  liveValue: {
    fontWeight: '600',
    color: '#1f2937',
  },
  emptyRow: {
    padding: '40px 16px',
    textAlign: 'center',
    color: '#6b7280',
  },
  statusBadge: {
    display: 'inline-block',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '500',
    color: 'white',
  },
  summary: {
    display: 'flex',
    gap: '30px',
    padding: '20px',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },
  summaryItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  summaryLabel: {
    color: '#6b7280',
    fontSize: '14px',
  },
  summaryValue: {
    color: '#111827',
    fontSize: '18px',
    fontWeight: '600',
  },
};

export default Sessions;
