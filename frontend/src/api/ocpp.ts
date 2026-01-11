import { apiClient } from './client';
import { ChargePoint, ChargePointStatus, StartChargingRequest, StopChargingRequest, RemoteCommandResponse } from '../types';

/**
 * OCPP API service for controlling charge points
 */
export const ocppApi = {
  /**
   * Get OCPP server information
   */
  getInfo: async () => {
    const response = await apiClient.get('/ocpp/info');
    return response.data;
  },

  /**
   * Get all connected charge points
   */
  getChargePoints: async (): Promise<ChargePoint[]> => {
    const response = await apiClient.get('/ocpp/chargepoints');
    return response.data.chargePoints || [];
  },

  /**
   * Get charge point status
   */
  getChargePointStatus: async (chargePointId: string): Promise<ChargePointStatus> => {
    const response = await apiClient.get(`/ocpp/chargepoints/${chargePointId}/status`);
    return response.data;
  },

  /**
   * Start remote charging session
   */
  remoteStartTransaction: async (
    chargePointId: string,
    data: StartChargingRequest
  ): Promise<RemoteCommandResponse> => {
    const response = await apiClient.post(`/ocpp/chargepoints/${chargePointId}/start`, data);
    return response.data;
  },

  /**
   * Stop remote charging session
   */
  remoteStopTransaction: async (
    chargePointId: string,
    data: StopChargingRequest
  ): Promise<RemoteCommandResponse> => {
    const response = await apiClient.post(`/ocpp/chargepoints/${chargePointId}/stop`, data);
    return response.data;
  },
};
