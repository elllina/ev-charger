import { Request, Response } from 'express';
import OpenChargeMapService from '../services/OpenChargeMapService';
import { AppError } from '../middleware/errorHandler';

/**
 * Controller for Open Charge Map integration
 */
export class OCMController {
  /**
   * Get nearby charging stations from Open Charge Map
   * GET /api/v1/ocm/nearby?latitude=40.1872&longitude=44.5152&radius=10
   */
  async getNearbyStations(req: Request, res: Response): Promise<void> {
    try {
      const { latitude, longitude, lat, lng, radius, maxResults, countryCode, minPowerKW, connectionType } = req.query;

      // Support both lat/lng and latitude/longitude formats
      const latParam = latitude || lat;
      const lngParam = longitude || lng;

      // Validate required parameters
      if (!latParam || !lngParam) {
        throw new AppError('Latitude and longitude are required', 400);
      }

      const latitudeValue = parseFloat(latParam as string);
      const longitudeValue = parseFloat(lngParam as string);

      if (isNaN(latitudeValue) || isNaN(longitudeValue)) {
        throw new AppError('Invalid latitude or longitude', 400);
      }

      // Validate ranges
      if (latitudeValue < -90 || latitudeValue > 90) {
        throw new AppError('Latitude must be between -90 and 90', 400);
      }

      if (longitudeValue < -180 || longitudeValue > 180) {
        throw new AppError('Longitude must be between -180 and 180', 400);
      }

      const stations = await OpenChargeMapService.getNearbyStations({
        latitude: latitudeValue,
        longitude: longitudeValue,
        radiusKm: radius ? parseFloat(radius as string) : 10,
        maxResults: maxResults ? parseInt(maxResults as string) : 50,
        countryCode: countryCode as string,
        minPowerKW: minPowerKW ? parseFloat(minPowerKW as string) : undefined,
        connectionType: connectionType as string,
      });

      res.json({
        success: true,
        count: stations.length,
        source: 'Open Charge Map',
        query: {
          latitude: latitudeValue,
          longitude: longitudeValue,
          radius: radius ? parseFloat(radius as string) : 10,
        },
        stations,
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get station details by OCM ID
   * GET /api/v1/ocm/station/:id
   */
  async getStationById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const ocmId = parseInt(id);

      if (isNaN(ocmId)) {
        throw new AppError('Invalid station ID', 400);
      }

      const station = await OpenChargeMapService.getStationById(ocmId);

      if (!station) {
        throw new AppError('Station not found', 404);
      }

      res.json({
        success: true,
        source: 'Open Charge Map',
        station,
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get stations by country
   * GET /api/v1/ocm/country/:code
   */
  async getStationsByCountry(req: Request, res: Response): Promise<void> {
    try {
      const { code } = req.params;
      const { maxResults } = req.query;

      if (!code || code.length !== 2) {
        throw new AppError('Valid country code is required (e.g., AM, GE, TR)', 400);
      }

      const stations = await OpenChargeMapService.getStationsByCountry(
        code.toUpperCase(),
        maxResults ? parseInt(maxResults as string) : 100
      );

      res.json({
        success: true,
        count: stations.length,
        source: 'Open Charge Map',
        country: code.toUpperCase(),
        stations,
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get API info and statistics
   * GET /api/v1/ocm/info
   */
  async getInfo(req: Request, res: Response): Promise<void> {
    res.json({
      success: true,
      service: 'Open Charge Map',
      description: 'Global public registry of electric vehicle charging locations',
      website: 'https://openchargemap.org',
      apiDocs: 'https://openchargemap.org/site/develop/api',
      coverage: 'Worldwide (500,000+ charging locations)',
      supportedCountries: {
        armenia: 'AM',
        georgia: 'GE',
        turkey: 'TR',
        russia: 'RU',
      },
      connectorTypes: {
        Type2: 25,
        CCS2: 33,
        CHAdeMO: 2,
        Tesla: 27,
        Type1: 1,
        CCS1: 32,
      },
    });
  }
}

export default new OCMController();
