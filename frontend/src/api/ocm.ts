import { apiClient } from './client';
import type { Station, NearbyStationsParams } from '../types';

/**
 * Open Charge Map API service
 */
export const ocmApi = {
  /**
   * Get information about OCM service
   */
  getInfo: async () => {
    const response = await apiClient.get('/ocm/info');
    return response.data;
  },

  /**
   * Get nearby charging stations
   */
  getNearbyStations: async (params: NearbyStationsParams): Promise<Station[]> => {
    const response = await apiClient.get('/ocm/nearby', { params });
    return response.data.stations || [];
  },

  /**
   * Search stations by country
   */
  getStationsByCountry: async (countryCode: string, maxResults: number = 50): Promise<Station[]> => {
    const response = await apiClient.get(`/ocm/country/${countryCode}`, {
      params: { maxResults },
    });
    return response.data.stations || [];
  },

  /**
   * Get station details by ID
   */
  getStationById: async (id: string): Promise<Station> => {
    const response = await apiClient.get(`/ocm/station/${id}`);
    return response.data.station;
  },
};
