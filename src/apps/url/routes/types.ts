import { Request, Response } from 'express';
import { UpdateOriginalUrlDto } from '../../../contexts/url/application/update-original-url-use-case';

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

export type UpdateShortUrlRequest = Request & {
  params: { key: string };
  body: UpdateOriginalUrlDto;
};
