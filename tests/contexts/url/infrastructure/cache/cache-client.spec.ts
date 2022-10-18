import { SimpleCacheClient } from '../../../../../src/contexts/url/infrastructure/persistence/cache/cache-client';

describe('CacheClient', () => {
  it('should be able to get a value', async () => {
    const cacheClient = new SimpleCacheClient();
    await cacheClient.set('key', 'value');
    const value = await cacheClient.get('key');
    expect(value).toBe('value');
  });

  it('should be able to set a value', async () => {
    const cacheClient = new SimpleCacheClient();
    await cacheClient.set('key', 'value');
    const value = await cacheClient.get('key');
    expect(value).toBe('value');
  });

  it('should be able to flush the cache', async () => {
    const cacheClient = new SimpleCacheClient();
    await cacheClient.set('key', 'value');
    await cacheClient.flush();
    const value = await cacheClient.get('key');
    expect(value).toBeNull();
  });
});
