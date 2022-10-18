import { InMemoryShortUrlRepository } from '../../../../src/contexts/url/infrastructure/persistence/in-memory/in-memory-short-url-repository';
import { FindOriginalUrlUseCase } from '../../../../src/contexts/url/application/find-original-url-use-case';
import { ShortUrl } from '../../../../src/contexts/url/domain/short-url/short-url';
import { CachedShortUrlRepository } from '../../../../src/contexts/url/infrastructure/persistence/in-memory/cached-short-url-repository';
import { SimpleCacheClient } from '../../../../src/contexts/url/infrastructure/persistence/cache/cache-client';

describe('Feature: find original url', () => {
  it('should find a original url by key', async () => {
    const repository = new InMemoryShortUrlRepository();
    const originalUrl = 'https://www.google.com/search?q=kittyies';
    const hashKey = 'hwerTysH9';

    await repository.save({
      key: hashKey,
      originalUrl,
      enabled: true
    } as ShortUrl);

    const findUseCase = new FindOriginalUrlUseCase(repository);

    const url = await findUseCase.execute(hashKey);

    expect(url).toBe(originalUrl);
  });

  it('should return null if not found', async () => {
    const repository = new InMemoryShortUrlRepository();
    const findUseCase = new FindOriginalUrlUseCase(repository);

    const url = await findUseCase.execute('not-found');

    expect(url).toBeNull();
  });

  it('should persist in cached when found a url', async () => {
    const repository = new InMemoryShortUrlRepository();
    const originalUrl = 'https://www.google.com/search?q=kittyies';
    const hashKey = 'hwerTysH9';

    await repository.save({
      key: hashKey,
      originalUrl,
      enabled: true
    } as ShortUrl);

    const cacheClient = new SimpleCacheClient<ShortUrl>();

    const cachedRepository = new CachedShortUrlRepository(
      repository,
      cacheClient
    );

    const findUseCase = new FindOriginalUrlUseCase(cachedRepository);

    const url = await findUseCase.execute(hashKey);

    expect(url).toBe(originalUrl);

    const cachedUrl = await cacheClient.get(hashKey);
    expect(cachedUrl).not.toBeNull();
    expect(cachedUrl?.originalUrl).toBe(originalUrl);
    expect(cachedUrl?.key).toBe(hashKey);
  });

  it('should retrieve from cache when found a url in cache', async () => {
    const repository = new InMemoryShortUrlRepository();
    const originalUrl = 'https://www.google.com/search?q=kittyies';
    const hashKey = 'hwerTysH9';

    const cacheClient = new SimpleCacheClient<ShortUrl>();
    const cachedRepository = new CachedShortUrlRepository(
      repository,
      cacheClient
    );

    await cachedRepository.save({
      key: hashKey,
      originalUrl,
      enabled: true
    } as ShortUrl);

    const findUseCase = new FindOriginalUrlUseCase(cachedRepository);

    const url = await findUseCase.execute(hashKey);

    expect(url).toBe(originalUrl);
  });
});
