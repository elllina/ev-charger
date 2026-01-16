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
  HasMany,
  CreatedAt,
  UpdatedAt,
  Index,
} from 'sequelize-typescript';
import { ChargingNetwork } from './ChargingNetwork';
import { Connector } from './Connector';
import { Favorite } from './Favorite';

@Table({
  tableName: 'charging_stations',
  timestamps: true,
})
export class ChargingStation extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @ForeignKey(() => ChargingNetwork)
  @AllowNull(false)
  @Column(DataType.UUID)
  networkId!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  externalId!: string; // ID in CPO's system

  @AllowNull(false)
  @Column(DataType.STRING)
  name!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  address!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  city!: string;

  @AllowNull(false)
  @Column(DataType.DECIMAL(10, 8))
  latitude!: number;

  @AllowNull(false)
  @Column(DataType.DECIMAL(11, 8))
  longitude!: number;

  @Default(true)
  @Column(DataType.BOOLEAN)
  isPublic!: boolean;

  @Default(false)
  @Column(DataType.BOOLEAN)
  is24Hours!: boolean;

  @Column(DataType.ARRAY(DataType.STRING))
  amenities?: string[]; // ['wifi', 'cafe', 'restroom']

  @Column(DataType.ARRAY(DataType.STRING))
  photos?: string[]; // URLs to photos

  @Column(DataType.DECIMAL(3, 2))
  rating?: number;

  @Default(0)
  @Column(DataType.INTEGER)
  totalRatings?: number;

  @Column(DataType.TEXT)
  description?: string;

  @Column(DataType.STRING)
  accessInstructions?: string;

  @Column(DataType.JSON)
  openingHours?: object; // { monday: { open: "08:00", close: "20:00" }, ... }

  @Default('active')
  @Column(DataType.ENUM('active', 'inactive', 'maintenance'))
  status!: 'active' | 'inactive' | 'maintenance';

  // OCPP charge point ID - links this station to an OCPP charger
  @Index
  @Column(DataType.STRING)
  ocppChargePointId?: string;

  // Last time the OCPP charge point connected
  @Column(DataType.DATE)
  ocppLastSeen?: Date;

  // OCPP connection status
  @Default(false)
  @Column(DataType.BOOLEAN)
  ocppConnected!: boolean;

  // OCPP charge point vendor info
  @Column(DataType.STRING)
  ocppVendor?: string;

  @Column(DataType.STRING)
  ocppModel?: string;

  @Column(DataType.STRING)
  ocppFirmwareVersion?: string;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @BelongsTo(() => ChargingNetwork)
  network?: ChargingNetwork;

  @HasMany(() => Connector)
  connectors?: Connector[];

  @HasMany(() => Favorite)
  favorites?: Favorite[];
}
