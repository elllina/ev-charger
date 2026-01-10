import axios, { AxiosInstance } from 'axios';
import {
  CPOAdapter,
  StationData,
  ConnectorStatus,
  TransactionResult,
  SessionData,
} from '../CPOAdapter';
import { logger } from '../../config/logger';

/**
 * EcoCars Adapter using custom REST API
 * This is a mock implementation - replace with actual API after negotiations
 */
export class EcoCarsAdapter extends CPOAdapter {
  private client: AxiosInstance;

  constructor(networkId: string, apiBaseUrl: string, credentials: any) {
    super(networkId, apiBaseUrl, credentials);

    this.client = axios.create({
      baseURL: this.apiBaseUrl,
      timeout: 10000,
      headers: {
        'X-API-Key': credentials.apiKey,
        'Content-Type': 'application/json',
      },
    });
  }

  async fetchStations(): Promise<StationData[]> {
    try {
      logger.info(`Fetching stations from EcoCars`);

      // const response = await this.client.get('/api/v1/stations');

      // Mock data
      const mockStations: StationData[] = [
        {
          externalId: 'ECOCARS_001',
          name: 'EcoCars Центр',
          address: 'ул. Абовяна 1, Ереван',
          city: 'Yerevan',
          latitude: 40.1792,
          longitude: 44.4991,
          isPublic: true,
          is24Hours: true,
          amenities: ['parking'],
          photos: [],
          description: 'EcoCars charging station in city center',
          connectors: [
            {
              externalId: 'ECOCARS_001_1',
              connectorNumber: 1,
              connectorType: 'CCS2',
              powerKw: 50,
              currentType: 'DC',
              status: 'available',
              pricePerKwh: 100,
            },
            {
              externalId: 'ECOCARS_001_2',
              connectorNumber: 2,
              connectorType: 'Type2',
              powerKw: 22,
              currentType: 'AC',
              status: 'available',
              pricePerKwh: 80,
            },
          ],
        },
        {
          externalId: 'ECOCARS_002',
          name: 'EcoCars Северный проспект',
          address: 'Северный проспект, Ереван',
          city: 'Yerevan',
          latitude: 40.1950,
          longitude: 44.5150,
          isPublic: true,
          is24Hours: false,
          amenities: ['wifi', 'cafe'],
          photos: [],
          description: 'EcoCars station on Northern Avenue',
          connectors: [
            {
              externalId: 'ECOCARS_002_1',
              connectorNumber: 1,
              connectorType: 'Type2',
              powerKw: 22,
              currentType: 'AC',
              status: 'available',
              pricePerKwh: 80,
            },
          ],
        },
      ];

      return mockStations;
    } catch (error) {
      logger.error('Error fetching EcoCars stations:', error);
      throw error;
    }
  }

  async getConnectorStatus(connectorId: string): Promise<ConnectorStatus> {
    try {
      // const response = await this.client.get(`/api/v1/connectors/${connectorId}/status`);

      // Mock response
      return {
        connectorId,
        status: 'available',
        lastUpdate: new Date(),
      };
    } catch (error) {
      logger.error('Error getting EcoCars connector status:', error);
      throw error;
    }
  }

  async remoteStartTransaction(
    connectorId: string,
    idTag: string
  ): Promise<TransactionResult> {
    try {
      logger.info(`EcoCars: Starting remote transaction for ${connectorId}`);

      // const response = await this.client.post('/api/v1/sessions/start', {
      //   connector_id: connectorId,
      //   user_id: idTag,
      // });

      // Mock response
      return {
        transactionId: `ECOCARS_TXN_${Date.now()}`,
        status: 'accepted',
        message: 'Charging started successfully',
      };
    } catch (error) {
      logger.error('Error starting EcoCars transaction:', error);
      return {
        transactionId: '',
        status: 'rejected',
        message: 'Failed to start charging',
      };
    }
  }

  async remoteStopTransaction(transactionId: string): Promise<void> {
    try {
      logger.info(`EcoCars: Stopping transaction ${transactionId}`);

      // await this.client.post('/api/v1/sessions/stop', {
      //   transaction_id: transactionId,
      // });

      logger.info(`EcoCars: Transaction ${transactionId} stopped`);
    } catch (error) {
      logger.error('Error stopping EcoCars transaction:', error);
      throw error;
    }
  }

  async getSessionData(transactionId: string): Promise<SessionData> {
    try {
      // const response = await this.client.get(`/api/v1/sessions/${transactionId}`);

      // Mock response
      return {
        transactionId,
        startTime: new Date(Date.now() - 1200000), // 20 minutes ago
        endTime: new Date(),
        energyDeliveredKwh: 8.5,
        maxPowerKw: 22,
        avgPowerKw: 20,
        totalCost: 680,
        status: 'completed',
      };
    } catch (error) {
      logger.error('Error getting EcoCars session data:', error);
      throw error;
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      // await this.client.get('/api/v1/health');
      logger.info('EcoCars connection test successful');
      return true;
    } catch (error) {
      logger.error('EcoCars connection test failed:', error);
      return false;
    }
  }
}
