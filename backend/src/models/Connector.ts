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
import { ChargingStation } from './ChargingStation';

@Table({
  tableName: 'connectors',
  timestamps: true,
})
export class Connector extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @ForeignKey(() => ChargingStation)
  @AllowNull(false)
  @Column(DataType.UUID)
  stationId!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  externalId!: string; // ID in CPO's system

  @AllowNull(false)
  @Column(DataType.ENUM('Type2', 'CCS2', 'CHAdeMO', 'GBT'))
  connectorType!: 'Type2' | 'CCS2' | 'CHAdeMO' | 'GBT';

  @AllowNull(false)
  @Column(DataType.DECIMAL(6, 2))
  powerKw!: number; // 22, 50, 120, etc.

  @AllowNull(false)
  @Column(DataType.ENUM('AC', 'DC'))
  currentType!: 'AC' | 'DC';

  @Default('available')
  @Column(DataType.ENUM('available', 'occupied', 'faulted', 'offline', 'reserved'))
  status!: 'available' | 'occupied' | 'faulted' | 'offline' | 'reserved';

  @AllowNull(false)
  @Column(DataType.DECIMAL(8, 2))
  pricePerKwh!: number; // AMD per kWh

  @Column(DataType.DECIMAL(8, 2))
  pricePerMinute?: number; // AMD per minute (optional)

  @Column(DataType.DECIMAL(8, 2))
  startFee?: number; // AMD (optional)

  @Column(DataType.DATE)
  lastStatusUpdate!: Date;

  @Column(DataType.STRING)
  currentTransactionId?: string; // Active OCPP transaction ID

  @Column(DataType.INTEGER)
  connectorNumber!: number; // Physical connector number at station

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @BelongsTo(() => ChargingStation)
  station?: ChargingStation;
}
