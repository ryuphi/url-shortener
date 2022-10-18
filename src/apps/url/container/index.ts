import { InMemoryShortUrlRepository } from '../../../contexts/url/infrastructure/persistence/in-memory/in-memory-short-url-repository';
import { Base62DecoratorKeyGenerator } from '../../../contexts/url/infrastructure/key-generator/base62-decorator-key-generator';
import { SnowflakeKeyGenerator } from '../../../contexts/url/infrastructure/key-generator/snowflake-key-generator';
import { MongoShortUrlRepository } from '../../../contexts/url/infrastructure/persistence/mongo/mongo-short-url-repository';
import { MongoClientFactory } from '../../../contexts/url/infrastructure/persistence/mongo/mongo-client-factory';
import { ShortUrlRepository } from '../../../contexts/url/domain/short-url/short-url-repository';
import { CachedShortUrlRepository } from '../../../contexts/url/infrastructure/persistence/in-memory/cached-short-url-repository';
import { SimpleCacheClient } from '../../../contexts/url/infrastructure/persistence/cache/cache-client';
import { ShortUrl } from '../../../contexts/url/domain/short-url/short-url';

class Container {
  services: Map<string, any> = new Map();
  params: Map<string, any> = new Map();

  constructor() {
    this.configParams();
    this.configRepository();
    this.configKeyGenerator(process.env.NODE_ENV || 'dev');
  }

  private configRepository() {
    const inMemoryShortUrlRepository = new InMemoryShortUrlRepository();
    let shortUrlRepository: ShortUrlRepository;

    if (process.env.NODE_ENV === 'test') {
      shortUrlRepository = new CachedShortUrlRepository(
        new InMemoryShortUrlRepository(),
        new SimpleCacheClient<ShortUrl>()
      );
    } else {
      shortUrlRepository = new MongoShortUrlRepository(
        MongoClientFactory.createClient('short-url', {
          url:
            process.env.MONGO_URL || 'mongodb://localhost:27017/url-shortener'
        })
      );
    }

    this.services.set('app.url.repository', shortUrlRepository);
    this.services.set('app.url.cache-repository', inMemoryShortUrlRepository);
  }

  private configKeyGenerator(env: string) {
    const keyGenerator = new Base62DecoratorKeyGenerator(
      new SnowflakeKeyGenerator()
    );

    this.services.set('app.url.key-generator', keyGenerator);
  }

  getService<T>(key: string): T {
    return this.services.get(key);
  }

  getParam(key: string) {
    return this.params.get(key);
  }

  private configParams() {
    const port =
      process.env.NODE_ENV === 'test' ? '0' : process.env.PORT || '3000';
    this.params.set('app.port', port);
    this.params.set('app.baseUrl', `http://localhost:${port}`);
  }
}

export const container = new Container();
