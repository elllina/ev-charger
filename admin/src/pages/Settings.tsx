import React, { useState } from 'react';
import Header from '../components/Header';

const Settings: React.FC = () => {
  const [settings, setSettings] = useState({
    apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
    pricePerKwh: 100,
    currency: 'AMD',
    autoRefreshInterval: 30,
    enableNotifications: true,
    maintenanceMode: false,
  });

  const handleChange = (key: string, value: string | number | boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    // In a real app, this would save to backend
    localStorage.setItem('admin_settings', JSON.stringify(settings));
    alert('Settings saved successfully!');
  };

  return (
    <div style={styles.container}>
      <Header title="Settings" />

      <div style={styles.sections}>
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>API Configuration</h2>
          <div style={styles.formGroup}>
            <label style={styles.label}>Backend API URL</label>
            <input
              type="text"
              value={settings.apiUrl}
              onChange={(e) => handleChange('apiUrl', e.target.value)}
              style={styles.input}
            />
            <p style={styles.hint}>The URL of the backend API server</p>
          </div>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Pricing</h2>
          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Price per kWh</label>
              <input
                type="number"
                value={settings.pricePerKwh}
                onChange={(e) => handleChange('pricePerKwh', parseInt(e.target.value))}
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Currency</label>
              <select
                value={settings.currency}
                onChange={(e) => handleChange('currency', e.target.value)}
                style={styles.select}
              >
                <option value="AMD">AMD (Armenian Dram)</option>
                <option value="USD">USD (US Dollar)</option>
                <option value="EUR">EUR (Euro)</option>
                <option value="RUB">RUB (Russian Ruble)</option>
              </select>
            </div>
          </div>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Dashboard Settings</h2>
          <div style={styles.formGroup}>
            <label style={styles.label}>Auto-refresh Interval (seconds)</label>
            <input
              type="number"
              value={settings.autoRefreshInterval}
              onChange={(e) => handleChange('autoRefreshInterval', parseInt(e.target.value))}
              style={styles.input}
              min={10}
              max={300}
            />
          </div>
          <div style={styles.toggleGroup}>
            <div style={styles.toggleInfo}>
              <span style={styles.toggleLabel}>Enable Notifications</span>
              <span style={styles.toggleHint}>Receive alerts for important events</span>
            </div>
            <button
              style={{
                ...styles.toggle,
                backgroundColor: settings.enableNotifications ? '#3b82f6' : '#d1d5db',
              }}
              onClick={() => handleChange('enableNotifications', !settings.enableNotifications)}
            >
              <span style={{
                ...styles.toggleKnob,
                transform: settings.enableNotifications ? 'translateX(20px)' : 'translateX(0)',
              }} />
            </button>
          </div>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>System</h2>
          <div style={styles.toggleGroup}>
            <div style={styles.toggleInfo}>
              <span style={styles.toggleLabel}>Maintenance Mode</span>
              <span style={styles.toggleHint}>Disable public access to charging stations</span>
            </div>
            <button
              style={{
                ...styles.toggle,
                backgroundColor: settings.maintenanceMode ? '#ef4444' : '#d1d5db',
              }}
              onClick={() => handleChange('maintenanceMode', !settings.maintenanceMode)}
            >
              <span style={{
                ...styles.toggleKnob,
                transform: settings.maintenanceMode ? 'translateX(20px)' : 'translateX(0)',
              }} />
            </button>
          </div>
          {settings.maintenanceMode && (
            <div style={styles.warning}>
              Warning: Maintenance mode is enabled. Users cannot start new charging sessions.
            </div>
          )}
        </div>

        <div style={styles.actions}>
          <button style={styles.saveButton} onClick={handleSave}>
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: '0 30px 30px',
  },
  sections: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
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
  formGroup: {
    marginBottom: '16px',
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '8px',
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    fontSize: '14px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    outline: 'none',
  },
  select: {
    width: '100%',
    padding: '12px 16px',
    fontSize: '14px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    outline: 'none',
    backgroundColor: 'white',
  },
  hint: {
    fontSize: '12px',
    color: '#6b7280',
    marginTop: '6px',
  },
  toggleGroup: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 0',
    borderBottom: '1px solid #e5e7eb',
  },
  toggleInfo: {
    display: 'flex',
    flexDirection: 'column',
  },
  toggleLabel: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
  },
  toggleHint: {
    fontSize: '12px',
    color: '#6b7280',
    marginTop: '4px',
  },
  toggle: {
    width: '48px',
    height: '28px',
    borderRadius: '14px',
    border: 'none',
    cursor: 'pointer',
    position: 'relative',
    transition: 'background-color 0.2s',
  },
  toggleKnob: {
    position: 'absolute',
    top: '4px',
    left: '4px',
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    backgroundColor: 'white',
    transition: 'transform 0.2s',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
  },
  warning: {
    marginTop: '16px',
    padding: '12px 16px',
    backgroundColor: '#fef2f2',
    color: '#dc2626',
    borderRadius: '8px',
    fontSize: '14px',
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  saveButton: {
    padding: '12px 32px',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  },
};

export default Settings;
