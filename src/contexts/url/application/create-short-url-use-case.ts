import { ShortUrl } from '../domain/short-url/short-url';
import { KeyGenerator } from '../domain/key-generator/key-generator';
import { ShortUrlRepository } from '../domain/short-url/short-url-repository';

export class CreateShortUrlUseCase {
  constructor(
    private keyGenerator: KeyGenerator,
    private shortUrlRepository: ShortUrlRepository
  ) {}

  async execute(longUrl: string): Promise<ShortUrl> {
    const key = this.keyGenerator.generate();
    const shorUrl = new ShortUrl(key, longUrl, true);

    await this.shortUrlRepository.save(shorUrl);

    return shorUrl;
  }
}
