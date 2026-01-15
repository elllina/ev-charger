import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import StatsCard from '../components/StatsCard';
import api from '../api/client';

interface DashboardStats {
  totalStations: number;
  activeStations: number;
  activeSessions: number;
  totalRevenue: number;
  totalEnergy: number;
  serverStatus: string;
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
        setChargePoints(cpResponse.data || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30 seconds
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

  return (
    <div style={styles.container}>
      <Header title="Dashboard" />

      <div style={styles.statsGrid}>
        <StatsCard
          title="Total Stations"
          value={stats.totalStations}
          icon="⚡"
          color="#3b82f6"
          trend={{ value: 12, isPositive: true }}
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
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="Energy Delivered"
          value={`${stats.totalEnergy.toFixed(1)} kWh`}
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

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Charge Points Status</h2>
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
                    No charge points connected
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
