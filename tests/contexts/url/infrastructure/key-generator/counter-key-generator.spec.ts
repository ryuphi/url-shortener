import { CounterKeyGenerator } from '../../../../../src/contexts/url/infrastructure/key-generator/counter-key-generator';

describe('CounterKeyGenerator', () => {
  let keyGenerator: CounterKeyGenerator;

  beforeEach(() => {
    keyGenerator = new CounterKeyGenerator();
  });

  it('generates a key', async () => {
    const key = await keyGenerator.generate();
    expect(key).toBeDefined();
  });

  it('generates a key with 6 or more characters', async () => {
    const key = await keyGenerator.generate();
    expect(key.length).toBeGreaterThanOrEqual(6);
  });

  it('generates unique keys for each call', async () => {
    const key = await keyGenerator.generate();
    const key2 = await keyGenerator.generate();
    expect(key).not.toBe(key2);
  });
});
