import { ShortUrl } from '../domain/short-url';

export class CreateShortUrlUseCase {
  execute(longUrl: string): ShortUrl {
    return new ShortUrl('123', longUrl, true);
  }
}
