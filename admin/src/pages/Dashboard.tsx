import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import StatsCard from '../components/StatsCard';
import api from '../api/client';

interface DemoSession {
  id: string;
  stationName: string;
  connectorType: string;
  powerKW: number;
  energyKwh: number;
  currentPowerKw: number;
  duration: string;
  cost: number;
  status: string;
}

interface DashboardStats {
  totalStations: number;
  activeStations: number;
  activeSessions: number;
  totalRevenue: number;
  totalEnergy: number;
  serverStatus: string;
  demoSessionsData?: DemoSession[];
}

interface ChargePoint {
  chargePointId: string;
  status: string;
  vendor?: string;
  model?: string;
  lastSeen?: string;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalStations: 0,
    activeStations: 0,
    activeSessions: 0,
    totalRevenue: 0,
    totalEnergy: 0,
    serverStatus: 'Loading...',
    demoSessionsData: [],
  });
  const [chargePoints, setChargePoints] = useState<ChargePoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, cpResponse] = await Promise.all([
          api.getDashboardStats(),
          api.getChargePoints(),
        ]);
        setStats(statsData);
        // Handle response: { success, chargePoints: [...] }
        const cpData = Array.isArray(cpResponse.data)
          ? cpResponse.data
          : (cpResponse.data?.chargePoints || []);
        setChargePoints(cpData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000); // Refresh every 5 seconds for live updates
    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('hy-AM', {
      style: 'decimal',
      minimumFractionDigits: 0,
    }).format(amount) + ' AMD';
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <Header title="Dashboard" />
        <div style={styles.loading}>Loading dashboard data...</div>
      </div>
    );
  }

  const activeSessions = stats.demoSessionsData?.filter(s => s.status === 'charging') || [];

  return (
    <div style={styles.container}>
      <Header title="Dashboard" />

      <div style={styles.statsGrid}>
        <StatsCard
          title="Total Stations"
          value={stats.totalStations}
          icon="⚡"
          color="#3b82f6"
        />
        <StatsCard
          title="Active Stations"
          value={stats.activeStations}
          icon="✓"
          color="#10b981"
        />
        <StatsCard
          title="Active Sessions"
          value={stats.activeSessions}
          icon="🔌"
          color="#f59e0b"
        />
        <StatsCard
          title="Total Revenue"
          value={formatCurrency(stats.totalRevenue)}
          icon="💰"
          color="#8b5cf6"
        />
        <StatsCard
          title="Energy Delivered"
          value={`${stats.totalEnergy.toFixed(2)} kWh`}
          icon="⚡"
          color="#06b6d4"
        />
        <StatsCard
          title="Server Status"
          value={stats.serverStatus}
          icon="🖥️"
          color={stats.serverStatus === 'Online' ? '#10b981' : '#ef4444'}
        />
      </div>

      {/* Live Charging Sessions */}
      {activeSessions.length > 0 && (
        <div style={{ ...styles.section, marginBottom: '20px', backgroundColor: '#fffbeb', border: '1px solid #f59e0b' }}>
          <h2 style={{ ...styles.sectionTitle, color: '#b45309', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              width: '12px',
              height: '12px',
              backgroundColor: '#f59e0b',
              borderRadius: '50%',
              display: 'inline-block',
              animation: 'pulse 2s infinite',
            }} />
            Live Charging Sessions ({activeSessions.length})
          </h2>
          <div style={styles.sessionsGrid}>
            {activeSessions.map((session) => (
              <div key={session.id} style={styles.sessionCard}>
                <div style={styles.sessionHeader}>
                  <span style={styles.sessionName}>{session.stationName}</span>
                  <span style={styles.sessionConnector}>{session.connectorType}</span>
                </div>
                <div style={styles.sessionStats}>
                  <div style={styles.sessionStat}>
                    <span style={styles.statLabel}>Energy</span>
                    <span style={styles.statValue}>{session.energyKwh.toFixed(2)} kWh</span>
                  </div>
                  <div style={styles.sessionStat}>
                    <span style={styles.statLabel}>Power</span>
                    <span style={styles.statValue}>{session.currentPowerKw.toFixed(1)} kW</span>
                  </div>
                  <div style={styles.sessionStat}>
                    <span style={styles.statLabel}>Duration</span>
                    <span style={styles.statValue}>{session.duration}</span>
                  </div>
                  <div style={styles.sessionStat}>
                    <span style={styles.statLabel}>Cost</span>
                    <span style={styles.statValue}>{session.cost} AMD</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>OCPP Charge Points Status</h2>
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Vendor</th>
                <th style={styles.th}>Model</th>
                <th style={styles.th}>Last Seen</th>
              </tr>
            </thead>
            <tbody>
              {chargePoints.length === 0 ? (
                <tr>
                  <td colSpan={5} style={styles.emptyRow}>
                    No OCPP charge points connected
                  </td>
                </tr>
              ) : (
                chargePoints.map((cp) => (
                  <tr key={cp.chargePointId} style={styles.tableRow}>
                    <td style={styles.td}>{cp.chargePointId}</td>
                    <td style={styles.td}>
                      <span style={{
                        ...styles.statusBadge,
                        backgroundColor: getStatusColor(cp.status),
                      }}>
                        {cp.status}
                      </span>
                    </td>
                    <td style={styles.td}>{cp.vendor || 'Unknown'}</td>
                    <td style={styles.td}>{cp.model || 'Unknown'}</td>
                    <td style={styles.td}>
                      {cp.lastSeen ? new Date(cp.lastSeen).toLocaleString() : 'N/A'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
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
    fontSize: '16px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#111827',
    margin: '0 0 20px 0',
  },
  sessionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '16px',
  },
  sessionCard: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '16px',
    border: '1px solid #e5e7eb',
  },
  sessionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  sessionName: {
    fontWeight: '600',
    color: '#1f2937',
    fontSize: '15px',
  },
  sessionConnector: {
    fontSize: '12px',
    color: '#6b7280',
    backgroundColor: '#f3f4f6',
    padding: '4px 8px',
    borderRadius: '4px',
  },
  sessionStats: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
  },
  sessionStat: {
    display: 'flex',
    flexDirection: 'column',
  },
  statLabel: {
    fontSize: '12px',
    color: '#6b7280',
    marginBottom: '2px',
  },
  statValue: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1f2937',
  },
  tableContainer: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  tableHeader: {
    backgroundColor: '#f9fafb',
  },
  th: {
    padding: '12px 16px',
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
    padding: '12px 16px',
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
};

export default Dashboard;
