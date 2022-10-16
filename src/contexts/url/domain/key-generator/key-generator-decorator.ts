import { KeyGenerator } from './key-generator';

export class KeyGeneratorDecorator implements KeyGenerator {
  constructor(private keyGenerator: KeyGenerator) {}
  generate(): string {
    return this.keyGenerator.generate();
  }
}
