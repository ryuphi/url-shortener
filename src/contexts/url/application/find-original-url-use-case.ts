import { ShortUrlRepository } from '../domain/short-url/short-url-repository';

export class FindOriginalUrlUseCase {
  constructor(private shortUrlRepository: ShortUrlRepository) {}

  async execute(key: string): Promise<string | null> {
    const shortUrl = await this.shortUrlRepository.findByKey(key);
    return shortUrl?.originalUrl || null;
  }
}
