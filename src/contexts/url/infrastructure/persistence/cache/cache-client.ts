export interface CacheClient<T> {
  get(key: string): Promise<T | null>;
  set(key: string, value: T): Promise<void>;
  flush(): Promise<void>;
}

export class SimpleCacheClient<T> implements CacheClient<T> {
  private cache: Map<string, T> = new Map();

  async get(key: string): Promise<T | null> {
    return this.cache.get(key) || null;
  }

  async set(key: string, value: T): Promise<void> {
    this.cache.set(key, value);
  }

  async flush() {
    this.cache.clear();
  }
}
