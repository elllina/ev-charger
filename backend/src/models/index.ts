import { Sequelize } from 'sequelize-typescript';
import { User } from './User';
import { ChargingNetwork } from './ChargingNetwork';
import { ChargingStation } from './ChargingStation';
import { Connector } from './Connector';
import { ChargingSession } from './ChargingSession';
import { Transaction } from './Transaction';
import { Favorite } from './Favorite';

export const models = [
  User,
  ChargingNetwork,
  ChargingStation,
  Connector,
  ChargingSession,
  Transaction,
  Favorite,
];

export {
  User,
  ChargingNetwork,
  ChargingStation,
  Connector,
  ChargingSession,
  Transaction,
  Favorite,
};

export function initializeDatabase(sequelize: Sequelize): void {
  sequelize.addModels(models);
}
