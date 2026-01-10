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
    underscored: true, // Use snake_case for database columns
    timestamps: true,
  },
});

initializeDatabase(sequelize);

export async function connectDatabase(): Promise<void> {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');

    // Force recreate tables on first deployment to fix column naming
    // Set FORCE_SYNC=true in Railway to recreate tables
    // After first successful deployment, remove this env var
    const forceSync = process.env.FORCE_SYNC === 'true';

    if (forceSync) {
      console.log('⚠️  FORCE_SYNC enabled - dropping and recreating all tables...');
      await sequelize.sync({ force: true });
      console.log('✅ Database tables recreated successfully.');
    } else {
      // Auto-create/update tables on deployment
      await sequelize.sync({ alter: true });
      console.log('✅ Database models synchronized.');
    }
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    throw error;
  }
}

export async function closeDatabaseConnection(): Promise<void> {
  await sequelize.close();
  console.log('Database connection closed.');
}
