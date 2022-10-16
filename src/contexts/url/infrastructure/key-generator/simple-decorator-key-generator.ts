import { KeyGeneratorDecorator } from '../../domain/key-generator/key-generator-decorator';

export class SimpleDecorator extends KeyGeneratorDecorator {
  generate(): string {
    return 'Decorated key ' + super.generate();
  }
}
