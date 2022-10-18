import { ShortUrlRepository } from '../domain/short-url/short-url-repository';

export type UpdateOriginalUrlDto = {
  originalUrl?: string;
  enabled?: boolean;
};

export class UpdateOriginalUrlUseCase {
  constructor(
    private readonly shortUrlRepository: ShortUrlRepository,
    private readonly cachedShortUrlRepository?: ShortUrlRepository
  ) {}

  async execute(key: string, changedDto: UpdateOriginalUrlDto): Promise<void> {
    const shortUrl = await this.shortUrlRepository.findByKey(key);

    if (!shortUrl) {
      throw new Error('Short url not found');
    }

    if (changedDto.originalUrl) {
      shortUrl.changeOriginalUrl(changedDto.originalUrl);
    }

    if (changedDto.enabled !== undefined && !changedDto.enabled) {
      shortUrl.disable();
    }

    if (changedDto.enabled !== undefined && changedDto.enabled) {
      shortUrl.enable();
    }

    await this.shortUrlRepository.save(shortUrl);

    if (this.cachedShortUrlRepository) {
      await this.cachedShortUrlRepository.save(shortUrl);
    }
  }
}
