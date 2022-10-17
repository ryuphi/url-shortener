import request from 'supertest';
import { UrlApp } from '../../../../src/apps/url/url-app';
import httpStatus from 'http-status';

describe('Feature: Create short url', () => {
  let application: UrlApp;

  beforeAll(async () => {
    application = new UrlApp();
    await application.start();
  });

  afterAll(async () => {
    await application.stop();
  });

  it('should create a short url', async () => {
    const { body, status } = await request(application.httpServer)
      .post('/')
      .send({
        url: 'https://www.google.com/search?q=kittyies'
      });

    expect(status).toBe(httpStatus.CREATED);
    expect(body).toHaveProperty('shortUrl');
  });
});
