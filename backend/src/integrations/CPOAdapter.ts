/**
 * Abstract interface for Charge Point Operator (CPO) integrations
 * Each CPO network (EVAN, EcoCars, etc.) should implement this interface
 */

export interface StationData {
  externalId: string;
  name: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  isPublic: boolean;
  is24Hours: boolean;
  amenities?: string[];
  photos?: string[];
  description?: string;
  connectors: ConnectorData[];
}

export interface ConnectorData {
  externalId: string;
  connectorNumber: number;
  connectorType: 'Type2' | 'CCS2' | 'CHAdeMO' | 'GBT';
  powerKw: number;
  currentType: 'AC' | 'DC';
  status: 'available' | 'occupied' | 'faulted' | 'offline';
  pricePerKwh: number;
  pricePerMinute?: number;
  startFee?: number;
}

export interface ConnectorStatus {
  connectorId: string;
  status: 'available' | 'occupied' | 'faulted' | 'offline';
  lastUpdate: Date;
}

export interface TransactionResult {
  transactionId: string;
  status: 'accepted' | 'rejected';
  message?: string;
}

export interface SessionData {
  transactionId: string;
  startTime: Date;
  endTime?: Date;
  energyDeliveredKwh: number;
  maxPowerKw?: number;
  avgPowerKw?: number;
  totalCost?: number;
  status: 'active' | 'completed' | 'failed';
}

export abstract class CPOAdapter {
  protected networkId: string;
  protected apiBaseUrl: string;
  protected credentials: any;

  constructor(networkId: string, apiBaseUrl: string, credentials: any) {
    this.networkId = networkId;
    this.apiBaseUrl = apiBaseUrl;
    this.credentials = credentials;
  }

  /**
   * Fetch all stations from CPO
   */
  abstract fetchStations(): Promise<StationData[]>;

  /**
   * Get real-time status of a specific connector
   */
  abstract getConnectorStatus(connectorId: string): Promise<ConnectorStatus>;

  /**
   * Initiate remote start of charging session
   */
  abstract remoteStartTransaction(
    connectorId: string,
    idTag: string
  ): Promise<TransactionResult>;

  /**
   * Stop an active charging session
   */
  abstract remoteStopTransaction(transactionId: string): Promise<void>;

  /**
   * Get session data (for completed or active sessions)
   */
  abstract getSessionData(transactionId: string): Promise<SessionData>;

  /**
   * Test connection to CPO API
   */
  abstract testConnection(): Promise<boolean>;
}
