import { CounterKeyGenerator } from '../../../../src/contexts/url/infrastructure/key-generator/counter-key-generator';

describe('CounterKeyGenerator', () => {
  it('generates a key', () => {
    const keyGenerator = new CounterKeyGenerator();
    const key = keyGenerator.generate();
    expect(key).toBeDefined();
  });

  it('generates a key with 6 or more characters', () => {
    const keyGenerator = new CounterKeyGenerator();
    const key = keyGenerator.generate();
    expect(key.length).toBeGreaterThanOrEqual(6);
  });

  it('generates unique keys for each call', () => {
    const keyGenerator = new CounterKeyGenerator();
    const key = keyGenerator.generate();
    const key2 = keyGenerator.generate();
    expect(key).not.toBe(key2);
  });
});
