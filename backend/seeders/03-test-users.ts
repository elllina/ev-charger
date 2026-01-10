import bcrypt from 'bcryptjs';
import { User } from '../src/models/User';

export async function seedTestUsers(): Promise<void> {
  const password = await bcrypt.hash('test123456', 10);

  const users = [
    {
      id: 'u0000000-0000-0000-0000-000000000001',
      phone: '+37494123456',
      email: 'test1@example.com',
      firstName: 'Արման',
      lastName: 'Հարությունյան',
      passwordHash: password,
      walletBalance: 5000,
      preferredLanguage: 'hy',
      isVerified: true,
    },
    {
      id: 'u0000000-0000-0000-0000-000000000002',
      phone: '+37494234567',
      email: 'test2@example.com',
      firstName: 'Анна',
      lastName: 'Петросян',
      passwordHash: password,
      walletBalance: 10000,
      preferredLanguage: 'ru',
      isVerified: true,
    },
    {
      id: 'u0000000-0000-0000-0000-000000000003',
      phone: '+37494345678',
      email: 'test3@example.com',
      firstName: 'John',
      lastName: 'Smith',
      passwordHash: password,
      walletBalance: 2000,
      preferredLanguage: 'en',
      isVerified: true,
    },
  ];

  for (const user of users) {
    await User.upsert(user);
  }

  console.log(`✅ Seeded ${users.length} test users`);
  console.log('📝 Test credentials:');
  console.log('   Phone: +37494123456, Password: test123456');
  console.log('   Phone: +37494234567, Password: test123456');
  console.log('   Phone: +37494345678, Password: test123456');
}
