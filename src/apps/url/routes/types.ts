import { Request, Response } from 'express';

export type CreateShortUrlRequest = Request & {
  body: {
    url: string;
  };
};

export type CreateShortUrlResponse = Response<{ shortUrl: string }>;

export type FindOriginalUrlRequest = Request & {
  params: {
    key: string;
  };
};
