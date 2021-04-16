import { Client } from './client';

export enum MoverDirection {
  Up = 'up',
  Down = 'down',
}

export enum MoverChange {
  Percent = 'percent',
  Value = 'value',
}

export interface Mover {
  change: number;
  description: string;
  direction: MoverDirection;
  last: number;
  symbol: string;
  totalVolume: number;
}

export interface GetMoversOptions {
  direction?: MoverDirection;
  change?: MoverChange;
}

export class MoverClient {
  constructor(private client: Client) {}

  async getMovers(index: string, options?: GetMoversOptions) {
    const response = await this.client.get<Mover[]>(
      `marketdata/${index}/movers`,
      options
    );
    return response.data;
  }
}
