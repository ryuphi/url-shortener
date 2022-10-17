import { KeyGenerator } from '../../domain/key-generator/key-generator';

export class CounterKeyGenerator implements KeyGenerator {
  counter = 100000000;
  async generate(): Promise<string> {
    const key = this.counter.toString();
    this.counter++;
    return key;
  }
}
