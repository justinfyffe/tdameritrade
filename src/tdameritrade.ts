import { Client } from './client';
import { Config, TDAmeritradeConfig } from './config';
import { EventEmitter, TDAmeritradeEvent } from './events';

export class TDAmeritrade {
  private emitter: EventEmitter;
  private config: Config;
  private client: Client;

  constructor(config: TDAmeritradeConfig) {
    this.emitter = new EventEmitter();

    this.config = new Config(config);
    this.client = new Client(this.emitter, this.config);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  on(event: TDAmeritradeEvent, fn: (...args: any[]) => void, context?: any) {
    this.emitter.on(event, fn, context);
  }

  async getAccounts() {}

  async getAccount(accountId: string) {}
}
