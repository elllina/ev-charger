import { useState, useEffect, useRef } from 'react';
import type { ChargePoint } from '../types';
import { ocppApi } from '../api/ocpp';

interface ChargingSession {
  isCharging: boolean;
  startTime: Date | null;
  energyKwh: number;
  powerKw: number;
  duration: string;
  cost: number;
  transactionId: number | null;
}

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
  const [session, setSession] = useState<ChargingSession>({
    isCharging: false,
    startTime: null,
    energyKwh: 0,
    powerKw: 0,
    duration: '00:00:00',
    cost: 0,
    transactionId: null,
  });

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Simulate real-time charging updates
  useEffect(() => {
    if (session.isCharging && session.startTime) {
      intervalRef.current = setInterval(() => {
        const now = new Date();
        const elapsed = Math.floor((now.getTime() - session.startTime!.getTime()) / 1000);
        const hours = Math.floor(elapsed / 3600);
        const minutes = Math.floor((elapsed % 3600) / 60);
        const seconds = elapsed % 60;
        const duration = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        // Simulate power fluctuation (40-55 kW for DC fast charging)
        const powerKw = 45 + Math.random() * 10;

        // Calculate energy: power (kW) * time (hours)
        const hoursElapsed = elapsed / 3600;
        const energyKwh = powerKw * hoursElapsed;

        // Calculate cost (100 AMD per kWh)
        const cost = energyKwh * 100;

        setSession(prev => ({
          ...prev,
          duration,
          powerKw: Math.round(powerKw * 10) / 10,
          energyKwh: Math.round(energyKwh * 100) / 100,
          cost: Math.round(cost),
        }));
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [session.isCharging, session.startTime]);

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
        const transactionId = Math.floor(Math.random() * 1000000);
        setSession({
          isCharging: true,
          startTime: new Date(),
          energyKwh: 0,
          powerKw: 0,
          duration: '00:00:00',
          cost: 0,
          transactionId,
        });
        setSuccess('Charging started!');
        onUpdate?.();
      } else {
        setError('Failed to start charging');
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Error starting charging';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleStopCharging = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await ocppApi.remoteStopTransaction(chargePoint.chargePointId, {
        transactionId: session.transactionId || 0,
      });

      if (result.success) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        setSuccess(`Charging stopped! Total: ${session.energyKwh} kWh, Cost: ${session.cost} AMD`);
        setSession({
          isCharging: false,
          startTime: null,
          energyKwh: 0,
          powerKw: 0,
          duration: '00:00:00',
          cost: 0,
          transactionId: null,
        });
        onUpdate?.();
      } else {
        setError('Failed to stop charging');
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Error stopping charging';
      setError(errorMsg);
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

      {/* Real-time Charging Session Display */}
      {session.isCharging && (
        <div
          style={{
            marginTop: '16px',
            padding: '16px',
            backgroundColor: '#ecfdf5',
            borderRadius: '8px',
            border: '2px solid #10b981',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{
              width: '12px',
              height: '12px',
              backgroundColor: '#10b981',
              borderRadius: '50%',
              marginRight: '8px',
              animation: 'pulse 1s infinite',
            }} />
            <strong style={{ color: '#059669' }}>Charging in Progress</strong>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ textAlign: 'center', padding: '8px', backgroundColor: 'white', borderRadius: '6px' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#059669' }}>
                {session.energyKwh.toFixed(2)}
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>kWh Delivered</div>
            </div>

            <div style={{ textAlign: 'center', padding: '8px', backgroundColor: 'white', borderRadius: '6px' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6' }}>
                {session.powerKw.toFixed(1)}
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>kW Power</div>
            </div>

            <div style={{ textAlign: 'center', padding: '8px', backgroundColor: 'white', borderRadius: '6px' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#8b5cf6' }}>
                {session.duration}
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>Duration</div>
            </div>

            <div style={{ textAlign: 'center', padding: '8px', backgroundColor: 'white', borderRadius: '6px' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f59e0b' }}>
                {session.cost}
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>AMD Cost</div>
            </div>
          </div>
        </div>
      )}

      {chargePoint.connected && (
        <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
          {!session.isCharging ? (
            <button
              onClick={handleStartCharging}
              disabled={loading}
              style={{
                padding: '10px 20px',
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1,
                fontWeight: '500',
                flex: 1,
              }}
            >
              {loading ? 'Starting...' : 'Start Charging'}
            </button>
          ) : (
            <button
              onClick={handleStopCharging}
              disabled={loading}
              style={{
                padding: '10px 20px',
                backgroundColor: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1,
                fontWeight: '500',
                flex: 1,
              }}
            >
              {loading ? 'Stopping...' : 'Stop Charging'}
            </button>
          )}
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
