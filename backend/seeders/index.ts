import { connectDatabase, closeDatabaseConnection } from '../src/config/database';
import { seedNetworks } from './01-networks';
import { seedStations } from './02-stations';
import { seedTestUsers } from './03-test-users';

async function runSeeders(): Promise<void> {
  try {
    console.log('🌱 Starting database seeding...\n');

    // Connect to database
    await connectDatabase();

    // Run seeders in order
    await seedNetworks();
    await seedStations();
    await seedTestUsers();

    console.log('\n✅ Database seeding completed successfully!');

    await closeDatabaseConnection();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    await closeDatabaseConnection();
    process.exit(1);
  }
}

runSeeders();
