import { CounterKeyGenerator } from '../../../../../src/contexts/url/infrastructure/key-generator/counter-key-generator';

describe('CounterKeyGenerator', () => {
  let keyGenerator: CounterKeyGenerator;

  beforeEach(() => {
    keyGenerator = new CounterKeyGenerator();
  });

  it('generates a key', () => {
    const key = keyGenerator.generate();
    expect(key).toBeDefined();
  });

  it('generates a key with 6 or more characters', () => {
    const key = keyGenerator.generate();
    expect(key.length).toBeGreaterThanOrEqual(6);
  });

  it('generates unique keys for each call', () => {
    const key = keyGenerator.generate();
    const key2 = keyGenerator.generate();
    expect(key).not.toBe(key2);
  });
});
