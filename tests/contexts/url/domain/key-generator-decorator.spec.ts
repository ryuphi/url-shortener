import { CounterKeyGenerator } from '../../../../src/contexts/url/infrastructure/key-generator/counter-key-generator';
import { SimpleDecorator } from '../../../../src/contexts/url/infrastructure/key-generator/simple-decorator-key-generator';

describe('KeyGeneratorDecorator', () => {
  it("should apply the decorator to the class's method", async () => {
    const keyGenerator = new CounterKeyGenerator();
    const simpleDecorator = new SimpleDecorator(keyGenerator);
    const key = await simpleDecorator.generate();
    expect(key).toBe('Decorated key 100000000');
  });
});
