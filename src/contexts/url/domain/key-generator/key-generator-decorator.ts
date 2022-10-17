import { KeyGenerator } from './key-generator';

export class KeyGeneratorDecorator implements KeyGenerator {
  constructor(private keyGenerator: KeyGenerator) {}
  async generate(): Promise<string> {
    return this.keyGenerator.generate();
  }
}
