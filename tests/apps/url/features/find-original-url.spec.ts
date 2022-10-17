import { UrlApp } from '../../../../src/apps/url/url-app';
import request from 'supertest';

describe('Feature: Find original url', () => {
  let application: UrlApp;

  beforeAll(async () => {
    application = new UrlApp();
    await application.start();
  });

  afterAll(async () => {
    await application.stop();
  });

  it('should find original url and redirect to original url', async () => {
    const {
      body: { shortUrl }
    } = await request(application.httpServer).post('/').send({
      url: 'https://www.google.com/search?q=kittyies'
    });

    const [key] = shortUrl.split('/').reverse();

    await request(application.httpServer).get(`/${key}`).redirects(1);
  });
});
