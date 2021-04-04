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
