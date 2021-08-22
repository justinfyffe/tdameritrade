import { Client } from './client';

export enum MoverChange {
  Percent = 'percent',
  Value = 'value',
}

export enum MoverDirection {
  Up = 'up',
  Down = 'down',
}

export interface Mover {
  change: number;
  description: string;
  direction: MoverDirection;
  last: number;
  symbol: string;
  totalVolume: number;
}

export interface MovementOptions {
  direction?: MoverDirection;
  change?: MoverChange;
}

export class MoverService {
  constructor(private client: Client) {}

  async get(index: string, movement?: MovementOptions) {
    const response = await this.client.get<Mover[]>(
      `marketdata/${index}/movers`,
      movement
    );
    return response?.data;
  }
}
