import { Router, Response } from 'express';
import { CreateShortUrlUseCase } from '../../../contexts/url/application/create-short-url-use-case';
import httpStatus from 'http-status';
import { container } from '../container';
import { ShortUrlRepository } from '../../../contexts/url/domain/short-url/short-url-repository';
import { KeyGenerator } from '../../../contexts/url/domain/key-generator/key-generator';
import { FindOriginalUrlUseCase } from '../../../contexts/url/application/find-original-url-use-case';
import {
  CreateShortUrlRequest,
  CreateShortUrlResponse,
  FindOriginalUrlRequest
} from './types';

export const router = Router();

const keyGenerator = container.getService<KeyGenerator>(
  'app.url.key-generator'
);
const shortUrlRepository =
  container.getService<ShortUrlRepository>('app.url.repository');

router.post(
  '/',
  async (req: CreateShortUrlRequest, res: CreateShortUrlResponse) => {
    const { url } = req.body;

    const createShortUrlUserCase = new CreateShortUrlUseCase(
      keyGenerator,
      shortUrlRepository
    );

    const shortUrl = await createShortUrlUserCase.execute(url);
    return res.status(httpStatus.CREATED).send({
      shortUrl: `${container.getParam('app.baseUrl')}/${shortUrl.key}`
    });
  }
);

router.get('/:key', async (req: FindOriginalUrlRequest, res: Response) => {
  const { key } = req.params;
  const findOriginalUrlUseCase = new FindOriginalUrlUseCase(shortUrlRepository);

  const originalUrl = await findOriginalUrlUseCase.execute(key);

  if (originalUrl) {
    return res.redirect(originalUrl);
  }
  return res.status(httpStatus.NOT_FOUND).send();
});
