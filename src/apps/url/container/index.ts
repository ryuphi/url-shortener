import { InMemoryShortUrlRepository } from '../../../contexts/url/infrastructure/persistence/in-memory-short-url-repository';
import { ShortUrlRepository } from '../../../contexts/url/domain/short-url/short-url-repository';
import { KeyGenerator } from '../../../contexts/url/domain/key-generator/key-generator';
import { Base62DecoratorKeyGenerator } from '../../../contexts/url/infrastructure/key-generator/base62-decorator-key-generator';
import { SnowflakeKeyGenerator } from '../../../contexts/url/infrastructure/key-generator/snowflake-key-generator';

class Container {
  services: Map<string, any> = new Map();
  params: Map<string, any> = new Map();

  constructor() {
    this.configParams();
    this.configRepository();
    this.configKeyGenerator(process.env.NODE_ENV || 'dev');
  }

  private configRepository() {
    let urlRepository: ShortUrlRepository;
    if (process.env.NODE_ENV === 'test') {
      urlRepository = new InMemoryShortUrlRepository();
    } else {
      urlRepository = new InMemoryShortUrlRepository();
    }

    this.services.set('app.url.repository', urlRepository);
  }

  private configKeyGenerator(env: string) {
    let keyGenerator: KeyGenerator;
    if (env === 'test') {
      keyGenerator = new Base62DecoratorKeyGenerator(
        new SnowflakeKeyGenerator()
      );
    } else {
      keyGenerator = new Base62DecoratorKeyGenerator(
        new SnowflakeKeyGenerator()
      );
    }

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
