import { Client } from './client';

export enum MarketType {
  Bond = 'bond',
  Equity = 'equity',
  Future = 'future',
  Forex = 'forex',
  Option = 'option',
}

export enum ProductType {
  Equity = 'EQ',
  EquityOption = 'EQO',
  IndexOption = 'IND',
}

export interface MarketHours {
  category: string;
  date: string;
  exchange: string;
  isOpen: boolean;
  marketType: MarketType;
  product: string;
  productName: string;
  sessionHours: MarketSessionHours;
}

export interface MarketSessionHours {
  preMarket?: MarketSessionDuration[];
  regularMarket: MarketSessionDuration[];
  postMarket?: MarketSessionDuration[];
}

export interface MarketSessionDuration {
  start: string;
  end: string;
}

export interface MarketHoursResponse {
  [marketType: string]: {
    [productType: string]: MarketHours;
  };
}

export class MarketHoursService {
  constructor(private client: Client) {}

  async get(markets: MarketType | MarketType[], date: Date) {
    const path = Array.isArray(markets)
      ? 'marketdata/hours'
      : `marketdata/${markets.toUpperCase()}/hours`;

    const query = Array.isArray(markets)
      ? {
          date: date.toISOString(),
          markets: markets.map((market) => market.toUpperCase()),
        }
      : { date: date.toISOString() };

    const response = await this.client.get<MarketHoursResponse>(path, query);
    return response?.data;
  }
}
