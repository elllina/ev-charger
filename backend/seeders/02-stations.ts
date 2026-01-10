import { ChargingStation } from '../src/models/ChargingStation';
import { Connector } from '../src/models/Connector';

export async function seedStations(): Promise<void> {
  const stations = [
    // EVAN Stations
    {
      id: 'a0000000-0000-0000-0000-000000000001',
      networkId: '11111111-1111-1111-1111-111111111111',
      externalId: 'EVAN_001',
      name: 'EVAN Dalma Garden Mall',
      address: 'Dalma Garden Mall, Tsitsernakaberd Hwy, Yerevan',
      city: 'Yerevan',
      latitude: 40.1548,
      longitude: 44.4867,
      isPublic: true,
      is24Hours: true,
      amenities: ['wifi', 'cafe', 'parking', 'restroom', 'shopping'],
      description: 'Fast charging station at Dalma Garden Mall',
      status: 'active',
      connectors: [
        {
          externalId: 'EVAN_001_1',
          connectorNumber: 1,
          connectorType: 'CCS2',
          powerKw: 120,
          currentType: 'DC',
          status: 'available',
          pricePerKwh: 120,
          startFee: 200,
        },
        {
          externalId: 'EVAN_001_2',
          connectorNumber: 2,
          connectorType: 'CHAdeMO',
          powerKw: 50,
          currentType: 'DC',
          status: 'available',
          pricePerKwh: 100,
          startFee: 200,
        },
      ],
    },
    {
      id: 'a0000000-0000-0000-0000-000000000002',
      networkId: '11111111-1111-1111-1111-111111111111',
      externalId: 'EVAN_002',
      name: 'EVAN Yerevan Mall',
      address: 'Yerevan Mall, Arshakunyats Ave, Yerevan',
      city: 'Yerevan',
      latitude: 40.2000,
      longitude: 44.5100,
      isPublic: true,
      is24Hours: false,
      amenities: ['wifi', 'parking', 'shopping'],
      description: 'Charging station at Yerevan Mall',
      status: 'active',
      connectors: [
        {
          externalId: 'EVAN_002_1',
          connectorNumber: 1,
          connectorType: 'CCS2',
          powerKw: 50,
          currentType: 'DC',
          status: 'available',
          pricePerKwh: 100,
        },
      ],
    },

    // EcoCars Stations
    {
      id: 'a0000000-0000-0000-0000-000000000003',
      networkId: '22222222-2222-2222-2222-222222222222',
      externalId: 'ECOCARS_001',
      name: 'EcoCars Центр',
      address: 'Abovyan St 1, Yerevan',
      city: 'Yerevan',
      latitude: 40.1792,
      longitude: 44.4991,
      isPublic: true,
      is24Hours: true,
      amenities: ['parking'],
      description: 'EcoCars charging station in city center',
      status: 'active',
      connectors: [
        {
          externalId: 'ECOCARS_001_1',
          connectorNumber: 1,
          connectorType: 'CCS2',
          powerKw: 50,
          currentType: 'DC',
          status: 'available',
          pricePerKwh: 100,
        },
        {
          externalId: 'ECOCARS_001_2',
          connectorNumber: 2,
          connectorType: 'Type2',
          powerKw: 22,
          currentType: 'AC',
          status: 'available',
          pricePerKwh: 80,
        },
      ],
    },
    {
      id: 'a0000000-0000-0000-0000-000000000004',
      networkId: '22222222-2222-2222-2222-222222222222',
      externalId: 'ECOCARS_002',
      name: 'EcoCars Northern Avenue',
      address: 'Northern Avenue, Yerevan',
      city: 'Yerevan',
      latitude: 40.1950,
      longitude: 44.5150,
      isPublic: true,
      is24Hours: false,
      amenities: ['wifi', 'cafe'],
      description: 'EcoCars station on Northern Avenue',
      status: 'active',
      connectors: [
        {
          externalId: 'ECOCARS_002_1',
          connectorNumber: 1,
          connectorType: 'Type2',
          powerKw: 22,
          currentType: 'AC',
          status: 'available',
          pricePerKwh: 80,
        },
      ],
    },
    {
      id: 'a0000000-0000-0000-0000-000000000005',
      networkId: '22222222-2222-2222-2222-222222222222',
      externalId: 'ECOCARS_003',
      name: 'EcoCars Republic Square',
      address: 'Republic Square, Yerevan',
      city: 'Yerevan',
      latitude: 40.1776,
      longitude: 44.5126,
      isPublic: true,
      is24Hours: true,
      amenities: ['wifi', 'cafe', 'restroom'],
      description: 'Central location at Republic Square',
      status: 'active',
      connectors: [
        {
          externalId: 'ECOCARS_003_1',
          connectorNumber: 1,
          connectorType: 'CCS2',
          powerKw: 120,
          currentType: 'DC',
          status: 'occupied',
          pricePerKwh: 120,
          startFee: 200,
        },
        {
          externalId: 'ECOCARS_003_2',
          connectorNumber: 2,
          connectorType: 'Type2',
          powerKw: 22,
          currentType: 'AC',
          status: 'available',
          pricePerKwh: 80,
        },
      ],
    },

    // More stations around Yerevan
    {
      id: 'a0000000-0000-0000-0000-000000000006',
      networkId: '11111111-1111-1111-1111-111111111111',
      externalId: 'EVAN_003',
      name: 'EVAN Cascade Complex',
      address: 'Tamanyan St 10, Yerevan',
      city: 'Yerevan',
      latitude: 40.1886,
      longitude: 44.5156,
      isPublic: true,
      is24Hours: false,
      amenities: ['wifi', 'cafe', 'restroom'],
      description: 'Near Cascade Complex',
      status: 'active',
      connectors: [
        {
          externalId: 'EVAN_003_1',
          connectorNumber: 1,
          connectorType: 'Type2',
          powerKw: 22,
          currentType: 'AC',
          status: 'available',
          pricePerKwh: 80,
        },
      ],
    },
    {
      id: 'a0000000-0000-0000-0000-000000000007',
      networkId: '22222222-2222-2222-2222-222222222222',
      externalId: 'ECOCARS_004',
      name: 'EcoCars Erebuni Plaza',
      address: 'Erebuni Plaza, Yerevan',
      city: 'Yerevan',
      latitude: 40.1450,
      longitude: 44.5050,
      isPublic: true,
      is24Hours: true,
      amenities: ['parking', 'shopping'],
      description: 'Shopping center location',
      status: 'active',
      connectors: [
        {
          externalId: 'ECOCARS_004_1',
          connectorNumber: 1,
          connectorType: 'CCS2',
          powerKw: 50,
          currentType: 'DC',
          status: 'available',
          pricePerKwh: 100,
        },
      ],
    },
  ];

  for (const stationData of stations) {
    const { connectors, ...station } = stationData;

    // Create station
    await ChargingStation.upsert(station);

    // Create connectors
    for (const connectorData of connectors) {
      await Connector.upsert({
        stationId: station.id,
        ...connectorData,
        lastStatusUpdate: new Date(),
      });
    }
  }

  console.log(`✅ Seeded ${stations.length} charging stations`);
}
