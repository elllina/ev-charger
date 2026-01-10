import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

export const redis = new Redis(redisUrl, {
  maxRetriesPerRequest: 3,
  retryStrategy(times: number) {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  reconnectOnError(err: Error) {
    const targetError = 'READONLY';
    if (err.message.includes(targetError)) {
      return true;
    }
    return false;
  },
});

redis.on('connect', () => {
  console.log('✅ Redis connected successfully');
});

redis.on('error', (err: Error) => {
  console.error('❌ Redis connection error:', err);
});

// Cache keys
export const CACHE_KEYS = {
  connectorStatus: (id: string) => `connector:${id}:status`,
  stationsNearby: (lat: number, lng: number, radius: number) =>
    `stations:${lat.toFixed(3)}:${lng.toFixed(3)}:${radius}`,
  userProfile: (id: string) => `user:${id}:profile`,
  stationDetails: (id: string) => `station:${id}:details`,
  activeSession: (userId: string) => `session:active:${userId}`,
};

// Cache TTLs (in seconds)
export const CACHE_TTL = {
  connectorStatus: 30,
  stationsNearby: 300, // 5 minutes
  userProfile: 600,    // 10 minutes
  stationDetails: 300,
  activeSession: 10,
};

// Helper functions
export async function cacheGet<T>(key: string): Promise<T | null> {
  const cached = await redis.get(key);
  if (!cached) return null;

  try {
    return JSON.parse(cached) as T;
  } catch {
    return cached as T;
  }
}

export async function cacheSet(key: string, value: any, ttl?: number): Promise<void> {
  const serialized = typeof value === 'string' ? value : JSON.stringify(value);

  if (ttl) {
    await redis.setex(key, ttl, serialized);
  } else {
    await redis.set(key, serialized);
  }
}

export async function cacheDelete(key: string): Promise<void> {
  await redis.del(key);
}

export async function cacheDeletePattern(pattern: string): Promise<void> {
  const keys = await redis.keys(pattern);
  if (keys.length > 0) {
    await redis.del(...keys);
  }
}
