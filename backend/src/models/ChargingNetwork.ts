import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  Unique,
  AllowNull,
  CreatedAt,
  UpdatedAt,
  HasMany,
} from 'sequelize-typescript';
import { ChargingStation } from './ChargingStation';

@Table({
  tableName: 'charging_networks',
  timestamps: true,
})
export class ChargingNetwork extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  name!: string; // "EcoCars", "EVAN", etc.

  @Unique
  @AllowNull(false)
  @Column(DataType.STRING)
  slug!: string; // "ecocars", "evan"

  @Column(DataType.STRING)
  logoUrl?: string;

  @Column(DataType.STRING)
  website?: string;

  @Column(DataType.STRING)
  supportPhone?: string;

  @Column(DataType.STRING)
  supportEmail?: string;

  @Default('active')
  @Column(DataType.ENUM('active', 'pending', 'inactive'))
  integrationStatus!: 'active' | 'pending' | 'inactive';

  @Default('manual')
  @Column(DataType.ENUM('ocpi', 'custom_api', 'manual'))
  integrationType!: 'ocpi' | 'custom_api' | 'manual';

  @Column(DataType.STRING)
  apiBaseUrl?: string;

  @Column(DataType.JSON)
  apiCredentials?: object; // Encrypted JSON

  @Column(DataType.STRING)
  color?: string; // Brand color for UI

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @HasMany(() => ChargingStation)
  stations?: ChargingStation[];
}
