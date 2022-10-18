import { ShortUrl } from '../../../domain/short-url/short-url';
import {
  DecoratorShortUrlRepository,
  ShortUrlRepository
} from '../../../domain/short-url/short-url-repository';
import { CacheClient } from '../cache/cache-client';

export class CachedShortUrlRepository extends DecoratorShortUrlRepository {
  constructor(
    shortUrlRepository: ShortUrlRepository,
    private cache: CacheClient<ShortUrl>
  ) {
    super(shortUrlRepository);
  }

  async findByKey(key: string): Promise<ShortUrl | null> {
    const cachedShortUrl = await this.cache.get(key);
    if (cachedShortUrl) {
      return cachedShortUrl;
    }

    const shortUrl = await this.shortUrlRepository.findByKey(key);

    if (shortUrl) {
      await this.cache.set(key, shortUrl);
    }

    return shortUrl;
  }

  async save(shortUrl: ShortUrl): Promise<void> {
    await this.shortUrlRepository.save(shortUrl);
    await this.cache.set(shortUrl.key, shortUrl);
  }
}
