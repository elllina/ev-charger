import { sequelize } from './config/database';
import { logger } from './config/logger';

async function setupDatabase() {
  try {
    logger.info('🔧 Setting up database...');

    // Sync all models (create tables)
    await sequelize.sync({ alter: true });

    logger.info('✅ Database tables created successfully');
    process.exit(0);
  } catch (error) {
    logger.error('❌ Database setup failed:', error);
    process.exit(1);
  }
}

setupDatabase();
