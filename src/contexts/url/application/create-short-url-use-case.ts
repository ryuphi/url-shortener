import { ShortUrl } from '../domain/short-url/short-url';
import { KeyGenerator } from '../domain/key-generator/key-generator';
import { ShortUrlRepository } from '../domain/short-url/short-url-repository';

export class CreateShortUrlUseCase {
  constructor(
    private keyGenerator: KeyGenerator,
    private shortUrlRepository: ShortUrlRepository
  ) {}

  async execute(longUrl: string): Promise<ShortUrl> {
    const isValidUrl = this.validateUrl(longUrl);

    if (!isValidUrl) {
      throw new Error('Invalid long url');
    }

    const key = this.keyGenerator.generate();
    const shorUrl = new ShortUrl(key, longUrl, true);

    await this.shortUrlRepository.save(shorUrl);

    return shorUrl;
  }

  private validateUrl(longUrl: string) {
    try {
      const url = new URL(longUrl);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (error) {
      return false;
    }
  }
}
