import { KeyGeneratorDecorator } from '../../domain/key-generator/key-generator-decorator';

export class SimpleDecorator extends KeyGeneratorDecorator {
  async generate(): Promise<string> {
    return 'Decorated key ' + super.generate();
  }
}
