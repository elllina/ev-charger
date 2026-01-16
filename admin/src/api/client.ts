import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API functions for admin panel
export const api = {
  // Health check
  getHealth: () => apiClient.get('/health'),

  // OCPP Charge Points
  getChargePoints: () => apiClient.get('/ocpp/chargepoints'),
  getChargePointStatus: (id: string) => apiClient.get(`/ocpp/chargepoints/${id}/status`),
  startCharging: (id: string, connectorId: number = 1, idTag: string = 'admin') =>
    apiClient.post(`/ocpp/chargepoints/${id}/start`, { connectorId, idTag }),
  stopCharging: (id: string, transactionId: number) =>
    apiClient.post(`/ocpp/chargepoints/${id}/stop`, { transactionId }),

  // Sessions
  getActiveSessions: () => apiClient.get('/sessions/active'),
  getSessionHistory: () => apiClient.get('/sessions/history'),

  // Demo sessions (from frontend charging)
  getDemoSessions: () => apiClient.get('/demo/sessions'),
  getDemoSessionStats: () => apiClient.get('/demo/sessions/stats'),
  getActiveDemoSessions: () => apiClient.get('/demo/sessions/active'),

  // Stations (OCM)
  getNearbyStations: (lat: number, lng: number, radius: number = 50) =>
    apiClient.get('/ocm/nearby', { params: { lat, lng, radius } }),

  // Networks
  getNetworks: () => apiClient.get('/networks'),

  // Users (placeholder - would need backend endpoint)
  getUsers: async () => {
    // Mock data for now
    return {
      data: [
        { id: 1, email: 'admin@evcharger.am', name: 'Admin User', role: 'admin', createdAt: new Date().toISOString() },
        { id: 2, email: 'user@example.com', name: 'Test User', role: 'user', createdAt: new Date().toISOString() },
      ]
    };
  },

  // Dashboard stats
  getDashboardStats: async () => {
    try {
      const [chargePointsRes, healthRes, demoStatsRes] = await Promise.all([
        apiClient.get('/ocpp/chargepoints'),
        apiClient.get('/health'),
        apiClient.get('/demo/sessions/stats').catch(() => ({ data: { stats: {} } })),
      ]);

      // Handle response structure: { success, chargePoints: [...] }
      const chargePoints = Array.isArray(chargePointsRes.data)
        ? chargePointsRes.data
        : (chargePointsRes.data?.chargePoints || []);

      const activeChargePoints = chargePoints.filter((cp: { status: string; connected?: boolean }) =>
        cp.status === 'Available' || cp.status === 'Charging' || cp.connected
      );
      const ocppChargingSessions = chargePoints.filter((cp: { status: string }) => cp.status === 'Charging');

      // Include demo session stats
      const demoStats = demoStatsRes.data?.stats || {};

      return {
        totalStations: chargePoints.length + 8, // Include 8 sample stations
        activeStations: activeChargePoints.length,
        activeSessions: ocppChargingSessions.length + (demoStats.activeSessions || 0),
        totalRevenue: demoStats.totalRevenue || 0,
        totalEnergy: demoStats.totalEnergy || 0,
        serverStatus: healthRes.data?.status === 'ok' ? 'Online' : 'Offline',
        demoSessionsData: demoStats.activeSessionsData || [],
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return {
        totalStations: 8,
        activeStations: 0,
        activeSessions: 0,
        totalRevenue: 0,
        totalEnergy: 0,
        serverStatus: 'Offline',
        demoSessionsData: [],
      };
    }
  },
};

export default api;
