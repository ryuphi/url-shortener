import { KeyGenerator } from '../../domain/key-generator/key-generator';
import { Worker } from 'snowflake-uuid';

export class SnowflakeKeyGenerator implements KeyGenerator {
  // @ts-ignore
  localCounter: bigint = 0n;
  constructor(
    private workerId?: number | undefined,
    private dataCenterId?: number | undefined
  ) {}

  async generate(): Promise<string> {
    // it's a bit hacky, to use the snowflake-uuid library to generate a snowflake id
    // when you have many calls to this function in the same millisecond, the localCounter
    // will be incremented, and the snowflake id will be unique
    this.localCounter++;

    const worker = new Worker(this.workerId, this.dataCenterId, {
      sequence: this.localCounter
    });

    return worker.nextId().toString();
  }
}
