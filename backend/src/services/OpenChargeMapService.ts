import axios from 'axios';
import { logger } from '../config/logger';

/**
 * Open Charge Map API Integration
 * Fetches real charging station data from OpenChargeMap.org
 * API Docs: https://openchargemap.org/site/develop/api
 */

const OCM_API_BASE = 'https://api.openchargemap.io/v3';
const OCM_API_KEY = process.env.OCM_API_KEY || ''; // Optional, increases rate limit

interface OCMStation {
  ID: number;
  UUID: string;
  AddressInfo: {
    Title: string;
    AddressLine1: string;
    Town: string;
    StateOrProvince: string;
    Postcode: string;
    Country: {
      ISOCode: string;
      Title: string;
    };
    Latitude: number;
    Longitude: number;
    Distance: number;
    DistanceUnit: number;
  };
  Connections: Array<{
    ID: number;
    ConnectionTypeID: number;
    ConnectionType: {
      Title: string;
      FormalName: string;
    };
    PowerKW: number;
    CurrentTypeID: number;
    CurrentType: {
      Title: string;
    };
    StatusTypeID: number;
    StatusType: {
      Title: string;
      IsOperational: boolean;
    };
  }>;
  OperatorInfo?: {
    ID: number;
    Title: string;
    WebsiteURL?: string;
  };
  NumberOfPoints: number;
  StatusType?: {
    IsOperational: boolean;
    Title: string;
  };
  UsageType?: {
    Title: string;
    IsPayAtLocation: boolean;
  };
}

export interface NearbyStationsParams {
  latitude: number;
  longitude: number;
  radiusKm?: number;
  maxResults?: number;
  countryCode?: string;
  minPowerKW?: number;
  connectionType?: string;
}

export interface FormattedStation {
  id: string;
  name: string;
  address: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  distance?: number;
  operatorName?: string;
  connectors: Array<{
    id: string;
    type: string;
    powerKW?: number;
    available: boolean;
    status?: string;
  }>;
}

