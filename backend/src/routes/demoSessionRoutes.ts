import { Router, Request, Response } from 'express';

const router = Router();

// In-memory storage for demo sessions
interface DemoSession {
  id: string;
  stationId: string;
  stationName: string;
  connectorId: string;
  connectorType: string;
  powerKW: number;
  startTime: string;
  energyKwh: number;
  currentPowerKw: number;
  duration: string;
  cost: number;
  status: 'charging' | 'completed' | 'stopped';
}

let demoSessions: DemoSession[] = [];

/**
 * Demo Sessions Routes (no auth required)
 * Base: /api/v1/demo/sessions
 */

// Get all demo sessions
router.get('/', (req: Request, res: Response) => {
  const status = req.query.status as string;

  let sessions = demoSessions;
  if (status) {
    sessions = demoSessions.filter(s => s.status === status);
  }

  // Calculate stats
  const activeSessions = demoSessions.filter(s => s.status === 'charging');
  const completedSessions = demoSessions.filter(s => s.status === 'completed');
  const totalEnergy = demoSessions.reduce((sum, s) => sum + s.energyKwh, 0);
  const totalRevenue = demoSessions.reduce((sum, s) => sum + s.cost, 0);

  res.json({
    success: true,
    sessions,
    stats: {
      total: demoSessions.length,
      active: activeSessions.length,
      completed: completedSessions.length,
      totalEnergy: Math.round(totalEnergy * 100) / 100,
      totalRevenue,
    },
  });
});

// Get active sessions only
router.get('/active', (req: Request, res: Response) => {
  const activeSessions = demoSessions.filter(s => s.status === 'charging');
  res.json({
    success: true,
    sessions: activeSessions,
    count: activeSessions.length,
  });
});

// Create or update a demo session
router.post('/', (req: Request, res: Response): void => {
  const session: DemoSession = req.body;

  if (!session.id) {
    res.status(400).json({ success: false, error: 'Session ID required' });
    return;
  }

  // Check if session exists
  const existingIndex = demoSessions.findIndex(s => s.id === session.id);

  if (existingIndex !== -1) {
    // Update existing session
    demoSessions[existingIndex] = { ...demoSessions[existingIndex], ...session };
  } else {
    // Add new session
    demoSessions.push(session);
  }

  res.json({ success: true, session });
});

// Update a session
router.put('/:id', (req: Request, res: Response): void => {
  const { id } = req.params;
  const updates = req.body;

  const index = demoSessions.findIndex(s => s.id === id);

  if (index === -1) {
    res.status(404).json({ success: false, error: 'Session not found' });
    return;
  }

  demoSessions[index] = { ...demoSessions[index], ...updates };
  res.json({ success: true, session: demoSessions[index] });
});

// Delete a session
router.delete('/:id', (req: Request, res: Response): void => {
  const { id } = req.params;

  const index = demoSessions.findIndex(s => s.id === id);

  if (index === -1) {
    res.status(404).json({ success: false, error: 'Session not found' });
    return;
  }

  const deleted = demoSessions.splice(index, 1);
  res.json({ success: true, session: deleted[0] });
});

// Clear all sessions
router.delete('/', (req: Request, res: Response) => {
  demoSessions = [];
  res.json({ success: true, message: 'All sessions cleared' });
});

// Get dashboard stats
router.get('/stats', (req: Request, res: Response) => {
  const activeSessions = demoSessions.filter(s => s.status === 'charging');
  const completedSessions = demoSessions.filter(s => s.status === 'completed');
  const totalEnergy = demoSessions.reduce((sum, s) => sum + s.energyKwh, 0);
  const totalRevenue = demoSessions.reduce((sum, s) => sum + s.cost, 0);

  res.json({
    success: true,
    stats: {
      totalSessions: demoSessions.length,
      activeSessions: activeSessions.length,
      completedSessions: completedSessions.length,
      totalEnergy: Math.round(totalEnergy * 100) / 100,
      totalRevenue,
      activeSessionsData: activeSessions,
    },
  });
});

export default router;
