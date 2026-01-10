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
import { Transaction } from './Transaction';
import { Favorite } from './Favorite';

@Table({
  tableName: 'users',
  timestamps: true,
})
export class User extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @Unique
  @AllowNull(false)
  @Column(DataType.STRING)
  phone!: string; // +374XXXXXXXX

  @Column(DataType.STRING)
  email?: string;

  @Column(DataType.STRING)
  firstName?: string;

  @Column(DataType.STRING)
  lastName?: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  passwordHash!: string;

  @Default(0)
  @Column(DataType.DECIMAL(10, 2))
  walletBalance!: number; // Balance in AMD

  @Default('hy')
  @Column(DataType.ENUM('hy', 'ru', 'en'))
  preferredLanguage!: 'hy' | 'ru' | 'en';

  @Default(false)
  @Column(DataType.BOOLEAN)
  isVerified!: boolean;

  @Column(DataType.STRING)
  verificationCode?: string;

  @Column(DataType.DATE)
  verificationCodeExpiry?: Date;

  @Column(DataType.STRING)
  refreshToken?: string;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @HasMany(() => Transaction)
  transactions?: Transaction[];

  @HasMany(() => Favorite)
  favorites?: Favorite[];
}
