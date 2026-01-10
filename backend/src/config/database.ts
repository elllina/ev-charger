import { Sequelize } from 'sequelize-typescript';
import dotenv from 'dotenv';
import { initializeDatabase } from '../models';

dotenv.config();

const databaseUrl = process.env.DATABASE_URL ||
  `postgres://${process.env.DB_USER || 'postgres'}:${process.env.DB_PASSWORD || 'postgres'}@${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || '5432'}/${process.env.DB_NAME || 'ev_charging'}`;

export const sequelize = new Sequelize(databaseUrl, {
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  define: {
    underscored: false,
    timestamps: true,
  },
});

initializeDatabase(sequelize);

export async function connectDatabase(): Promise<void> {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');

    // Auto-create tables on first deployment
    // In production, we'll sync once to create tables
    // Later you should use proper migrations
    await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
    console.log('✅ Database models synchronized.');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    throw error;
  }
}

export async function closeDatabaseConnection(): Promise<void> {
  await sequelize.close();
  console.log('Database connection closed.');
}
