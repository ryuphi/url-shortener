import { ShortUrl } from './short-url';

export interface ShortUrlRepository {
  save(shortUrl: ShortUrl): Promise<void>;
  findByKey(key: string): Promise<ShortUrl | null>;
}
