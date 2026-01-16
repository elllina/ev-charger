import { Router, Request, Response } from 'express';
import { body, param, query } from 'express-validator';
import { validate } from '../middleware/validation';
import { ChargingStation } from '../models/ChargingStation';
import { ChargingNetwork } from '../models/ChargingNetwork';
import { Connector } from '../models/Connector';
import { getOCPPServer } from '../ocpp/OCPPServer';

const router = Router();

/**
 * Get all stations with OCPP connection status
 */
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const stations = await ChargingStation.findAll({
      include: [
        { model: ChargingNetwork, as: 'network' },
        { model: Connector, as: 'connectors' }
      ],
      order: [['createdAt', 'DESC']]
    });

    const ocppServer = getOCPPServer();
    const connectedChargePoints = ocppServer?.getConnectedChargePoints() || [];

    // Enrich stations with real-time OCPP connection status
    const enrichedStations = stations.map(station => {
      const stationJson = station.toJSON();
      // Check if OCPP charge point is currently connected
      if (stationJson.ocppChargePointId) {
        stationJson.ocppConnected = connectedChargePoints.includes(stationJson.ocppChargePointId);
      }
      return stationJson;
    });

    res.json({
      success: true,
      count: enrichedStations.length,
      stations: enrichedStations
    });
  } catch (error: any) {
    console.error('Error fetching stations:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Get unlinked OCPP charge points (not associated with any station)
 */
router.get('/unlinked-chargepoints', async (req: Request, res: Response): Promise<void> => {
  try {
    const ocppServer = getOCPPServer();
    if (!ocppServer) {
      res.json({ success: true, chargePoints: [] });
      return;
    }

    const allChargePoints = ocppServer.getConnectedChargePointsWithInfo();

    // Find stations that have OCPP charge point IDs
    const linkedStations = await ChargingStation.findAll({
      where: { ocppChargePointId: { [require('sequelize').Op.ne]: null } },
      attributes: ['ocppChargePointId']
    });

    const linkedIds = linkedStations.map(s => s.ocppChargePointId);

    // Filter to only unlinked charge points
    const unlinkedChargePoints = allChargePoints.filter(
      cp => !linkedIds.includes(cp.chargePointId)
    );

    res.json({
      success: true,
      chargePoints: unlinkedChargePoints
    });
  } catch (error: any) {
    console.error('Error fetching unlinked charge points:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Create a new station
 */
router.post('/',
  validate([
    body('name').notEmpty().withMessage('Name is required'),
    body('address').notEmpty().withMessage('Address is required'),
    body('city').notEmpty().withMessage('City is required'),
    body('latitude').isFloat({ min: -90, max: 90 }).withMessage('Valid latitude required'),
    body('longitude').isFloat({ min: -180, max: 180 }).withMessage('Valid longitude required'),
    body('networkId').isUUID().withMessage('Valid network ID required'),
  ]),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const {
        name, address, city, latitude, longitude, networkId,
        externalId, isPublic, is24Hours, amenities, description,
        accessInstructions, openingHours, ocppChargePointId
      } = req.body;

      // Verify network exists
      const network = await ChargingNetwork.findByPk(networkId);
      if (!network) {
        res.status(404).json({ success: false, error: 'Network not found' });
        return;
      }

      const station = await ChargingStation.create({
        name,
        address,
        city,
        latitude,
        longitude,
        networkId,
        externalId: externalId || `station-${Date.now()}`,
        isPublic: isPublic ?? true,
        is24Hours: is24Hours ?? false,
        amenities: amenities || [],
        description,
        accessInstructions,
        openingHours,
        ocppChargePointId,
        status: 'active'
      });

      res.status(201).json({
        success: true,
        station
      });
    } catch (error: any) {
      console.error('Error creating station:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }
);

/**
 * Update a station
 */
router.put('/:id',
  validate([
    param('id').isUUID().withMessage('Valid station ID required'),
  ]),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const station = await ChargingStation.findByPk(id);

      if (!station) {
        res.status(404).json({ success: false, error: 'Station not found' });
        return;
      }

      const {
        name, address, city, latitude, longitude, networkId,
        externalId, isPublic, is24Hours, amenities, description,
        accessInstructions, openingHours, status, ocppChargePointId
      } = req.body;

      await station.update({
        ...(name !== undefined && { name }),
        ...(address !== undefined && { address }),
        ...(city !== undefined && { city }),
        ...(latitude !== undefined && { latitude }),
        ...(longitude !== undefined && { longitude }),
        ...(networkId !== undefined && { networkId }),
        ...(externalId !== undefined && { externalId }),
        ...(isPublic !== undefined && { isPublic }),
        ...(is24Hours !== undefined && { is24Hours }),
        ...(amenities !== undefined && { amenities }),
        ...(description !== undefined && { description }),
        ...(accessInstructions !== undefined && { accessInstructions }),
        ...(openingHours !== undefined && { openingHours }),
        ...(status !== undefined && { status }),
        ...(ocppChargePointId !== undefined && { ocppChargePointId })
      });

      res.json({
        success: true,
        station
      });
    } catch (error: any) {
      console.error('Error updating station:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }
);

/**
 * Link an OCPP charge point to a station
 */
router.post('/:id/link-chargepoint',
  validate([
    param('id').isUUID().withMessage('Valid station ID required'),
    body('chargePointId').notEmpty().withMessage('Charge point ID required'),
  ]),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { chargePointId } = req.body;

      const station = await ChargingStation.findByPk(id);
      if (!station) {
        res.status(404).json({ success: false, error: 'Station not found' });
        return;
      }

      // Check if charge point is already linked to another station
      const existingLink = await ChargingStation.findOne({
        where: { ocppChargePointId: chargePointId }
      });

      if (existingLink && existingLink.id !== id) {
        res.status(409).json({
          success: false,
          error: `Charge point already linked to station: ${existingLink.name}`
        });
        return;
      }

      // Get charge point info from OCPP server
      const ocppServer = getOCPPServer();
      const cpInfo = ocppServer?.getChargePointInfo(chargePointId);

      await station.update({
        ocppChargePointId: chargePointId,
        ocppConnected: ocppServer?.isChargePointConnected(chargePointId) || false,
        ocppLastSeen: new Date(),
        ...(cpInfo && {
          ocppVendor: cpInfo.vendor,
          ocppModel: cpInfo.model,
          ocppFirmwareVersion: cpInfo.firmwareVersion
        })
      });

      res.json({
        success: true,
        message: `Charge point ${chargePointId} linked to station ${station.name}`,
        station
      });
    } catch (error: any) {
      console.error('Error linking charge point:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }
);

/**
 * Unlink an OCPP charge point from a station
 */
router.post('/:id/unlink-chargepoint',
  validate([
    param('id').isUUID().withMessage('Valid station ID required'),
  ]),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const station = await ChargingStation.findByPk(id);
      if (!station) {
        res.status(404).json({ success: false, error: 'Station not found' });
        return;
      }

      await station.update({
        ocppChargePointId: null,
        ocppConnected: false,
        ocppVendor: null,
        ocppModel: null,
        ocppFirmwareVersion: null
      });

      res.json({
        success: true,
        message: `Charge point unlinked from station ${station.name}`,
        station
      });
    } catch (error: any) {
      console.error('Error unlinking charge point:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }
);

/**
 * Delete a station
 */
router.delete('/:id',
  validate([
    param('id').isUUID().withMessage('Valid station ID required'),
  ]),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const station = await ChargingStation.findByPk(id);
      if (!station) {
        res.status(404).json({ success: false, error: 'Station not found' });
        return;
      }

      // Delete associated connectors first
      await Connector.destroy({ where: { stationId: id } });
      await station.destroy();

      res.json({
        success: true,
        message: 'Station deleted successfully'
      });
    } catch (error: any) {
      console.error('Error deleting station:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }
);

/**
 * Add a connector to a station
 */
router.post('/:id/connectors',
  validate([
    param('id').isUUID().withMessage('Valid station ID required'),
    body('connectorType').isIn(['Type2', 'CCS2', 'CHAdeMO', 'GBT']).withMessage('Valid connector type required'),
    body('powerKw').isFloat({ min: 1 }).withMessage('Power (kW) required'),
    body('currentType').isIn(['AC', 'DC']).withMessage('Current type (AC/DC) required'),
    body('pricePerKwh').isFloat({ min: 0 }).withMessage('Price per kWh required'),
  ]),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const {
        connectorType, powerKw, currentType, pricePerKwh,
        pricePerMinute, startFee, connectorNumber, externalId
      } = req.body;

      const station = await ChargingStation.findByPk(id);
      if (!station) {
        res.status(404).json({ success: false, error: 'Station not found' });
        return;
      }

      // Get next connector number if not provided
      let nextNumber = connectorNumber;
      if (!nextNumber) {
        const existingConnectors = await Connector.count({ where: { stationId: id } });
        nextNumber = existingConnectors + 1;
      }

      const connector = await Connector.create({
        stationId: id,
        externalId: externalId || `conn-${Date.now()}`,
        connectorType,
        powerKw,
        currentType,
        pricePerKwh,
        pricePerMinute,
        startFee,
        connectorNumber: nextNumber,
        status: 'available'
      });

      res.status(201).json({
        success: true,
        connector
      });
    } catch (error: any) {
      console.error('Error adding connector:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }
);

/**
 * Get networks for dropdown
 */
router.get('/networks', async (req: Request, res: Response): Promise<void> => {
  try {
    const networks = await ChargingNetwork.findAll({
      where: { status: 'active' },
      order: [['name', 'ASC']]
    });

    res.json({
      success: true,
      networks
    });
  } catch (error: any) {
    console.error('Error fetching networks:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
