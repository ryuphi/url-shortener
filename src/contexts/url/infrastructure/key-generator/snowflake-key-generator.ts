import { KeyGenerator } from '../../domain/key-generator/key-generator';
import { Worker } from 'snowflake-uuid';

export class SnowflakeKeyGenerator implements KeyGenerator {
  worker: Worker;
  delay = 1; // 1ms delay to avoid collisions... this is only because nodejs work until millisecond precision..
  constructor(
    private workerId?: number | undefined,
    private dataCenterId?: number | undefined
  ) {
    this.worker = new Worker(this.workerId, this.dataCenterId);
  }

  async generate(): Promise<string> {
    const currentTimestamp = Date.now();
    if (this.worker.lastTimestamp === BigInt(currentTimestamp)) {
      return new Promise(resolve =>
        setTimeout(() => resolve(this.worker.nextId().toString()), this.delay)
      );
    }
    return this.worker.nextId().toString();
  }
}
