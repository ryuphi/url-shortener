import { ShortUrl } from '../../../../src/contexts/url/domain/short-url/short-url';
import { InMemoryShortUrlRepository } from '../../../../src/contexts/url/infrastructure/persistence/in-memory/in-memory-short-url-repository';
import { ShortUrlRepository } from '../../../../src/contexts/url/domain/short-url/short-url-repository';
import { UpdateOriginalUrlUseCase } from '../../../../src/contexts/url/application/update-original-url-use-case';
import { CachedShortUrlRepository } from '../../../../src/contexts/url/infrastructure/persistence/in-memory/cached-short-url-repository';
import {
  CacheClient,
  SimpleCacheClient
} from '../../../../src/contexts/url/infrastructure/persistence/cache/cache-client';

describe('UpdateOriginalUrlUseCase', () => {
  let useCase: UpdateOriginalUrlUseCase;
  let repository: ShortUrlRepository;
  let shortUrlCacheClient: CacheClient<ShortUrl>;
  let cachedRepository: ShortUrlRepository;

  beforeEach(() => {
    repository = new InMemoryShortUrlRepository();
    shortUrlCacheClient = new SimpleCacheClient<ShortUrl>();
    cachedRepository = new CachedShortUrlRepository(
      repository,
      shortUrlCacheClient
    );
    useCase = new UpdateOriginalUrlUseCase(cachedRepository);
  });

  it('should update the original url of a short url', async () => {
    const shortUrl = new ShortUrl(
      '123456',
      'https://www.google.com/search?q=kittyies',
      true
    );

    await repository.save(shortUrl);
    await useCase.execute('123456', {
      originalUrl: 'https://www.google.com/search?q=cats'
    });
    const shortUrlFound = await repository.findByKey(shortUrl.key);
    expect(shortUrlFound?.originalUrl).toBe(
      'https://www.google.com/search?q=cats'
    );
    expect(shortUrlFound?.enabled).toBe(true);
  });

  it('should disable a short url', async () => {
    const shortUrl = new ShortUrl(
      '123456',
      'https://www.google.com/search?q=kittyies',
      true
    );

    await repository.save(shortUrl);
    await useCase.execute('123456', {
      enabled: false
    });
    const shortUrlFound = await repository.findByKey(shortUrl.key);
    expect(shortUrlFound?.enabled).toBe(false);
    expect(shortUrlFound?.originalUrl).toBe(
      'https://www.google.com/search?q=kittyies'
    );
  });

  it('should enable a short url', async () => {
    const shortUrl = new ShortUrl(
      '123456',
      'https://www.google.com/search?q=kittyies',
      false
    );

    await repository.save(shortUrl);
    await useCase.execute('123456', {
      enabled: true
    });
    const shortUrlFound = await repository.findByKey(shortUrl.key);
    expect(shortUrlFound?.enabled).toBe(true);
    expect(shortUrlFound?.originalUrl).toBe(
      'https://www.google.com/search?q=kittyies'
    );
  });

  it('should throw an error if short url not found', async () => {
    await expect(
      useCase.execute('123456', {
        enabled: true
      })
    ).rejects.toThrowError('Short url not found');
  });
});
