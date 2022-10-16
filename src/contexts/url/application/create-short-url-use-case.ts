import { ShortUrl } from '../domain/short-url';
import { KeyGenerator } from '../domain/key-generator/key-generator';

export class CreateShortUrlUseCase {
  constructor(private keyGenerator: KeyGenerator) {}

  execute(longUrl: string): ShortUrl {
    const key = this.keyGenerator.generate();
    return new ShortUrl(key, longUrl, true);
  }
}
