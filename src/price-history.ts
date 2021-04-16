import { Client } from './client';

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

export class PriceHistoryClient {
  constructor(private client: Client) {}

  async getPriceHistory(symbol: string, options?: GetPriceHistoryOptions) {
    const response = await this.client.get<CandleList>(
      `marketdata/${symbol}/pricehistory`,
      options
    );

    return response.data;
  }
}
