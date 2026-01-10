import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  AllowNull,
  ForeignKey,
  BelongsTo,
  CreatedAt,
  UpdatedAt,
  Index,
} from 'sequelize-typescript';
import { User } from './User';
import { Connector } from './Connector';
import { ChargingStation } from './ChargingStation';

@Table({
  tableName: 'charging_sessions',
  timestamps: true,
})
export class ChargingSession extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column(DataType.UUID)
  userId!: string;

  @ForeignKey(() => Connector)
  @AllowNull(false)
  @Column(DataType.UUID)
  connectorId!: string;

  @ForeignKey(() => ChargingStation)
  @AllowNull(false)
  @Column(DataType.UUID)
  stationId!: string;

  @Index
  @Default('pending')
  @Column(DataType.ENUM('pending', 'active', 'completed', 'failed', 'cancelled'))
  sessionStatus!: 'pending' | 'active' | 'completed' | 'failed' | 'cancelled';

  // OCPP identification
  @Column(DataType.STRING)
  transactionId?: string; // OCPP transaction ID

  @Column(DataType.STRING)
  authorizationId?: string;

  @Column(DataType.DATE)
  startTime?: Date;

  @Column(DataType.DATE)
  endTime?: Date;

  // Measurements
  @Default(0)
  @Column(DataType.DECIMAL(10, 2))
  energyDeliveredKwh!: number;

  @Column(DataType.DECIMAL(6, 2))
  maxPowerKw?: number;

  @Column(DataType.DECIMAL(6, 2))
  avgPowerKw?: number;

  // Cost breakdown
  @Default(0)
  @Column(DataType.DECIMAL(10, 2))
  totalCostAmd!: number;

  @Default(0)
  @Column(DataType.DECIMAL(10, 2))
  energyCostAmd!: number;

  @Default(0)
  @Column(DataType.DECIMAL(10, 2))
  timeCostAmd!: number;

  @Default(0)
  @Column(DataType.DECIMAL(10, 2))
  startFeeCostAmd!: number;

  // Battery state
  @Column(DataType.INTEGER)
  startSoc?: number; // % if available

  @Column(DataType.INTEGER)
  endSoc?: number; // %

  @Column(DataType.INTEGER)
  maxAmountAmd?: number; // User-defined max amount

  @Column(DataType.TEXT)
  failureReason?: string;

  @Column(DataType.JSON)
  metadata?: object; // Additional data from CPO

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @BelongsTo(() => User)
  user?: User;

  @BelongsTo(() => Connector)
  connector?: Connector;

  @BelongsTo(() => ChargingStation)
  station?: ChargingStation;

  // Virtual field for duration
  get durationMinutes(): number | null {
    if (this.startTime && this.endTime) {
      return Math.floor((this.endTime.getTime() - this.startTime.getTime()) / 60000);
    }
    return null;
  }
}
