import { CreateShortUrlUseCase } from '../../../../src/contexts/url/application/create-short-url-use-case';
import { ShortUrl } from '../../../../src/contexts/url/domain/short-url/short-url';
import { CounterKeyGenerator } from '../../../../src/contexts/url/infrastructure/key-generator/counter-key-generator';
import { Base62DecoratorKeyGenerator } from '../../../../src/contexts/url/infrastructure/key-generator/base62-decorator-key-generator';
import { ShortUrlRepository } from '../../../../src/contexts/url/domain/short-url/short-url-repository';
import { InMemoryShortUrlRepository } from '../../../../src/contexts/url/infrastructure/persistence/in-memory-short-url-repository';

describe('feature: create short 1url', () => {
  let keyGenerator: CounterKeyGenerator;
  let useCase: CreateShortUrlUseCase;
  let shorUrlRepository: ShortUrlRepository;

  beforeEach(() => {
    shorUrlRepository = new InMemoryShortUrlRepository();
    keyGenerator = new CounterKeyGenerator();
    useCase = new CreateShortUrlUseCase(keyGenerator, shorUrlRepository);
  });

  it('create short url from long url', async () => {
    const longUrl = 'https://www.google.com/search?q=kittyies';

    const shortUrl = await useCase.execute(longUrl);

    expect(shortUrl).toBeInstanceOf(ShortUrl);
    expect(shortUrl.originalUrl).toBe(longUrl);
    expect(shortUrl.enabled).toBe(true);
  });

  it('create short url from long url return a short url with key', async () => {
    const longUrl = 'https://www.google.com/search?q=kittyies';

    const shortUrl = await useCase.execute(longUrl);

    expect(shortUrl.key).toBeDefined();
  });

  it('create different short url from same long url', async () => {
    const longUrl = 'https://www.google.com/search?q=kittyies';
    const longUrl2 = 'https://www.google.com/search?q=kittyies';

    const shortUrl = await useCase.execute(longUrl);
    const shortUrl2 = await useCase.execute(longUrl2);

    expect(shortUrl.key).not.toBe(shortUrl2.key);
  });

  it('create different short url from different long url', async () => {
    const longUrl = 'https://www.google.com/search?q=kittyies';
    const longUrl2 = 'https://www.google.com/search?q=puppies';

    const shortUrl = await useCase.execute(longUrl);
    const shortUrl2 = await useCase.execute(longUrl2);

    expect(shortUrl.key).not.toBe(shortUrl2.key);
  });

  it('create short url with key encoded with base62', async () => {
    const longUrl = 'https://www.google.com/search?q=kittyies';

    const useCaseDecoratedKeyGenerator = new CreateShortUrlUseCase(
      new Base62DecoratorKeyGenerator(keyGenerator),
      shorUrlRepository
    );

    // first generated key is 100000000 with CounterKeyGenerator
    const shortUrl = await useCaseDecoratedKeyGenerator.execute(longUrl);

    expect(shortUrl.key).toMatch(/^[0-9a-zA-Z]+$/);
    expect(shortUrl.key).not.toBe('100000000');
  });

  it('should persist short url in storage', async () => {
    const longUrl = 'https://www.google.com/search?q=kittyies';

    // first generated key is 100000000 with CounterKeyGenerator
    const shortUrl = await useCase.execute(longUrl);

    expect(shortUrl.key).toBe('100000000');

    const persistedShortUrl = await shorUrlRepository.findByKey('100000000');

    expect(persistedShortUrl).toBeDefined();
    expect(persistedShortUrl).toBe(shortUrl);
  });
});
