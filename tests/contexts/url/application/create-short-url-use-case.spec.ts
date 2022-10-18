import { CreateShortUrlUseCase } from '../../../../src/contexts/url/application/create-short-url-use-case';
import { ShortUrl } from '../../../../src/contexts/url/domain/short-url/short-url';
import { CounterKeyGenerator } from '../../../../src/contexts/url/infrastructure/key-generator/counter-key-generator';
import { Base62DecoratorKeyGenerator } from '../../../../src/contexts/url/infrastructure/key-generator/base62-decorator-key-generator';
import { ShortUrlRepository } from '../../../../src/contexts/url/domain/short-url/short-url-repository';
import { InMemoryShortUrlRepository } from '../../../../src/contexts/url/infrastructure/persistence/in-memory/in-memory-short-url-repository';
import { KeyGenerator } from '../../../../src/contexts/url/domain/key-generator/key-generator';
import { SnowflakeKeyGenerator } from '../../../../src/contexts/url/infrastructure/key-generator/snowflake-key-generator';

describe('CreateShortUrlUseCase', () => {
  describe('With Basic CounterKeyGenerator', () => {
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

    it('should persist short url in storage', async () => {
      const longUrl = 'https://www.google.com/search?q=kittyies';

      // first generated key is 100000000 with CounterKeyGenerator
      const shortUrl = await useCase.execute(longUrl);

      expect(shortUrl.key).toBe('100000000');

      const persistedShortUrl = await shorUrlRepository.findByKey('100000000');

      expect(persistedShortUrl).toBeDefined();
      expect(persistedShortUrl).toBe(shortUrl);
    });

    it('should not persist short url in storage if long url is invalid', async () => {
      const longUrl = 'invalid url';
      try {
        await useCase.execute(longUrl);
      } catch (error) {
        expect((error as Error).message).toBe('Invalid long url');
      }
    });
  });

  describe('With Base62DecoratorKeyGenerator', () => {
    let keyGenerator: KeyGenerator;
    let decoratedKeyGenerator: KeyGenerator;
    let shorUrlRepository: ShortUrlRepository;
    let base62EncodedUseCase: CreateShortUrlUseCase;

    beforeEach(() => {
      shorUrlRepository = new InMemoryShortUrlRepository();
      keyGenerator = new CounterKeyGenerator();
      decoratedKeyGenerator = new Base62DecoratorKeyGenerator(keyGenerator);
      base62EncodedUseCase = new CreateShortUrlUseCase(
        decoratedKeyGenerator,
        shorUrlRepository
      );
    });

    it('create short url with key encoded with base62', async () => {
      const longUrl = 'https://www.google.com/search?q=kittyies';

      // first generated key is 100000000 with CounterKeyGenerator
      const shortUrl = await base62EncodedUseCase.execute(longUrl);

      expect(shortUrl.key).toMatch(/^[0-9a-zA-Z]+$/);
      expect(shortUrl.key).not.toBe('100000000');
      expect(shortUrl.key).toBe('6LAze');
    });
  });

  describe('With SnowflakeKeyGenerator', () => {
    it('create short url with key encoded with snowflake', async () => {
      const longUrl = 'https://www.google.com/search?q=kittyies';

      const useCase = new CreateShortUrlUseCase(
        new Base62DecoratorKeyGenerator(new SnowflakeKeyGenerator()),
        new InMemoryShortUrlRepository()
      );

      const shortUrl = await useCase.execute(longUrl);

      expect(shortUrl.key).toMatch(/^[0-9a-zA-Z]+$/);
      expect(shortUrl.key).not.toBe('100000000');
    });

    it('create different short url from diffenrent use case', async () => {
      const longUrl = 'https://www.google.com/search?q=kittyies';

      const useCase = new CreateShortUrlUseCase(
        new Base62DecoratorKeyGenerator(new SnowflakeKeyGenerator(0, 0)),
        new InMemoryShortUrlRepository()
      );

      const useCase2 = new CreateShortUrlUseCase(
        new Base62DecoratorKeyGenerator(new SnowflakeKeyGenerator(1, 0)),
        new InMemoryShortUrlRepository()
      );

      const shortUrl = await useCase.execute(longUrl);
      const shortUrl2 = await useCase2.execute(longUrl);

      expect(shortUrl.key).not.toBe(shortUrl2.key);
    });
  });
});
