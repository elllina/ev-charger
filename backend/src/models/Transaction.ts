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
import { ChargingSession } from './ChargingSession';

@Table({
  tableName: 'transactions',
  timestamps: false,
})
export class Transaction extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column(DataType.UUID)
  userId!: string;

  @ForeignKey(() => ChargingSession)
  @Column(DataType.UUID)
  sessionId?: string;

  @AllowNull(false)
  @Column(DataType.ENUM('topup', 'charge', 'refund', 'withdrawal'))
  type!: 'topup' | 'charge' | 'refund' | 'withdrawal';

  @AllowNull(false)
  @Column(DataType.DECIMAL(10, 2))
  amount!: number; // AMD

  @AllowNull(false)
  @Column(DataType.DECIMAL(10, 2))
  balanceBefore!: number;

  @AllowNull(false)
  @Column(DataType.DECIMAL(10, 2))
  balanceAfter!: number;

  @Column(DataType.ENUM('card', 'idram', 'telcell', 'wallet'))
  paymentMethod?: 'card' | 'idram' | 'telcell' | 'wallet';

  @Column(DataType.STRING)
  paymentReference?: string; // External payment system reference

  @Column(DataType.STRING)
  description?: string;

  @Default('completed')
  @Column(DataType.ENUM('pending', 'completed', 'failed', 'cancelled'))
  status!: 'pending' | 'completed' | 'failed' | 'cancelled';

  @Column(DataType.JSON)
  metadata?: object;

  @CreatedAt
  createdAt!: Date;

  @BelongsTo(() => User)
  user?: User;

  @BelongsTo(() => ChargingSession)
  session?: ChargingSession;
}
