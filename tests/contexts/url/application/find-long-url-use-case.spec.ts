import { InMemoryShortUrlRepository } from '../../../../src/contexts/url/infrastructure/persistence/in-memory-short-url-repository';
import { FindOriginalUrlUseCase } from '../../../../src/contexts/url/application/find-original-url-use-case';

describe('Feature: find original url', () => {
  it('should find a original url by key', async () => {
    const repository = new InMemoryShortUrlRepository();
    const originalUrl = 'https://www.google.com/search?q=kittyies';
    const hashKey = 'hwerTysH9';

    await repository.save({
      key: hashKey,
      originalUrl,
      enabled: true
    });

    const findUseCase = new FindOriginalUrlUseCase(repository);

    const url = await findUseCase.execute(hashKey);

    expect(url).toBe(originalUrl);
  });

  it('should return null if not found', async () => {
    const repository = new InMemoryShortUrlRepository();
    const findUseCase = new FindOriginalUrlUseCase(repository);

    const url = await findUseCase.execute('not-found');

    expect(url).toBeNull();
  });
});