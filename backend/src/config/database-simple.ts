import { Sequelize } from 'sequelize-typescript';
import path from 'path';
import { logger } from './logger';
import { models } from '../models';

/**
 * Simplified database configuration for local development
 * Uses SQLite instead of PostgreSQL - no installation needed!
 */

const USE_SQLITE = process.env.USE_SQLITE === 'true' || process.env.NODE_ENV === 'development';

let sequelize: Sequelize;

if (USE_SQLITE) {
  // SQLite for easy local development
  logger.info('Using SQLite for local development');

  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, '../../dev-database.sqlite'),
    logging: (msg) => logger.debug(msg),
    models: models,
  });
} else {
  // PostgreSQL for production
  const DATABASE_URL = process.env.DATABASE_URL ||
    `postgres://${process.env.DB_USER || 'postgres'}:${process.env.DB_PASSWORD || 'postgres'}@${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 5432}/${process.env.DB_NAME || 'ev_charging'}`;

  sequelize = new Sequelize(DATABASE_URL, {
    dialect: 'postgres',
    logging: (msg) => logger.debug(msg),
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    models: models,
  });
}

export { sequelize };

/**
 * Initialize database connection
 */
export async function initializeDatabase(): Promise<void> {
  try {
    await sequelize.authenticate();
    logger.info('Database connection established successfully');

    // Sync models in development
    if (process.env.NODE_ENV === 'development' && USE_SQLITE) {
      await sequelize.sync({ alter: true });
      logger.info('Database models synchronized');
    }
  } catch (error) {
    logger.error('Unable to connect to the database:', error);
    throw error;
  }
}

/**
 * Close database connection
 */
export async function closeDatabase(): Promise<void> {
  await sequelize.close();
  logger.info('Database connection closed');
}
