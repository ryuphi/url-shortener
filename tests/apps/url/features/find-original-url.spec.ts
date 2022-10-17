import { UrlApp } from '../../../../src/apps/url/url-app';
import request from 'supertest';

let application: UrlApp;

beforeAll(async () => {
  application = new UrlApp();
  await application.start('0');
});

afterAll(async () => {
  await application.stop();
});

describe('Feature: Find original url', () => {
  it('should find original url and redirect to original url', async () => {
    const {
      body: { shortUrl }
    } = await request(application.httpServer).post('/').send({
      url: 'https://www.google.com/search?q=kittyies'
    });

    const [key] = shortUrl.split('/').reverse();

    await request(application.httpServer).get(`/${key}`).redirects(1);
  });

  it('should return 404 when short url does not exist', async () => {
    const { status } = await request(application.httpServer)
      .get('/not-found')
      .redirects(0);

    expect(status).toBe(404);
  });
});
