import { Router, Request } from 'express';
import { CreateShortUrlUseCase } from '../../../contexts/url/application/create-short-url-use-case';
import { Base62DecoratorKeyGenerator } from '../../../contexts/url/infrastructure/key-generator/base62-decorator-key-generator';
import { SnowflakeKeyGenerator } from '../../../contexts/url/infrastructure/key-generator/snowflake-key-generator';
import { InMemoryShortUrlRepository } from '../../../contexts/url/infrastructure/persistence/in-memory-short-url-repository';
import httpStatus from 'http-status';

export const router = Router();

const keyGenerator = new Base62DecoratorKeyGenerator(
  new SnowflakeKeyGenerator()
);
const repository = new InMemoryShortUrlRepository();
const useCase = new CreateShortUrlUseCase(keyGenerator, repository);
const baseUrl = `http://localhost:${process.env.PORT}`;

type CreateShortUrlRequest = {
  url: string;
};

router.post('/', async (req: Request<CreateShortUrlRequest>, res) => {
  const shortUrl = await useCase.execute(req.body.url);
  return res
    .status(httpStatus.CREATED)
    .send({ shortUrl: `${baseUrl}/${shortUrl.key}` });
});
