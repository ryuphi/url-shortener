import request from 'supertest';
import { UrlApp } from '../../../../src/apps/url/url-app';
import httpStatus from 'http-status';

let application: UrlApp;

beforeAll(async () => {
  application = new UrlApp();
  await application.start('0');
});

afterAll(async () => {
  await application.stop();
});

describe('Feature: Create short url', () => {
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
