export interface Candle {
  close: number;
  datetime: number;
  high: number;
  low: number;
  open: number;
  volume: number;
}

export interface CandleList {
  candles: Candle[];
  empty: boolean;
  symbol: string;
}
