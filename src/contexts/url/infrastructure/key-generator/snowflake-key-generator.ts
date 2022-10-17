import { KeyGenerator } from '../../domain/key-generator/key-generator';
import { Worker } from 'snowflake-uuid';

export class SnowflakeKeyGenerator implements KeyGenerator {
  worker: Worker;
  constructor(
    private workerId?: number | undefined,
    private dataCenterId?: number | undefined
  ) {
    this.worker = new Worker(this.workerId, this.dataCenterId);
  }

  generate(): string {
    return this.worker.nextId().toString();
  }
}
