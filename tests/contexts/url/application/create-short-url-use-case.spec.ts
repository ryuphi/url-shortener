import { CreateShortUrlUseCase } from '../../../../src/contexts/url/application/create-short-url-use-case';
import { ShortUrl } from '../../../../src/contexts/url/domain/short-url';

describe('feature: create short url', () => {
  it('create short url from long url', () => {
    const useCase = new CreateShortUrlUseCase();
    const longUrl = 'https://www.google.com/search?q=kittyies';

    const shortUrl = useCase.execute(longUrl);

    expect(shortUrl).toBeInstanceOf(ShortUrl);
    expect(shortUrl.originalUrl).toBe(longUrl);
    expect(shortUrl.enabled).toBe(true);
  });

  it('create short url from long url return a short url with key', () => {
    const useCase = new CreateShortUrlUseCase();
    const longUrl = 'https://www.google.com/search?q=kittyies';

    const shortUrl = useCase.execute(longUrl);

    expect(shortUrl.key).toBeDefined();
  });

  it('create different short url from same long url', () => {
    const useCase = new CreateShortUrlUseCase();
    const longUrl = 'https://www.google.com/search?q=kittyies';
    const longUrl2 = 'https://www.google.com/search?q=kittyies';

    const shortUrl = useCase.execute(longUrl);
    const shortUrl2 = useCase.execute(longUrl2);

    expect(shortUrl.key).not.toBe(shortUrl2.key);
  });
});
