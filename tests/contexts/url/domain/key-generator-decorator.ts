import { CounterKeyGenerator } from '../../../../src/contexts/url/infrastructure/key-generator/counter-key-generator';
import { KeyGeneratorDecorator } from '../../../../src/contexts/url/domain/key-generator/key-generator-decorator';
import {
  SimpleDecorator
} from '../../../../src/contexts/url/infrastructure/key-generator/simple-decorator-key-generator';

describe('KeyGeneratorDecorator', () => {
  it("should apply the decorator to the class's method", () => {
    const keyGenerator = new CounterKeyGenerator();
    const simpleDecorator = new SimpleDecorator(keyGenerator);
    const keyGeneratorDecorator = new KeyGeneratorDecorator(simpleDecorator);
    const key = keyGeneratorDecorator.generate();
    expect(key).toBe('Decorated key 100000000');
  });
});
