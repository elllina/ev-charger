import { useState } from 'react';
import type { ChargePoint } from '../types';
import { ocppApi } from '../api/ocpp';

interface ChargePointCardProps {
  chargePoint: ChargePoint;
  onUpdate?: () => void;
}

export const ChargePointCard: React.FC<ChargePointCardProps> = ({
  chargePoint,
  onUpdate,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleStartCharging = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await ocppApi.remoteStartTransaction(chargePoint.chargePointId, {
        connectorId: 1,
        idTag: 'test-user-001',
      });

      if (result.success) {
        setSuccess('Charging started successfully!');
        onUpdate?.();
      } else {
        setError('Failed to start charging');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error starting charging');
    } finally {
      setLoading(false);
    }
  };

  const handleStopCharging = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // For demo purposes, using a random transaction ID
      const transactionId = Math.floor(Math.random() * 1000000);

      const result = await ocppApi.remoteStopTransaction(chargePoint.chargePointId, {
        transactionId,
      });

      if (result.success) {
        setSuccess('Charging stopped successfully!');
        onUpdate?.();
      } else {
        setError('Failed to stop charging');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error stopping charging');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '16px',
        backgroundColor: chargePoint.connected ? '#f0f9ff' : '#fef2f2',
      }}
    >
      <h3 style={{ margin: '0 0 12px 0' }}>{chargePoint.chargePointId}</h3>

      <div style={{ marginBottom: '12px' }}>
        <span
          style={{
            display: 'inline-block',
            padding: '4px 12px',
            borderRadius: '16px',
            fontSize: '14px',
            backgroundColor: chargePoint.connected ? '#10b981' : '#ef4444',
            color: 'white',
          }}
        >
          {chargePoint.connected ? 'Connected' : 'Disconnected'}
        </span>
      </div>

      {chargePoint.status && (
        <p style={{ margin: '8px 0', color: '#666' }}>
          <strong>Status:</strong> {chargePoint.status}
        </p>
      )}

      {chargePoint.connected && (
        <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
          <button
            onClick={handleStartCharging}
            disabled={loading}
            style={{
              padding: '8px 16px',
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? 'Processing...' : 'Start Charging'}
          </button>

          <button
            onClick={handleStopCharging}
            disabled={loading}
            style={{
              padding: '8px 16px',
              backgroundColor: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? 'Processing...' : 'Stop Charging'}
          </button>
        </div>
      )}

      {error && (
        <div
          style={{
            marginTop: '12px',
            padding: '8px 12px',
            backgroundColor: '#fee2e2',
            color: '#dc2626',
            borderRadius: '4px',
            fontSize: '14px',
          }}
        >
          {error}
        </div>
      )}

      {success && (
        <div
          style={{
            marginTop: '12px',
            padding: '8px 12px',
            backgroundColor: '#d1fae5',
            color: '#059669',
            borderRadius: '4px',
            fontSize: '14px',
          }}
        >
          {success}
        </div>
      )}
    </div>
  );
};
