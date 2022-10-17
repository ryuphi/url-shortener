import { Router, Request, Response } from 'express';
import { CreateShortUrlUseCase } from '../../../contexts/url/application/create-short-url-use-case';
import { Base62DecoratorKeyGenerator } from '../../../contexts/url/infrastructure/key-generator/base62-decorator-key-generator';
import { SnowflakeKeyGenerator } from '../../../contexts/url/infrastructure/key-generator/snowflake-key-generator';
import { InMemoryShortUrlRepository } from '../../../contexts/url/infrastructure/persistence/in-memory-short-url-repository';
import httpStatus from 'http-status';

const port =
  process.env.NODE_ENV === 'test' ? 6001 : process.env.PORT || '3000';
const baseUrl = `http://localhost:${port}`;

export const router = Router();

const keyGenerator = new Base62DecoratorKeyGenerator(
  new SnowflakeKeyGenerator()
);

const repository = new InMemoryShortUrlRepository();
const createShortUrlUserCase = new CreateShortUrlUseCase(
  keyGenerator,
  repository
);

type CreateShortUrlBody = {
  url: string;
};

type CreateShortUrlRequest = Request<any, any, CreateShortUrlBody>;
type CreateShortUrlResponse = {
  shortUrl: string;
};

router.post(
  '/',
  async (req: CreateShortUrlRequest, res: Response<CreateShortUrlResponse>) => {
    const { url } = req.body;
    const shortUrl = await createShortUrlUserCase.execute(url);
    return res
      .status(httpStatus.CREATED)
      .send({ shortUrl: `${baseUrl}/${shortUrl.key}` });
  }
);

type FindOriginalUrlRequest = Request<{ key: string }>;

router.get('/:key', async (req: FindOriginalUrlRequest, res: Response) => {
  const { key } = req.params;
  const shortUrl = await repository.findByKey(key);
  if (shortUrl) {
    return res.redirect(shortUrl.originalUrl);
  }
  return res.status(httpStatus.NOT_FOUND).send();
});
