import { Router, Request, Response } from 'express';
import { CreateShortUrlUseCase } from '../../../contexts/url/application/create-short-url-use-case';
import { Base62DecoratorKeyGenerator } from '../../../contexts/url/infrastructure/key-generator/base62-decorator-key-generator';
import { SnowflakeKeyGenerator } from '../../../contexts/url/infrastructure/key-generator/snowflake-key-generator';
import { InMemoryShortUrlRepository } from '../../../contexts/url/infrastructure/persistence/in-memory-short-url-repository';
import httpStatus from 'http-status';

const baseUrl = `http://localhost:${process.env.PORT}`;

export const router = Router();

const keyGenerator = new Base62DecoratorKeyGenerator(
  new SnowflakeKeyGenerator()
);

const repository = new InMemoryShortUrlRepository();
const createShortUrlUserCase = new CreateShortUrlUseCase(keyGenerator, repository);

type CreateShortUrlBody = {
  url: string;
};

type CreateShortUrlRequest = Request<any, any, CreateShortUrlBody>
type CreateShortUrlResponse = {
  shortUrl: string
}

router.post('/', async (req: CreateShortUrlRequest, res: Response<CreateShortUrlResponse>) => {
  const {url} = req.body
  const shortUrl = await createShortUrlUserCase.execute(url);
  return res
    .status(httpStatus.CREATED)
    .send({ shortUrl: `${baseUrl}/${shortUrl.key}` });
});