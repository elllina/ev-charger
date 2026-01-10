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
  ocmId: number;
  name: string;
  address: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  distance: number;
  operator: string | null;
  numberOfConnectors: number;
  isOperational: boolean;
  connectors: Array<{
    id: number;
    type: string;
    powerKw: number;
    currentType: string;
    status: string;
    isAvailable: boolean;
  }>;
}

export class OpenChargeMapService {
  /**
   * Fetch nearby charging stations from Open Charge Map
   */
  async getNearbyStations(params: NearbyStationsParams): Promise<FormattedStation[]> {
    try {
      const {
        latitude,
        longitude,
        radiusKm = 10,
        maxResults = 50,
        countryCode = 'AM', // Default to Armenia
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
        timeout: 10000,
      });

      const stations: OCMStation[] = response.data;

      logger.info(`OCM returned ${stations.length} stations`);

      return stations.map(station => this.formatStation(station));
    } catch (error) {
      logger.error('Error fetching from Open Charge Map:', error);
      throw new Error('Failed to fetch charging stations from Open Charge Map');
    }
  }

  /**
   * Format OCM station data to our schema
   */
  private formatStation(ocmStation: OCMStation): FormattedStation {
    return {
      ocmId: ocmStation.ID,
      name: ocmStation.AddressInfo.Title || `Station ${ocmStation.ID}`,
      address: ocmStation.AddressInfo.AddressLine1 || '',
      city: ocmStation.AddressInfo.Town || '',
      country: ocmStation.AddressInfo.Country.Title,
      latitude: ocmStation.AddressInfo.Latitude,
      longitude: ocmStation.AddressInfo.Longitude,
      distance: ocmStation.AddressInfo.Distance || 0,
      operator: ocmStation.OperatorInfo?.Title || null,
      numberOfConnectors: ocmStation.NumberOfPoints || 0,
      isOperational: ocmStation.StatusType?.IsOperational !== false,
      connectors: (ocmStation.Connections || []).map(conn => ({
        id: conn.ID,
        type: conn.ConnectionType?.FormalName || conn.ConnectionType?.Title || 'Unknown',
        powerKw: conn.PowerKW || 0,
        currentType: conn.CurrentType?.Title || 'Unknown',
        status: conn.StatusType?.Title || 'Unknown',
        isAvailable: conn.StatusType?.IsOperational !== false,
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
        timeout: 5000,
      });

      const stations: OCMStation[] = response.data;

      if (stations.length === 0) {
        return null;
      }

      return this.formatStation(stations[0]);
    } catch (error) {
      logger.error(`Error fetching OCM station ${ocmId}:`, error);
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

      const stations: OCMStation[] = response.data;
      return stations.map(station => this.formatStation(station));
    } catch (error) {
      logger.error(`Error fetching stations for country ${countryCode}:`, error);
      throw new Error('Failed to fetch stations by country');
    }
  }
}

export default new OpenChargeMapService();
