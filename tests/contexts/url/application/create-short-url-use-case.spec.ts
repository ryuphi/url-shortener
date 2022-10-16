import { CreateShortUrlUseCase } from '../../../../src/contexts/url/application/create-short-url-use-case';
import { ShortUrl } from '../../../../src/contexts/url/domain/short-url';
import { CounterKeyGenerator } from '../../../../src/contexts/url/infrastructure/key-generator/counter-key-generator';
import { Base62DecoratorKeyGenerator } from '../../../../src/contexts/url/infrastructure/key-generator/base62-decorator-key-generator';

describe('feature: create short 1url', () => {
  let keyGenerator: CounterKeyGenerator;
  let useCase: CreateShortUrlUseCase;

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

  it('create short url with key encoded with base62', () => {
    const longUrl = 'https://www.google.com/search?q=kittyies';

    const useCaseDecoratedKeyGenerator = new CreateShortUrlUseCase(
      new Base62DecoratorKeyGenerator(keyGenerator)
    );

    // first generated key is 100000000 with CounterKeyGenerator
    const shortUrl = useCaseDecoratedKeyGenerator.execute(longUrl);

    expect(shortUrl.key).toMatch(/^[0-9a-zA-Z]+$/);
    expect(shortUrl.key).not.toBe('100000000');
  });
});
