import { ShortUrl } from '../../../domain/short-url/short-url';
import { ShortUrlRepository } from '../../../domain/short-url/short-url-repository';

export class InMemoryShortUrlRepository implements ShortUrlRepository {
  private shortUrls: ShortUrl[] = [];

  async save(shortUrl: ShortUrl): Promise<void> {
    this.shortUrls.push(shortUrl);
  }

  async findByKey(key: string): Promise<ShortUrl | null> {
    return this.shortUrls.find(shortUrl => shortUrl.key === key) ?? null;
  }
}