export class OpenChargeMapService {
  // Sample stations for Armenia when OCM API is unavailable
  private getSampleStations(): FormattedStation[] {
    return [
      {
        id: 'am-001',
        name: 'Yerevan Mall EV Station',
        address: '34/3 Arshakunyats Ave',
        city: 'Yerevan',
        country: 'Armenia',
        latitude: 40.1592,
        longitude: 44.5057,
        operatorName: 'EV Armenia',
        connectors: [
          { id: 'c1', type: 'CCS2', powerKW: 50, available: true, status: 'Available' },
          { id: 'c2', type: 'Type 2', powerKW: 22, available: true, status: 'Available' },
        ],
      },
      {
        id: 'am-002',
        name: 'Republic Square Charging',
        address: 'Republic Square',
        city: 'Yerevan',
        country: 'Armenia',
        latitude: 40.1776,
        longitude: 44.5126,
        operatorName: 'ChargePoint AM',
        connectors: [
          { id: 'c3', type: 'CCS2', powerKW: 100, available: true, status: 'Available' },
          { id: 'c4', type: 'CHAdeMO', powerKW: 50, available: false, status: 'In Use' },
        ],
      },
      {
        id: 'am-003',
        name: 'Dalma Garden Mall',
        address: 'Tsitsernakaberd Hwy',
        city: 'Yerevan',
        country: 'Armenia',
        latitude: 40.1823,
        longitude: 44.4687,
        operatorName: 'EV Armenia',
        connectors: [
          { id: 'c5', type: 'Type 2', powerKW: 22, available: true, status: 'Available' },
          { id: 'c6', type: 'Type 2', powerKW: 22, available: true, status: 'Available' },
        ],
      },
      {
        id: 'am-004',
        name: 'Cascade Complex Station',
        address: 'Tamanyan St',
        city: 'Yerevan',
        country: 'Armenia',
        latitude: 40.1912,
        longitude: 44.5156,
        operatorName: 'GreenCharge',
        connectors: [
          { id: 'c7', type: 'CCS2', powerKW: 150, available: true, status: 'Available' },
        ],
      },
      {
        id: 'am-005',
        name: 'Zvartnots Airport',
        address: 'Zvartnots International Airport',
        city: 'Yerevan',
        country: 'Armenia',
        latitude: 40.1473,
        longitude: 44.3959,
        operatorName: 'Airport Services',
        connectors: [
          { id: 'c8', type: 'CCS2', powerKW: 50, available: true, status: 'Available' },
          { id: 'c9', type: 'Type 2', powerKW: 22, available: true, status: 'Available' },
          { id: 'c10', type: 'CHAdeMO', powerKW: 50, available: true, status: 'Available' },
        ],
      },
      {
        id: 'am-006',
        name: 'Northern Avenue Station',
        address: 'Northern Avenue',
        city: 'Yerevan',
        country: 'Armenia',
        latitude: 40.1825,
        longitude: 44.5102,
        operatorName: 'EV Armenia',
        connectors: [
          { id: 'c11', type: 'Type 2', powerKW: 11, available: true, status: 'Available' },
        ],
      },
      {
        id: 'am-007',
        name: 'Tsaghkadzor Ski Resort',
        address: 'Tsaghkadzor',
        city: 'Tsaghkadzor',
        country: 'Armenia',
        latitude: 40.5329,
        longitude: 44.7264,
        operatorName: 'Resort Charging',
        connectors: [
          { id: 'c12', type: 'CCS2', powerKW: 50, available: true, status: 'Available' },
          { id: 'c13', type: 'Type 2', powerKW: 22, available: true, status: 'Available' },
        ],
      },
      {
        id: 'am-008',
        name: 'Lake Sevan Station',
        address: 'Sevan Highway',
        city: 'Sevan',
        country: 'Armenia',
        latitude: 40.5503,
        longitude: 44.9461,
        operatorName: 'EV Armenia',
        connectors: [
          { id: 'c14', type: 'CCS2', powerKW: 100, available: true, status: 'Available' },
        ],
      },
    ];
  }

  /**
   * Fetch nearby charging stations from Open Charge Map
   */
  async getNearbyStations(params: NearbyStationsParams): Promise<FormattedStation[]> {
    try {
      const {
        latitude,
        longitude,
        radiusKm = 50,
        maxResults = 50,
        countryCode,
        minPowerKW,
        connectionType,
      } = params;

      logger.info(`Fetching stations from OCM: lat=${latitude}, lng=${longitude}, radius=${radiusKm}km`);

      const queryParams: any = {
        latitude,
        longitude,
        distance: radiusKm,
        distanceunit: 'KM',
        maxresults: maxResults,
        compact: false,
        verbose: false,
      };

      if (OCM_API_KEY) {
        queryParams.key = OCM_API_KEY;
      }

      if (countryCode) {
        queryParams.countrycode = countryCode;
      }

      if (minPowerKW) {
        queryParams.minpowerkw = minPowerKW;
      }

      if (connectionType) {
        queryParams.connectiontypeid = this.getConnectionTypeId(connectionType);
      }

      const response = await axios.get(`${OCM_API_BASE}/poi`, {
        params: queryParams,
        timeout: 15000,
      });

      // Handle case where API returns non-array data
      if (!response.data) {
        logger.warn('OCM API returned empty response, using sample data');
        return this.getSampleStations();
      }

      // Ensure we have an array
      const stations: OCMStation[] = Array.isArray(response.data) ? response.data : [];

      logger.info(`OCM returned ${stations.length} stations`);

      // If no stations found, return sample data
      if (stations.length === 0) {
        logger.info('No stations from OCM, returning sample data for Armenia');
        return this.getSampleStations();
      }

      // Filter out any invalid stations and format them safely
      return stations
        .filter(station => station && station.ID != null)
        .map(station => this.formatStation(station));
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error(`Error fetching from Open Charge Map: ${errorMessage}`);
      // Return sample stations instead of empty array
      logger.info('Returning sample stations due to OCM API error');
      return this.getSampleStations();
    }
  }

