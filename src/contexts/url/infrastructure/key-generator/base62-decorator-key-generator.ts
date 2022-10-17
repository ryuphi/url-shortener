import { KeyGeneratorDecorator } from '../../domain/key-generator/key-generator-decorator';

const CHARSET: Array<string> =
  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export class Base62DecoratorKeyGenerator extends KeyGeneratorDecorator {
  async generate(): Promise<string> {
    // encode to base62
    let key = Number(await super.generate());
    let hash = '';

    while (key > 0) {
      hash = CHARSET[key % 62] + hash;
      key = Math.floor(key / 62);
    }

    return hash;
  }
}
