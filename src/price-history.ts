import { apiGet } from './client';
import { TDAmeritrade } from './tdameritrade';

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

export interface GetPriceHistoryOptions {
  periodType?: unknown;
  period?: number;
  frequencyType?: unknown;
  frequency?: number;
  endDate?: number;
  startDate?: number;
  needExtendedHoursData?: boolean;
}

export async function getPriceHistory(
  td: TDAmeritrade,
  symbol: string,
  options?: GetPriceHistoryOptions
) {
  const response = await apiGet<CandleList>(
    td,
    `marketdata/${symbol}/pricehistory`,
    options
  );

  return response?.data;
}
