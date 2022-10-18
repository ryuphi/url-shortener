import { InMemoryShortUrlRepository } from '../../../../../../src/contexts/url/infrastructure/persistence/in-memory/in-memory-short-url-repository';
import { ShortUrl } from '../../../../../../src/contexts/url/domain/short-url/short-url';
import { CachedShortUrlRepository } from '../../../../../../src/contexts/url/infrastructure/persistence/in-memory/cached-short-url-repository';
import { ShortUrlRepository } from '../../../../../../src/contexts/url/domain/short-url/short-url-repository';
import {
  CacheClient,
  SimpleCacheClient
} from '../../../../../../src/contexts/url/infrastructure/persistence/cache/cache-client';

describe('CachedShortUrlRepository', () => {
  let repository: ShortUrlRepository;
  let cachedRepository: ShortUrlRepository;
  let cacheClient: CacheClient<ShortUrl>;

  beforeEach(() => {
    repository = new InMemoryShortUrlRepository();
    cacheClient = new SimpleCacheClient<ShortUrl>();
    cachedRepository = new CachedShortUrlRepository(repository, cacheClient);
  });

  it('should cache the short url', async () => {
    const shortUrl = new ShortUrl(
      '123456',
      'https://www.google.com/search?q=kittyies',
      true
    );

    await cachedRepository.save(shortUrl);
    const shortUrlFound = await cachedRepository.findByKey(shortUrl.key);
    expect(shortUrlFound).toBe(shortUrl);
  });

  it('should update the cache when the short url is updated', async () => {
    const shortUrl = new ShortUrl(
      '123456',
      'https://www.google.com/search?q=kittyies',
      true
    );

    await cachedRepository.save(shortUrl);
    await cachedRepository.save(
      new ShortUrl(shortUrl.key, shortUrl.originalUrl, false)
    );
    const shortUrlFound = await cachedRepository.findByKey(shortUrl.key);
    expect(shortUrlFound?.enabled).toBe(false);
  });
});