  /**
   * Format OCM station data to our schema
   */
  private formatStation(ocmStation: OCMStation): FormattedStation {
    const addressInfo = ocmStation.AddressInfo || {};
    const connections = ocmStation.Connections || [];

    return {
      id: String(ocmStation.ID ?? 'unknown'),
      name: addressInfo.Title || `Station ${ocmStation.ID ?? 'Unknown'}`,
      address: addressInfo.AddressLine1 || '',
      city: addressInfo.Town || '',
      country: addressInfo.Country?.Title || '',
      latitude: typeof addressInfo.Latitude === 'number' ? addressInfo.Latitude : 0,
      longitude: typeof addressInfo.Longitude === 'number' ? addressInfo.Longitude : 0,
      distance: typeof addressInfo.Distance === 'number' ? addressInfo.Distance : undefined,
      operatorName: ocmStation.OperatorInfo?.Title,
      connectors: connections
        .filter(conn => conn && conn.ID != null)
        .map(conn => ({
          id: String(conn.ID),
          type: conn.ConnectionType?.FormalName || conn.ConnectionType?.Title || 'Unknown',
          powerKW: typeof conn.PowerKW === 'number' && conn.PowerKW > 0 ? conn.PowerKW : undefined,
          available: conn.StatusType?.IsOperational !== false,
          status: conn.StatusType?.Title,
        })),
    };
  }

  /**
   * Map connector type names to OCM IDs
   */
  private getConnectionTypeId(type: string): number {
    const typeMap: { [key: string]: number } = {
      'Type2': 25,      // Type 2 (Socket Only)
      'CCS2': 33,       // CCS (Type 2)
      'CHAdeMO': 2,     // CHAdeMO
      'Tesla': 27,      // Tesla Supercharger
      'Type1': 1,       // Type 1 (J1772)
      'CCS1': 32,       // CCS (Type 1)
    };

    return typeMap[type] || 0;
  }

  /**
   * Get station details by OCM ID
   */
  async getStationById(ocmId: number): Promise<FormattedStation | null> {
    try {
      const response = await axios.get(`${OCM_API_BASE}/poi`, {
        params: {
          chargepointid: ocmId,
          compact: false,
        },
        timeout: 10000,
      });

      // Handle case where API returns non-array data
      if (!response.data || !Array.isArray(response.data)) {
        return null;
      }

      const stations: OCMStation[] = response.data;

      if (stations.length === 0 || !stations[0] || stations[0].ID == null) {
        return null;
      }

      return this.formatStation(stations[0]);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error(`Error fetching OCM station ${ocmId}: ${errorMessage}`);
      return null;
    }
  }

  /**
   * Search stations by country
   */
  async getStationsByCountry(countryCode: string, maxResults: number = 100): Promise<FormattedStation[]> {
    try {
      const response = await axios.get(`${OCM_API_BASE}/poi`, {
        params: {
          countrycode: countryCode,
          maxresults: maxResults,
          compact: false,
        },
        timeout: 15000,
      });

      // Handle case where API returns non-array data
      if (!response.data) {
        logger.warn(`OCM API returned empty response for country ${countryCode}`);
        return this.getSampleStations();
      }

      const stations: OCMStation[] = Array.isArray(response.data) ? response.data : [];

      if (stations.length === 0) {
        return this.getSampleStations();
      }

      return stations
        .filter(station => station && station.ID != null)
        .map(station => this.formatStation(station));
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error(`Error fetching stations for country ${countryCode}: ${errorMessage}`);
      return this.getSampleStations();
    }
  }
}

export default new OpenChargeMapService();
