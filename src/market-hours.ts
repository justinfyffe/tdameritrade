import { apiGet } from './client';
import { TDAmeritrade } from './tdameritrade';

export enum MarketType {
  Bond = 'BOND',
  Equity = 'EQUITY',
  ETF = 'ETF',
  Forex = 'FOREX',
  Future = 'FUTURE',
  FutureOptions = 'FUTURE_OPTIONS',
  Index = 'INDEX',
  Indicator = 'INDICATOR',
  MutualFund = 'MUTUAL_FUND',
  Option = 'OPTION',
  Unknown = 'UNKNOWN',
}

export interface MarketHours {
  category: string;
  date: string;
  exchange: string;
  isOpen: boolean;
  marketType: MarketType;
  product: string;
  productName: string;
  sessionHours: unknown;
}

export async function getMarketHours(
  td: TDAmeritrade,
  markets: MarketType | MarketType[],
  date: Date
) {
  const path = Array.isArray(markets)
    ? 'marketdata/hours'
    : `marketdata/${markets}/hours`;

  const query = Array.isArray(markets)
    ? { date: date.toISOString(), markets }
    : { date: date.toISOString() };

  const response = await apiGet<MarketHours | MarketHours[]>(td, path, query);
  return response.data;
}
