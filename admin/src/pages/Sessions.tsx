import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import api from '../api/client';

interface Session {
  id: string;
  chargePointId: string;
  connectorId: number;
  startTime: string;
  endTime?: string;
  energyKwh: number;
  cost: number;
  status: 'active' | 'completed' | 'failed';
  userId?: string;
}

const Sessions: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        // Get charge points to derive active sessions
        const cpResponse = await api.getChargePoints();
        const chargePoints = cpResponse.data || [];

        // Create mock sessions based on charge point status
        const mockSessions: Session[] = chargePoints
          .filter((cp: { status: string }) => cp.status === 'Charging')
          .map((cp: { chargePointId: string }, index: number) => ({
            id: `session-${index + 1}`,
            chargePointId: cp.chargePointId,
            connectorId: 1,
            startTime: new Date(Date.now() - Math.random() * 3600000).toISOString(),
            energyKwh: Math.round(Math.random() * 30 * 100) / 100,
            cost: Math.round(Math.random() * 5000),
            status: 'active' as const,
          }));

        // Add some historical sessions
        const historicalSessions: Session[] = [
          {
            id: 'hist-1',
            chargePointId: 'CP-001',
            connectorId: 1,
            startTime: new Date(Date.now() - 86400000).toISOString(),
            endTime: new Date(Date.now() - 82800000).toISOString(),
            energyKwh: 45.2,
            cost: 4520,
            status: 'completed',
          },
          {
            id: 'hist-2',
            chargePointId: 'CP-002',
            connectorId: 1,
            startTime: new Date(Date.now() - 172800000).toISOString(),
            endTime: new Date(Date.now() - 169200000).toISOString(),
            energyKwh: 32.8,
            cost: 3280,
            status: 'completed',
          },
        ];

        setSessions([...mockSessions, ...historicalSessions]);
      } catch (error) {
        console.error('Error fetching sessions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
    const interval = setInterval(fetchSessions, 30000);
    return () => clearInterval(interval);
  }, []);

  const filteredSessions = sessions.filter((session) => {
    if (filter === 'all') return true;
    if (filter === 'active') return session.status === 'active';
    if (filter === 'completed') return session.status === 'completed';
    return true;
  });

  const formatDuration = (start: string, end?: string) => {
    const startDate = new Date(start);
    const endDate = end ? new Date(end) : new Date();
    const diffMs = endDate.getTime() - startDate.getTime();
    const hours = Math.floor(diffMs / 3600000);
    const minutes = Math.floor((diffMs % 3600000) / 60000);
    return `${hours}h ${minutes}m`;
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'active':
        return '#3b82f6';
      case 'completed':
        return '#10b981';
      case 'failed':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

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
                {sessions.filter((s) => s.status === 'active').length}
              </span>
            )}
          </button>
        ))}
      </div>

      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHeader}>
              <th style={styles.th}>Session ID</th>
              <th style={styles.th}>Charge Point</th>
              <th style={styles.th}>Start Time</th>
              <th style={styles.th}>Duration</th>
              <th style={styles.th}>Energy (kWh)</th>
              <th style={styles.th}>Cost (AMD)</th>
              <th style={styles.th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredSessions.length === 0 ? (
              <tr>
                <td colSpan={7} style={styles.emptyRow}>
                  No sessions found
                </td>
              </tr>
            ) : (
              filteredSessions.map((session) => (
                <tr key={session.id} style={styles.tableRow}>
                  <td style={styles.td}>{session.id}</td>
                  <td style={styles.td}>{session.chargePointId}</td>
                  <td style={styles.td}>
                    {new Date(session.startTime).toLocaleString()}
                  </td>
                  <td style={styles.td}>
                    {formatDuration(session.startTime, session.endTime)}
                  </td>
                  <td style={styles.td}>{session.energyKwh.toFixed(2)}</td>
                  <td style={styles.td}>{session.cost.toLocaleString()}</td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.statusBadge,
                      backgroundColor: getStatusColor(session.status),
                    }}>
                      {session.status}
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
  },
  td: {
    padding: '14px 16px',
    fontSize: '14px',
    color: '#374151',
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
