import { apiGet } from './client';
import { TDAmeritrade } from './tdameritrade';

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

export async function getMovers(
  td: TDAmeritrade,
  index: string,
  movement?: MovementOptions
) {
  const response = await apiGet<Mover[]>(
    td,
    `marketdata/${index}/movers`,
    movement
  );
  return response.data;
}
