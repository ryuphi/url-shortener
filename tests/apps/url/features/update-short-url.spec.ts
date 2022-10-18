import request from 'supertest';
import { UrlApp } from '../../../../src/apps/url/url-app';
import httpStatus from 'http-status';
import { container } from '../../../../src/apps/url/container';
import { ShortUrlRepository } from '../../../../src/contexts/url/domain/short-url/short-url-repository';

let application: UrlApp;

beforeAll(async () => {
  application = new UrlApp();
  await application.start('0');
});

afterAll(async () => {
  await application.stop();
});

describe('Feature: Update short url', () => {
  it('should update a original url', async () => {
    const {
      body: { shortUrl }
    } = await request(application.httpServer).post('/').send({
      url: 'https://www.google.com/search?q=kittyies'
    });

    const [key] = shortUrl.split('/').reverse();

    const { status } = await request(application.httpServer)
      .put(`/${key}`)
      .send({
        originalUrl: 'https://www.google.com/search?q=puppies',
        enabled: false
      });

    expect(status).toBe(httpStatus.OK);

    const shortUrlRepository =
      container.getService<ShortUrlRepository>('app.url.repository');

    const updatedShortUrl = await shortUrlRepository.findByKey(key);

    expect(updatedShortUrl?.originalUrl).toBe(
      'https://www.google.com/search?q=puppies'
    );
    expect(updatedShortUrl?.enabled).toBe(false);
  });
});
