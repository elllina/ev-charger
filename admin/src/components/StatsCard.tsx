import React from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, trend, color = '#3b82f6' }) => {
  return (
    <div style={styles.card}>
      <div style={styles.content}>
        <div style={styles.textContent}>
          <p style={styles.title}>{title}</p>
          <p style={styles.value}>{value}</p>
          {trend && (
            <p style={{
              ...styles.trend,
              color: trend.isPositive ? '#10b981' : '#ef4444',
            }}>
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}% from last month
            </p>
          )}
        </div>
        <div style={{ ...styles.iconContainer, backgroundColor: `${color}20` }}>
          <span style={{ ...styles.icon, color }}>{icon}</span>
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  card: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },
  content: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  textContent: {
    flex: 1,
  },
  title: {
    fontSize: '14px',
    color: '#6b7280',
    margin: '0 0 8px 0',
    fontWeight: '500',
  },
  value: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#111827',
    margin: '0 0 4px 0',
  },
  trend: {
    fontSize: '12px',
    margin: 0,
  },
  iconContainer: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: '24px',
  },
};

export default StatsCard;
