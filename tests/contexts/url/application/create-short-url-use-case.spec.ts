import { CreateShortUrlUseCase } from '../../../../src/contexts/url/application/create-short-url-use-case';
import { ShortUrl } from '../../../../src/contexts/url/domain/short-url';
import { CounterKeyGenerator } from '../../../../src/contexts/url/infrastructure/key-generator/counter-key-generator';

describe('feature: create short 1url', () => {
  let keyGenerator = new CounterKeyGenerator();
  let useCase = new CreateShortUrlUseCase(keyGenerator);

  beforeEach(() => {
    keyGenerator = new CounterKeyGenerator();
    useCase = new CreateShortUrlUseCase(keyGenerator);
  });

  it('create short url from long url', () => {
    const longUrl = 'https://www.google.com/search?q=kittyies';

    const shortUrl = useCase.execute(longUrl);

    expect(shortUrl).toBeInstanceOf(ShortUrl);
    expect(shortUrl.originalUrl).toBe(longUrl);
    expect(shortUrl.enabled).toBe(true);
  });

  it('create short url from long url return a short url with key', () => {
    const longUrl = 'https://www.google.com/search?q=kittyies';

    const shortUrl = useCase.execute(longUrl);

    expect(shortUrl.key).toBeDefined();
  });

  it('create different short url from same long url', () => {
    const longUrl = 'https://www.google.com/search?q=kittyies';
    const longUrl2 = 'https://www.google.com/search?q=kittyies';

    const shortUrl = useCase.execute(longUrl);
    const shortUrl2 = useCase.execute(longUrl2);

    expect(shortUrl.key).not.toBe(shortUrl2.key);
  });

  it('create different short url from different long url', () => {
    const longUrl = 'https://www.google.com/search?q=kittyies';
    const longUrl2 = 'https://www.google.com/search?q=puppies';

    const shortUrl = useCase.execute(longUrl);
    const shortUrl2 = useCase.execute(longUrl2);

    expect(shortUrl.key).not.toBe(shortUrl2.key);
  });
});
