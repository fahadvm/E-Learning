import Redis from 'ioredis';
import logger from './logger';

if (!process.env.REDIS_URL) {
  throw new Error('REDIS_URL is not defined in environment variables');
}

export const redis = new Redis(process.env.REDIS_URL, {
  tls: {}, // REQUIRED for Upstash
  lazyConnect: false,
  maxRetriesPerRequest: null,
});

redis.on('connect', () => {
  logger.info(' Redis connected');
});

redis.on('error', (err) => {
  logger.error(' Redis error:', err);
});
