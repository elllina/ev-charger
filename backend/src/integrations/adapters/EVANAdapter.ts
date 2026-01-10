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
 * EVAN Network Adapter using OCPI 2.2 protocol
 * This is a mock implementation - replace with actual OCPI endpoints after negotiations
 */
export class EVANAdapter extends CPOAdapter {
  private client: AxiosInstance;

  constructor(networkId: string, apiBaseUrl: string, credentials: any) {
    super(networkId, apiBaseUrl, credentials);

    this.client = axios.create({
      baseURL: this.apiBaseUrl,
      timeout: 10000,
      headers: {
        'Authorization': `Token ${credentials.token}`,
        'Content-Type': 'application/json',
      },
    });
  }

  async fetchStations(): Promise<StationData[]> {
    try {
      logger.info(`Fetching stations from EVAN (OCPI)`);

      // OCPI 2.2 Locations endpoint
      // const response = await this.client.get('/ocpi/2.2/locations');

      // Mock data for now
      const mockStations: StationData[] = [
        {
          externalId: 'EVAN_001',
          name: 'EVAN Dalma Garden Mall',
          address: 'Dalma Garden Mall, Yerevan',
          city: 'Yerevan',
          latitude: 40.1548,
          longitude: 44.4867,
          isPublic: true,
          is24Hours: true,
          amenities: ['wifi', 'cafe', 'parking', 'restroom'],
          photos: [],
          description: 'Fast charging station at Dalma Garden Mall',
          connectors: [
            {
              externalId: 'EVAN_001_1',
              connectorNumber: 1,
              connectorType: 'CCS2',
              powerKw: 120,
              currentType: 'DC',
              status: 'available',
              pricePerKwh: 120,
              startFee: 200,
            },
            {
              externalId: 'EVAN_001_2',
              connectorNumber: 2,
              connectorType: 'CHAdeMO',
              powerKw: 50,
              currentType: 'DC',
              status: 'available',
              pricePerKwh: 100,
              startFee: 200,
            },
          ],
        },
        {
          externalId: 'EVAN_002',
          name: 'EVAN Yerevan Mall',
          address: 'Yerevan Mall, Yerevan',
          city: 'Yerevan',
          latitude: 40.2000,
          longitude: 44.5100,
          isPublic: true,
          is24Hours: false,
          amenities: ['wifi', 'parking'],
          photos: [],
          description: 'Charging station at Yerevan Mall',
          connectors: [
            {
              externalId: 'EVAN_002_1',
              connectorNumber: 1,
              connectorType: 'CCS2',
              powerKw: 50,
              currentType: 'DC',
              status: 'available',
              pricePerKwh: 100,
            },
          ],
        },
      ];

      return mockStations;
    } catch (error) {
      logger.error('Error fetching EVAN stations:', error);
      throw error;
    }
  }

  async getConnectorStatus(connectorId: string): Promise<ConnectorStatus> {
    try {
      // OCPI endpoint to get connector status
      // const response = await this.client.get(`/ocpi/2.2/connectors/${connectorId}`);

      // Mock response
      return {
        connectorId,
        status: 'available',
        lastUpdate: new Date(),
      };
    } catch (error) {
      logger.error('Error getting EVAN connector status:', error);
      throw error;
    }
  }

  async remoteStartTransaction(
    connectorId: string,
    idTag: string
  ): Promise<TransactionResult> {
    try {
      logger.info(`EVAN: Starting remote transaction for ${connectorId}`);

      // OCPI Commands module - START_SESSION
      // const response = await this.client.post('/ocpi/2.2/commands/START_SESSION', {
      //   connector_id: connectorId,
      //   token: { uid: idTag, type: 'RFID' },
      // });

      // Mock response
      return {
        transactionId: `EVAN_TXN_${Date.now()}`,
        status: 'accepted',
        message: 'Charging started successfully',
      };
    } catch (error) {
      logger.error('Error starting EVAN transaction:', error);
      return {
        transactionId: '',
        status: 'rejected',
        message: 'Failed to start charging',
      };
    }
  }

  async remoteStopTransaction(transactionId: string): Promise<void> {
    try {
      logger.info(`EVAN: Stopping transaction ${transactionId}`);

      // OCPI Commands module - STOP_SESSION
      // await this.client.post('/ocpi/2.2/commands/STOP_SESSION', {
      //   session_id: transactionId,
      // });

      logger.info(`EVAN: Transaction ${transactionId} stopped`);
    } catch (error) {
      logger.error('Error stopping EVAN transaction:', error);
      throw error;
    }
  }

  async getSessionData(transactionId: string): Promise<SessionData> {
    try {
      // OCPI CDRs (Charge Detail Records) module
      // const response = await this.client.get(`/ocpi/2.2/cdrs/${transactionId}`);

      // Mock response
      return {
        transactionId,
        startTime: new Date(Date.now() - 1800000), // 30 minutes ago
        endTime: new Date(),
        energyDeliveredKwh: 15.5,
        maxPowerKw: 48,
        avgPowerKw: 45,
        totalCost: 1550,
        status: 'completed',
      };
    } catch (error) {
      logger.error('Error getting EVAN session data:', error);
      throw error;
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      // OCPI Versions endpoint
      // await this.client.get('/ocpi/2.2/versions');
      logger.info('EVAN connection test successful');
      return true;
    } catch (error) {
      logger.error('EVAN connection test failed:', error);
      return false;
    }
  }
}
