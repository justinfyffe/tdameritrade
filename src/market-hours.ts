import { Client } from './client';

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

export interface MarketHoursData {
  category: string;
  date: string;
  exchange: string;
  isOpen: boolean;
  marketType: MarketType;
  product: string;
  productName: string;
  sessionHours: unknown;
}

export class MarketHoursClient {
  constructor(private client: Client) {}

  async getHours(markets: MarketType | MarketType[], date: string) {
    const path = Array.isArray(markets)
      ? 'marketdata/hours'
      : `marketdata/${markets}/hours`;

    const options = Array.isArray(markets) ? { date, markets } : { date };

    const response = await this.client.get<MarketHoursData | MarketHoursData[]>(
      path,
      options
    );
    return response.data;
  }
}

export class MarketHours {
  constructor(
    protected data: MarketHoursData,
    private marketHoursClient: MarketHoursClient
  ) {}

  get category() {
    return this.data.category;
  }

  get date() {
    return this.data.date;
  }

  get exchange() {
    return this.data.exchange;
  }

  get isOpen() {
    return this.data.isOpen;
  }

  get marketType() {
    return this.data.marketType;
  }

  get product() {
    return this.data.product;
  }

  get productName() {
    return this.data.productName;
  }

  get sessionHours() {
    return this.data.sessionHours;
  }

  toJson() {
    return { ...this.data } as MarketHoursData;
  }

  async refresh() {
    this.data = (await this.marketHoursClient.getHours(
      this.marketType,
      this.date
    )) as MarketHoursData;
  }
}

export function createMarketHoursInstance(
  data: MarketHoursData,
  marketHoursClient: MarketHoursClient
) {
  return new MarketHours(data, marketHoursClient);
}

export function createMarketHoursInstances(
  data: MarketHoursData[],
  marketHoursClient: MarketHoursClient
) {
  return data.map((data) => new MarketHours(data, marketHoursClient));
}
