import { ShortUrlRepository } from '../domain/short-url/short-url-repository';

export type UpdateOriginalUrlDto = {
  originalUrl?: string;
  enabled?: boolean;
};

export class UpdateOriginalUrlUseCase {
  constructor(private readonly shortUrlRepository: ShortUrlRepository) {}

  async execute(key: string, changedDto: UpdateOriginalUrlDto): Promise<void> {
    const shortUrlFound = await this.shortUrlRepository.findByKey(key);

    if (!shortUrlFound) {
      throw new Error('Short url not found');
    }

    if (changedDto.originalUrl) {
      shortUrlFound.changeOriginalUrl(changedDto.originalUrl);
    }

    if (changedDto.enabled !== undefined && !changedDto.enabled) {
      shortUrlFound.disable();
    }

    if (changedDto.enabled !== undefined && changedDto.enabled) {
      shortUrlFound.enable();
    }

    await this.shortUrlRepository.save(shortUrlFound);
  }
}
