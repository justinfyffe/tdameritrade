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
