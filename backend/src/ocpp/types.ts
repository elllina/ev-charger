/**
 * OCPP 1.6J Protocol Implementation
 * Open Charge Point Protocol for EV charging station communication
 *
 * Specification: https://www.openchargealliance.org/protocols/ocpp-16/
 */

export enum OCPPAction {
  // Core Profile
  Authorize = 'Authorize',
  BootNotification = 'BootNotification',
  ChangeAvailability = 'ChangeAvailability',
  ChangeConfiguration = 'ChangeConfiguration',
  ClearCache = 'ClearCache',
  DataTransfer = 'DataTransfer',
  GetConfiguration = 'GetConfiguration',
  Heartbeat = 'Heartbeat',
  MeterValues = 'MeterValues',
  RemoteStartTransaction = 'RemoteStartTransaction',
  RemoteStopTransaction = 'RemoteStopTransaction',
  Reset = 'Reset',
  StartTransaction = 'StartTransaction',
  StatusNotification = 'StatusNotification',
  StopTransaction = 'StopTransaction',
  UnlockConnector = 'UnlockConnector',
}

export enum OCPPMessageType {
  CALL = 2,       // Request from client to server
  CALLRESULT = 3, // Response to a request
  CALLERROR = 4,  // Error response
}

export enum ChargePointStatus {
  Available = 'Available',
  Preparing = 'Preparing',
  Charging = 'Charging',
  SuspendedEVSE = 'SuspendedEVSE',
  SuspendedEV = 'SuspendedEV',
  Finishing = 'Finishing',
  Reserved = 'Reserved',
  Unavailable = 'Unavailable',
  Faulted = 'Faulted',
}

export enum AuthorizationStatus {
  Accepted = 'Accepted',
  Blocked = 'Blocked',
  Expired = 'Expired',
  Invalid = 'Invalid',
  ConcurrentTx = 'ConcurrentTx',
}

export enum AvailabilityType {
  Inoperative = 'Inoperative',
  Operative = 'Operative',
}

export enum RegistrationStatus {
  Accepted = 'Accepted',
  Pending = 'Pending',
  Rejected = 'Rejected',
}

// OCPP Message Types
export type OCPPCall = [
  OCPPMessageType.CALL,
  string,      // Unique message ID
  OCPPAction,  // Action name
  any          // Payload
];

export type OCPPCallResult = [
  OCPPMessageType.CALLRESULT,
  string,  // Message ID (matches the request)
  any      // Result payload
];

export type OCPPCallError = [
  OCPPMessageType.CALLERROR,
  string,  // Message ID (matches the request)
  string,  // Error code
  string,  // Error description
  any      // Error details
];

export type OCPPMessage = OCPPCall | OCPPCallResult | OCPPCallError;

// Request/Response Payloads

export interface BootNotificationRequest {
  chargePointVendor: string;
  chargePointModel: string;
  chargePointSerialNumber?: string;
  chargeBoxSerialNumber?: string;
  firmwareVersion?: string;
  iccid?: string;
  imsi?: string;
  meterType?: string;
  meterSerialNumber?: string;
}

export interface BootNotificationResponse {
  status: RegistrationStatus;
  currentTime: string; // ISO 8601 format
  interval: number;    // Heartbeat interval in seconds
}

export interface HeartbeatRequest {}

export interface HeartbeatResponse {
  currentTime: string; // ISO 8601 format
}

export interface AuthorizeRequest {
  idTag: string;
}

export interface IdTagInfo {
  status: AuthorizationStatus;
  expiryDate?: string;
  parentIdTag?: string;
}

export interface AuthorizeResponse {
  idTagInfo: IdTagInfo;
}

export interface StartTransactionRequest {
  connectorId: number;
  idTag: string;
  meterStart: number;
  timestamp: string;
  reservationId?: number;
}

export interface StartTransactionResponse {
  idTagInfo: IdTagInfo;
  transactionId: number;
}

export interface StopTransactionRequest {
  transactionId: number;
  timestamp: string;
  meterStop: number;
  idTag?: string;
  reason?: string;
  transactionData?: MeterValue[];
}

export interface StopTransactionResponse {
  idTagInfo?: IdTagInfo;
}

export interface StatusNotificationRequest {
  connectorId: number;
  errorCode: string;
  status: ChargePointStatus;
  timestamp?: string;
  info?: string;
  vendorId?: string;
  vendorErrorCode?: string;
}

export interface StatusNotificationResponse {}

export interface MeterValue {
  timestamp: string;
  sampledValue: SampledValue[];
}

export interface SampledValue {
  value: string;
  context?: string;
  format?: string;
  measurand?: string;
  phase?: string;
  location?: string;
  unit?: string;
}

export interface MeterValuesRequest {
  connectorId: number;
  transactionId?: number;
  meterValue: MeterValue[];
}

export interface MeterValuesResponse {}

export interface RemoteStartTransactionRequest {
  connectorId?: number;
  idTag: string;
  chargingProfile?: any;
}

export interface RemoteStartTransactionResponse {
  status: 'Accepted' | 'Rejected';
}

export interface RemoteStopTransactionRequest {
  transactionId: number;
}

export interface RemoteStopTransactionResponse {
  status: 'Accepted' | 'Rejected';
}

export interface UnlockConnectorRequest {
  connectorId: number;
}

export interface UnlockConnectorResponse {
  status: 'Unlocked' | 'UnlockFailed' | 'NotSupported';
}

export interface ResetRequest {
  type: 'Hard' | 'Soft';
}

export interface ResetResponse {
  status: 'Accepted' | 'Rejected';
}

// Error codes
export enum OCPPErrorCode {
  NotImplemented = 'NotImplemented',
  NotSupported = 'NotSupported',
  InternalError = 'InternalError',
  ProtocolError = 'ProtocolError',
  SecurityError = 'SecurityError',
  FormationViolation = 'FormationViolation',
  PropertyConstraintViolation = 'PropertyConstraintViolation',
  OccurenceConstraintViolation = 'OccurenceConstraintViolation',
  TypeConstraintViolation = 'TypeConstraintViolation',
  GenericError = 'GenericError',
}
