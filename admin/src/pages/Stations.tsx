import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import api from '../api/client';

interface Connector {
  id: string;
  connectorType: string;
  powerKw: number;
  currentType: string;
  status: string;
  pricePerKwh: number;
  connectorNumber: number;
}

interface Station {
  id: string;
  name: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  status: 'active' | 'inactive' | 'maintenance';
  isPublic: boolean;
  is24Hours: boolean;
  amenities?: string[];
  ocppChargePointId?: string;
  ocppConnected?: boolean;
  ocppLastSeen?: string;
  ocppVendor?: string;
  ocppModel?: string;
  connectors?: Connector[];
  network?: {
    id: string;
    name: string;
    slug: string;
  };
}

interface ChargePoint {
  chargePointId: string;
  connected: boolean;
  vendor?: string;
  model?: string;
  firmwareVersion?: string;
  lastSeen?: string;
}

const Stations: React.FC = () => {
  const [stations, setStations] = useState<Station[]>([]);
  const [unlinkedChargePoints, setUnlinkedChargePoints] = useState<ChargePoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLinkModal, setShowLinkModal] = useState<string | null>(null);
  const [_showCreateModal, setShowCreateModal] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const [stationsRes, cpRes] = await Promise.all([
        api.getAllStations(),
        api.getUnlinkedChargePoints()
      ]);

      const stationsData = stationsRes.data?.stations || [];
      setStations(stationsData);

      const cpData = cpRes.data?.chargePoints || [];
      setUnlinkedChargePoints(cpData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleLinkChargePoint = async (stationId: string, chargePointId: string) => {
    setActionLoading(stationId);
    try {
      await api.linkChargePoint(stationId, chargePointId);
      await fetchData();
      setShowLinkModal(null);
    } catch (error) {
      console.error('Error linking charge point:', error);
      alert('Failed to link charge point');
    } finally {
      setActionLoading(null);
    }
  };

  const handleUnlinkChargePoint = async (stationId: string) => {
    if (!confirm('Are you sure you want to unlink this charge point?')) return;

    setActionLoading(stationId);
    try {
      await api.unlinkChargePoint(stationId);
      await fetchData();
    } catch (error) {
      console.error('Error unlinking charge point:', error);
      alert('Failed to unlink charge point');
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'available':
        return '#10b981';
      case 'occupied':
      case 'charging':
        return '#3b82f6';
      case 'maintenance':
      case 'preparing':
        return '#f59e0b';
      case 'inactive':
      case 'faulted':
      case 'offline':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getConnectorStatusSummary = (connectors: Connector[] | undefined) => {
    if (!connectors || connectors.length === 0) return 'No connectors';
    const available = connectors.filter(c => c.status === 'available').length;
    const occupied = connectors.filter(c => c.status === 'occupied').length;
    return `${available} available, ${occupied} occupied`;
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <Header title="Station Management" />
        <div style={styles.loading}>Loading stations...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <Header title="Station Management" />

      <div style={styles.toolbar}>
        <button style={styles.refreshButton} onClick={fetchData}>
          Refresh
        </button>
        <button style={styles.createButton} onClick={() => setShowCreateModal(true)}>
          + Add Station
        </button>
        <span style={styles.count}>
          {stations.length} station{stations.length !== 1 ? 's' : ''} |{' '}
          {unlinkedChargePoints.length} unlinked charge point{unlinkedChargePoints.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Unlinked Charge Points Alert */}
      {unlinkedChargePoints.length > 0 && (
        <div style={styles.alert}>
          <strong>Unlinked OCPP Charge Points:</strong>
          <div style={styles.unlinkedList}>
            {unlinkedChargePoints.map(cp => (
              <span key={cp.chargePointId} style={styles.unlinkedBadge}>
                {cp.chargePointId}
                {cp.vendor && ` (${cp.vendor})`}
              </span>
            ))}
          </div>
          <p style={styles.alertText}>
            Link these charge points to stations to enable full functionality.
          </p>
        </div>
      )}

      <div style={styles.grid}>
        {stations.length === 0 ? (
          <div style={styles.emptyState}>
            <span style={styles.emptyIcon}>&#9889;</span>
            <h3 style={styles.emptyTitle}>No Stations Found</h3>
            <p style={styles.emptyText}>
              Add your first charging station or check database seeding.
            </p>
          </div>
        ) : (
          stations.map((station) => (
            <div key={station.id} style={styles.card}>
              <div style={styles.cardHeader}>
                <div>
                  <h3 style={styles.cardTitle}>{station.name}</h3>
                  <p style={styles.cardSubtitle}>
                    {station.address}, {station.city}
                  </p>
                </div>
                <span style={{
                  ...styles.statusBadge,
                  backgroundColor: getStatusColor(station.status),
                }}>
                  {station.status}
                </span>
              </div>

              <div style={styles.cardBody}>
                {/* Network */}
                <div style={styles.infoRow}>
                  <span style={styles.label}>Network:</span>
                  <span style={styles.value}>{station.network?.name || 'Unknown'}</span>
                </div>

                {/* Connectors */}
                <div style={styles.infoRow}>
                  <span style={styles.label}>Connectors:</span>
                  <span style={styles.value}>
                    {station.connectors?.length || 0} ({getConnectorStatusSummary(station.connectors)})
                  </span>
                </div>

                {/* Coordinates */}
                <div style={styles.infoRow}>
                  <span style={styles.label}>Location:</span>
                  <span style={styles.value}>
                    {station.latitude.toFixed(4)}, {station.longitude.toFixed(4)}
                  </span>
                </div>

                {/* OCPP Status */}
                <div style={styles.ocppSection}>
                  <div style={styles.sectionTitle}>OCPP Connection</div>
                  {station.ocppChargePointId ? (
                    <div>
                      <div style={styles.infoRow}>
                        <span style={styles.label}>Charge Point ID:</span>
                        <span style={styles.value}>{station.ocppChargePointId}</span>
                      </div>
                      <div style={styles.infoRow}>
                        <span style={styles.label}>Status:</span>
                        <span style={{
                          ...styles.connectionStatus,
                          color: station.ocppConnected ? '#10b981' : '#ef4444'
                        }}>
                          {station.ocppConnected ? 'Connected' : 'Disconnected'}
                        </span>
                      </div>
                      {station.ocppVendor && (
                        <div style={styles.infoRow}>
                          <span style={styles.label}>Device:</span>
                          <span style={styles.value}>
                            {station.ocppVendor} {station.ocppModel || ''}
                          </span>
                        </div>
                      )}
                      {station.ocppLastSeen && (
                        <div style={styles.infoRow}>
                          <span style={styles.label}>Last Seen:</span>
                          <span style={styles.value}>
                            {new Date(station.ocppLastSeen).toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p style={styles.notLinked}>No OCPP charge point linked</p>
                  )}
                </div>
              </div>

              <div style={styles.cardActions}>
                {station.ocppChargePointId ? (
                  <button
                    style={styles.unlinkButton}
                    onClick={() => handleUnlinkChargePoint(station.id)}
                    disabled={actionLoading === station.id}
                  >
                    {actionLoading === station.id ? 'Unlinking...' : 'Unlink OCPP'}
                  </button>
                ) : (
                  <button
                    style={styles.linkButton}
                    onClick={() => setShowLinkModal(station.id)}
                    disabled={unlinkedChargePoints.length === 0}
                  >
                    Link OCPP
                  </button>
                )}
                <button style={styles.detailsButton}>
                  Edit
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Link Charge Point Modal */}
      {showLinkModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3 style={styles.modalTitle}>Link OCPP Charge Point</h3>
            <p style={styles.modalText}>
              Select a charge point to link to this station:
            </p>
            {unlinkedChargePoints.length === 0 ? (
              <p style={styles.noChargePoints}>
                No unlinked charge points available. Connect a charger via OCPP first.
              </p>
            ) : (
              <div style={styles.chargePointList}>
                {unlinkedChargePoints.map(cp => (
                  <button
                    key={cp.chargePointId}
                    style={styles.chargePointItem}
                    onClick={() => handleLinkChargePoint(showLinkModal, cp.chargePointId)}
                    disabled={actionLoading === showLinkModal}
                  >
                    <strong>{cp.chargePointId}</strong>
                    {cp.vendor && <span> - {cp.vendor} {cp.model || ''}</span>}
                    <span style={{
                      ...styles.cpStatus,
                      color: cp.connected ? '#10b981' : '#ef4444'
                    }}>
                      {cp.connected ? ' (Connected)' : ' (Disconnected)'}
                    </span>
                  </button>
                ))}
              </div>
            )}
            <div style={styles.modalActions}>
              <button style={styles.cancelButton} onClick={() => setShowLinkModal(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
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
    gap: '12px',
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
  createButton: {
    padding: '10px 20px',
    backgroundColor: '#10b981',
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
    marginLeft: 'auto',
  },
  alert: {
    backgroundColor: '#fef3c7',
    border: '1px solid #f59e0b',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '20px',
  },
  unlinkedList: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap' as const,
    marginTop: '8px',
  },
  unlinkedBadge: {
    backgroundColor: '#f59e0b',
    color: 'white',
    padding: '4px 12px',
    borderRadius: '16px',
    fontSize: '12px',
  },
  alertText: {
    color: '#92400e',
    fontSize: '13px',
    marginTop: '8px',
    marginBottom: 0,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
    gap: '20px',
  },
  emptyState: {
    gridColumn: '1 / -1',
    textAlign: 'center' as const,
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
    alignItems: 'flex-start',
    padding: '16px 20px',
    borderBottom: '1px solid #e5e7eb',
  },
  cardTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#111827',
    margin: 0,
  },
  cardSubtitle: {
    fontSize: '13px',
    color: '#6b7280',
    margin: '4px 0 0 0',
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
  ocppSection: {
    marginTop: '12px',
    paddingTop: '12px',
    borderTop: '1px solid #e5e7eb',
  },
  sectionTitle: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '8px',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  },
  connectionStatus: {
    fontWeight: '600',
  },
  notLinked: {
    color: '#9ca3af',
    fontSize: '13px',
    fontStyle: 'italic' as const,
    margin: 0,
  },
  cardActions: {
    display: 'flex',
    gap: '10px',
    padding: '16px 20px',
    borderTop: '1px solid #e5e7eb',
    backgroundColor: '#f9fafb',
  },
  linkButton: {
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
  unlinkButton: {
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
  modalOverlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    width: '100%',
    maxWidth: '500px',
    maxHeight: '80vh',
    overflow: 'auto' as const,
  },
  modalTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#111827',
    margin: '0 0 8px 0',
  },
  modalText: {
    color: '#6b7280',
    fontSize: '14px',
    marginBottom: '16px',
  },
  noChargePoints: {
    color: '#9ca3af',
    fontStyle: 'italic' as const,
    textAlign: 'center' as const,
    padding: '20px',
  },
  chargePointList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },
  chargePointItem: {
    padding: '12px 16px',
    backgroundColor: '#f3f4f6',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    cursor: 'pointer',
    textAlign: 'left' as const,
    fontSize: '14px',
  },
  cpStatus: {
    fontSize: '12px',
  },
  modalActions: {
    marginTop: '20px',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  cancelButton: {
    padding: '10px 20px',
    backgroundColor: '#f3f4f6',
    color: '#374151',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
  },
};

export default Stations;
