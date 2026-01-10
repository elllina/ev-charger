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
  Index,
} from 'sequelize-typescript';
import { User } from './User';
import { ChargingStation } from './ChargingStation';

@Table({
  tableName: 'favorites',
  timestamps: false,
})
export class Favorite extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column(DataType.UUID)
  userId!: string;

  @ForeignKey(() => ChargingStation)
  @AllowNull(false)
  @Column(DataType.UUID)
  stationId!: string;

  @CreatedAt
  createdAt!: Date;

  @BelongsTo(() => User)
  user?: User;

  @BelongsTo(() => ChargingStation)
  station?: ChargingStation;
}
