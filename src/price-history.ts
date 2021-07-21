import { apiGet } from './client';
import { TDAmeritrade } from './tdameritrade';

export enum PeriodType {
  Day = 'day',
  Month = 'month',
  Year = 'year',
  Ytd = 'ytd',
}

export enum FrequencyType {
  Minute = 'minute',
  Daily = 'daily',
  Weekly = 'weekly',
  Monthly = 'monthly',
}

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
  periodType?: PeriodType;
  period?: number;
  frequencyType?: FrequencyType;
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
