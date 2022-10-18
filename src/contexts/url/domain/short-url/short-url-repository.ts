import { ShortUrl } from './short-url';

export interface ShortUrlRepository {
  save(shortUrl: ShortUrl): Promise<void>;
  findByKey(key: string): Promise<ShortUrl | null>;
}

export abstract class DecoratorShortUrlRepository
  implements ShortUrlRepository {
  constructor(protected readonly shortUrlRepository: ShortUrlRepository) {}

  async save(shortUrl: ShortUrl): Promise<void> {
    return this.shortUrlRepository.save(shortUrl);
  }

  async findByKey(key: string): Promise<ShortUrl | null> {
    return this.shortUrlRepository.findByKey(key);
  }
}
