import { CacheClient } from './cache-client';
import Redis from 'ioredis';

export class RedisCacheClient<T> implements CacheClient<T> {
  private client: Redis;

  constructor(private entityFactory: (data: string) => T) {
    this.client = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
  }

  async get(key: string): Promise<T | null> {
    const result = await this.client.get(key);
    if (!result) {
      return null;
    }

    return this.entityFactory(result);
  }

  async set(key: string, value: T): Promise<void> {
    await this.client.set(key, JSON.stringify(value));
  }

  async flush(): Promise<void> {
    await this.client.flushdb();
  }
}
