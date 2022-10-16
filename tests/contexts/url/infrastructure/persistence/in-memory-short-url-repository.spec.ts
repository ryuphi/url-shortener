import { ShortUrl } from '../../../../../src/contexts/url/domain/short-url/short-url';
import { InMemoryShortUrlRepository } from '../../../../../src/contexts/url/infrastructure/persistence/in-memory-short-url-repository';

describe('InMemoryShortUrlRepository', () => {
  let repository: InMemoryShortUrlRepository;

  beforeEach(() => {
    repository = new InMemoryShortUrlRepository();
  });
  it('should save a short url', async () => {
    const shortUrl = new ShortUrl(
      '123456',
      'https://www.google.com/search?q=kittyies',
      true
    );
    await repository.save(shortUrl);
    const shortUrlFound = await repository.findByKey(shortUrl.key);
    expect(shortUrlFound).toBe(shortUrl);
  });

  it('should return null if short url not found', async () => {
    const shortUrlFound = await repository.findByKey('123456');
    expect(shortUrlFound).toBeNull();
  });
});
