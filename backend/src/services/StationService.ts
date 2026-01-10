import { Op, Sequelize } from 'sequelize';
import { ChargingStation } from '../models/ChargingStation';
import { Connector } from '../models/Connector';
import { ChargingNetwork } from '../models/ChargingNetwork';
import { calculateDistance } from '../utils/helpers';
import { cacheGet, cacheSet, CACHE_KEYS, CACHE_TTL } from '../config/redis';
import { logger } from '../config/logger';

export interface StationFilters {
  network?: string[];
  connectorType?: string[];
  minPower?: number;
  available?: boolean;
  is24Hours?: boolean;
  amenities?: string[];
}

export interface StationWithConnectors extends ChargingStation {
  connectors: Connector[];
  network: ChargingNetwork;
  distance?: number;
}

export class StationService {
  /**
   * Find charging stations within a radius
   */
  async findNearby(
    lat: number,
    lng: number,
    radiusKm: number = 10,
    filters?: StationFilters
  ): Promise<StationWithConnectors[]> {
    try {
      // Check cache first
      const cacheKey = CACHE_KEYS.stationsNearby(lat, lng, radiusKm);
      const cached = await cacheGet<StationWithConnectors[]>(cacheKey);

      if (cached && !filters) {
        logger.info('Returning cached stations');
        return cached;
      }

      // Build where clause
      const where: any = {
        status: 'active',
      };

      // Calculate bounding box for more efficient query
      // Approximate: 1 degree latitude ≈ 111 km
      const latDelta = radiusKm / 111;
      const lngDelta = radiusKm / (111 * Math.cos((lat * Math.PI) / 180));

      where.latitude = {
        [Op.between]: [lat - latDelta, lat + latDelta],
      };
      where.longitude = {
        [Op.between]: [lng - lngDelta, lng + lngDelta],
      };

      // Fetch stations with connectors
      let stations = await ChargingStation.findAll({
        where,
        include: [
          {
            model: Connector,
            as: 'connectors',
            required: filters?.available || filters?.connectorType || filters?.minPower ? true : false,
            where: this.buildConnectorFilters(filters),
          },
          {
            model: ChargingNetwork,
            as: 'network',
            where: filters?.network
              ? { slug: { [Op.in]: filters.network } }
              : undefined,
          },
        ],
      });

      // Calculate actual distance and filter by radius
      const stationsWithDistance = stations
        .map((station) => {
          const distance = calculateDistance(lat, lng, station.latitude, station.longitude);
          return {
            ...station.toJSON(),
            distance,
          } as StationWithConnectors;
        })
        .filter((station) => station.distance! <= radiusKm);

      // Apply additional filters
      let filteredStations = stationsWithDistance;

      if (filters?.is24Hours) {
        filteredStations = filteredStations.filter((s) => s.is24Hours);
      }

      if (filters?.amenities && filters.amenities.length > 0) {
        filteredStations = filteredStations.filter((s) =>
          filters.amenities!.some((amenity) => s.amenities?.includes(amenity))
        );
      }

      // Sort by distance
      filteredStations.sort((a, b) => (a.distance || 0) - (b.distance || 0));

      // Cache results if no filters applied
      if (!filters) {
        await cacheSet(cacheKey, filteredStations, CACHE_TTL.stationsNearby);
      }

      return filteredStations;
    } catch (error) {
      logger.error('Error finding nearby stations:', error);
      throw error;
    }
  }

  /**
   * Get station by ID with connectors
   */
  async getStationWithConnectors(stationId: string): Promise<StationWithConnectors | null> {
    try {
      // Check cache
      const cacheKey = CACHE_KEYS.stationDetails(stationId);
      const cached = await cacheGet<StationWithConnectors>(cacheKey);

      if (cached) {
        return cached;
      }

      const station = await ChargingStation.findByPk(stationId, {
        include: [
          {
            model: Connector,
            as: 'connectors',
          },
          {
            model: ChargingNetwork,
            as: 'network',
          },
        ],
      });

      if (!station) {
        return null;
      }

      const stationData = station.toJSON() as StationWithConnectors;

      // Cache result
      await cacheSet(cacheKey, stationData, CACHE_TTL.stationDetails);

      return stationData;
    } catch (error) {
      logger.error('Error getting station:', error);
      throw error;
    }
  }

  /**
   * Get all available networks
   */
  async getNetworks(): Promise<ChargingNetwork[]> {
    return ChargingNetwork.findAll({
      where: {
        integrationStatus: 'active',
      },
      order: [['name', 'ASC']],
    });
  }

  /**
   * Get network by slug
   */
  async getNetworkBySlug(slug: string): Promise<ChargingNetwork | null> {
    return ChargingNetwork.findOne({
      where: { slug },
    });
  }

  /**
   * Sync stations from CPO (will be called by integration adapters)
   */
  async syncFromNetwork(networkId: string, stationsData: any[]): Promise<void> {
    logger.info(`Syncing ${stationsData.length} stations from network ${networkId}`);

    // This is a simplified version - in production, use bulk upsert
    for (const stationData of stationsData) {
      await ChargingStation.upsert({
        networkId,
        externalId: stationData.externalId,
        name: stationData.name,
        address: stationData.address,
        city: stationData.city,
        latitude: stationData.latitude,
        longitude: stationData.longitude,
        isPublic: stationData.isPublic ?? true,
        is24Hours: stationData.is24Hours ?? false,
        amenities: stationData.amenities,
        photos: stationData.photos,
        description: stationData.description,
      });
    }

    logger.info(`Successfully synced stations from network ${networkId}`);
  }

  /**
   * Build connector filters for query
   */
  private buildConnectorFilters(filters?: StationFilters): any {
    if (!filters) return undefined;

    const where: any = {};

    if (filters.available) {
      where.status = 'available';
    }

    if (filters.connectorType && filters.connectorType.length > 0) {
      where.connectorType = { [Op.in]: filters.connectorType };
    }

    if (filters.minPower) {
      where.powerKw = { [Op.gte]: filters.minPower };
    }

    return Object.keys(where).length > 0 ? where : undefined;
  }
}

export default new StationService();
