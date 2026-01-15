import React from 'react';
import { NavLink } from 'react-router-dom';

const menuItems = [
  { path: '/', label: 'Dashboard', icon: '📊' },
  { path: '/stations', label: 'Stations', icon: '⚡' },
  { path: '/sessions', label: 'Sessions', icon: '🔌' },
  { path: '/users', label: 'Users', icon: '👥' },
  { path: '/transactions', label: 'Transactions', icon: '💰' },
  { path: '/settings', label: 'Settings', icon: '⚙️' },
];

const Sidebar: React.FC = () => {
  return (
    <aside style={styles.sidebar}>
      <div style={styles.logo}>
        <span style={styles.logoIcon}>⚡</span>
        <span style={styles.logoText}>EV Admin</span>
      </div>
      <nav style={styles.nav}>
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            style={({ isActive }) => ({
              ...styles.navItem,
              ...(isActive ? styles.navItemActive : {}),
            })}
          >
            <span style={styles.navIcon}>{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div style={styles.footer}>
        <p style={styles.footerText}>EV Charging Armenia</p>
        <p style={styles.footerVersion}>Admin Panel v1.0</p>
      </div>
    </aside>
  );
};

const styles: Record<string, React.CSSProperties> = {
  sidebar: {
    width: '250px',
    backgroundColor: '#1f2937',
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    position: 'fixed',
    left: 0,
    top: 0,
  },
  logo: {
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    borderBottom: '1px solid #374151',
  },
  logoIcon: {
    fontSize: '28px',
  },
  logoText: {
    fontSize: '20px',
    fontWeight: 'bold',
  },
  nav: {
    flex: 1,
    padding: '20px 0',
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 20px',
    color: '#9ca3af',
    textDecoration: 'none',
    transition: 'all 0.2s',
  },
  navItemActive: {
    backgroundColor: '#374151',
    color: 'white',
    borderLeft: '3px solid #3b82f6',
  },
  navIcon: {
    fontSize: '18px',
  },
  footer: {
    padding: '20px',
    borderTop: '1px solid #374151',
    textAlign: 'center',
  },
  footerText: {
    fontSize: '12px',
    color: '#9ca3af',
  },
  footerVersion: {
    fontSize: '10px',
    color: '#6b7280',
    marginTop: '4px',
  },
};

export default Sidebar;
