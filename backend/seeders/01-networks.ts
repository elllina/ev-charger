import { ChargingNetwork } from '../src/models/ChargingNetwork';

export async function seedNetworks(): Promise<void> {
  const networks = [
    {
      id: '11111111-1111-1111-1111-111111111111',
      name: 'EVAN',
      slug: 'evan',
      logoUrl: 'https://example.com/logos/evan.png',
      website: 'https://evan.network',
      supportPhone: '+37410123456',
      supportEmail: 'support@evan.network',
      integrationStatus: 'active',
      integrationType: 'ocpi',
      apiBaseUrl: 'https://api.evan.network',
      color: '#00A859',
    },
    {
      id: '22222222-2222-2222-2222-222222222222',
      name: 'EcoCars',
      slug: 'ecocars',
      logoUrl: 'https://example.com/logos/ecocars.png',
      website: 'https://ecocars.am',
      supportPhone: '+37410234567',
      supportEmail: 'support@ecocars.am',
      integrationStatus: 'active',
      integrationType: 'custom_api',
      apiBaseUrl: 'https://api.ecocars.am',
      color: '#0066CC',
    },
    {
      id: '33333333-3333-3333-3333-333333333333',
      name: 'iCharge',
      slug: 'icharge',
      logoUrl: 'https://example.com/logos/icharge.png',
      website: 'https://icharge.am',
      supportPhone: '+37410345678',
      supportEmail: 'support@icharge.am',
      integrationStatus: 'pending',
      integrationType: 'manual',
      color: '#FF6600',
    },
    {
      id: '44444444-4444-4444-4444-444444444444',
      name: 'Amperion',
      slug: 'amperion',
      logoUrl: 'https://example.com/logos/amperion.png',
      website: 'https://amperion.am',
      supportPhone: '+37410456789',
      supportEmail: 'support@amperion.am',
      integrationStatus: 'pending',
      integrationType: 'manual',
      color: '#9C27B0',
    },
  ];

  for (const network of networks) {
    await ChargingNetwork.upsert(network);
  }

  console.log(`✅ Seeded ${networks.length} charging networks`);
}
