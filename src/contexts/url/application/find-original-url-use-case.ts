import { ShortUrlRepository } from '../domain/short-url/short-url-repository';

export class FindOriginalUrlUseCase {
  constructor(
    private shortUrlRepository: ShortUrlRepository,
    private cachedShortUrlRepository?: ShortUrlRepository
  ) {}

  async execute(key: string): Promise<string | null> {
    const cachedUrl =
      (await this.cachedShortUrlRepository?.findByKey(key)) || null;

    if (cachedUrl) {
      return cachedUrl.originalUrl;
    }

    const shortUrl = await this.shortUrlRepository.findByKey(key);

    // todo: send to queue to cache...
    if (shortUrl) {
      await this.cachedShortUrlRepository?.save(shortUrl);
    }

    return shortUrl?.originalUrl || null;
  }
}
