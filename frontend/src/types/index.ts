// Station types from Open Charge Map
export interface Station {
  id: string;
  name: string;
  address: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  operatorName?: string;
  distance?: number;
  connectors: Connector[];
}

export interface Connector {
  id: string;
  type: string;
  powerKW?: number;
  available: boolean;
  status?: string;
}

// Active charging session
export interface ChargingSession {
  id: string;
  stationId: string;
  stationName: string;
  connectorId: string;
  connectorType: string;
  powerKW: number;
  startTime: Date;
  energyKwh: number;
  currentPowerKw: number;
  duration: string;
  cost: number;
  status: 'charging' | 'completed' | 'stopped';
}

// OCPP Charge Point types
export interface ChargePoint {
  chargePointId: string;
  connected: boolean;
  status?: string;
}

export interface ChargePointStatus {
  chargePointId: string;
  connected: boolean;
  connectorId?: number;
  status?: string;
}

export interface StartChargingRequest {
  connectorId: number;
  idTag: string;
}

export interface StopChargingRequest {
  transactionId: number;
}

export interface RemoteCommandResponse {
  success: boolean;
  chargePointId: string;
  connectorId?: number;
  transactionId?: number;
  result: any;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface NearbyStationsParams {
  latitude: number;
  longitude: number;
  radius?: number;
  maxResults?: number;
}
