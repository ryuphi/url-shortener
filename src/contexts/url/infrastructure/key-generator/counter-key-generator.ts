import { KeyGenerator } from '../../domain/key-generator';

export class CounterKeyGenerator implements KeyGenerator {
  counter = 100000000;
  generate(): string {
    const key = this.counter.toString();
    this.counter++;
    return key;
  }
}
