import { Request, Response } from 'express';
import StationService from '../services/StationService';
import { AppError } from '../middleware/errorHandler';
import { Favorite } from '../models/Favorite';
import { AuthRequest } from '../middleware/auth';

export class StationController {
  /**
   * Get nearby stations
   */
  async getNearbyStations(req: Request, res: Response): Promise<void> {
    try {
      const {
        lat,
        lng,
        radius = 10,
        network,
        connectorType,
        minPower,
        available,
        is24Hours,
        amenities,
      } = req.query;

      if (!lat || !lng) {
        throw new AppError('Latitude and longitude are required', 400);
      }

      const latitude = parseFloat(lat as string);
      const longitude = parseFloat(lng as string);
      const radiusKm = parseFloat(radius as string);

      // Build filters
      const filters: any = {};
      if (network) filters.network = (network as string).split(',');
      if (connectorType) filters.connectorType = (connectorType as string).split(',');
      if (minPower) filters.minPower = parseFloat(minPower as string);
      if (available) filters.available = available === 'true';
      if (is24Hours) filters.is24Hours = is24Hours === 'true';
      if (amenities) filters.amenities = (amenities as string).split(',');

      const stations = await StationService.findNearby(latitude, longitude, radiusKm, filters);

      res.json({
        count: stations.length,
        stations,
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get station by ID
   */
  async getStation(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const station = await StationService.getStationWithConnectors(id);

      if (!station) {
        throw new AppError('Station not found', 404);
      }

      res.json(station);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get station connectors
   */
  async getStationConnectors(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const station = await StationService.getStationWithConnectors(id);

      if (!station) {
        throw new AppError('Station not found', 404);
      }

      res.json({
        stationId: station.id,
        connectors: station.connectors || [],
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get all charging networks
   */
  async getNetworks(req: Request, res: Response): Promise<void> {
    try {
      const networks = await StationService.getNetworks();

      res.json({
        count: networks.length,
        networks,
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get network by slug
   */
  async getNetwork(req: Request, res: Response): Promise<void> {
    try {
      const { slug } = req.params;

      const network = await StationService.getNetworkBySlug(slug);

      if (!network) {
        throw new AppError('Network not found', 404);
      }

      res.json(network);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get user's favorite stations
   */
  async getFavorites(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.userId!;

      const favorites = await Favorite.findAll({
        where: { userId },
        include: [
          {
            association: 'station',
            include: ['network', 'connectors'],
          },
        ],
      });

      res.json({
        count: favorites.length,
        favorites: favorites.map((f) => f.station),
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Add station to favorites
   */
  async addFavorite(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.userId!;
      const { stationId } = req.body;

      if (!stationId) {
        throw new AppError('Station ID is required', 400);
      }

      // Check if already favorited
      const existing = await Favorite.findOne({
        where: { userId, stationId },
      });

      if (existing) {
        throw new AppError('Station already in favorites', 409);
      }

      // Check if station exists
      const station = await StationService.getStationWithConnectors(stationId);
      if (!station) {
        throw new AppError('Station not found', 404);
      }

      const favorite = await Favorite.create({
        userId,
        stationId,
      });

      res.status(201).json({
        message: 'Station added to favorites',
        favorite,
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Remove station from favorites
   */
  async removeFavorite(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.userId!;
      const { stationId } = req.params;

      const favorite = await Favorite.findOne({
        where: { userId, stationId },
      });

      if (!favorite) {
        throw new AppError('Favorite not found', 404);
      }

      await favorite.destroy();

      res.json({
        message: 'Station removed from favorites',
      });
    } catch (error) {
      throw error;
    }
  }
}

export default new StationController();
