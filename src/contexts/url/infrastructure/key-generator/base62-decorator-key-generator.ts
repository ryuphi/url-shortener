import { KeyGeneratorDecorator } from '../../domain/key-generator/key-generator-decorator';

const CHARSET: Array<string> =
  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export class Base62DecoratorKeyGenerator extends KeyGeneratorDecorator {
  generate(): string {
    // encode to base62
    let key = Number(super.generate());
    let hash = '';

    while (key > 0) {
      hash = CHARSET[key % 62] + hash;
      key = Math.floor(key / 62);
    }

    return hash;
  }
}
