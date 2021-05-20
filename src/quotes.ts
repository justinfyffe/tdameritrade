import { apiGet } from './client';
import { TDAmeritrade } from './tdameritrade';

export enum AssetType {
  Equity = 'EQUITY',
  Etf = 'ETF',
  Option = 'OPTION',
}

export interface OptionQuote {
  askPrice: number;
  askSize: number;
  assetMainType: AssetType.Option;
  assetType: AssetType.Option;
  bidPrice: number;
  bidSize: number;
  closePrice: number;
  contractType: string;
  cusip: string;
  daysToExpiration: number;
  delayed: boolean;
  deliverables: string;
  delta: number;
  description: string;
  digits: number;
  exchange: string;
  exchangeName: string;
  expirationDay: number;
  expirationMonth: number;
  expirationYear: number;
  gamma: number;
  highPrice: number;
  impliedYield: number;
  isPennyPilot: boolean;
  lastPrice: number;
  lastSize: number;
  lastTradingDay: number;
  lowPrice: number;
  mark: number;
  markChangeInDouble: number;
  markPercentChangeInDouble: number;
  moneyIntrinsicValue: number;
  multiplier: number;
  netChange: number;
  netPercentChangeInDouble: number;
  openInterest: number;
  openPrice: number;
  quoteTimeInLong: number;
  realtimeEntitled: boolean;
  rho: number;
  securityStatus: string;
  settlementType: string;
  strikePrice: number;
  symbol: string;
  theoreticalOptionValue: number;
  theta: number;
  timeValue: number;
  totalVolume: number;
  tradeTimeInLong: number;
  underlying: string;
  underlyingPrice: number;
  uvExpirationType: string;
  vega: number;
  volatility: number;
}

export interface EquityQuote {
  '52WkHigh': number;
  '52WkLow': number;
  askId: string;
  askPrice: number;
  askSize: number;
  assetMainType: AssetType.Equity;
  assetSubType?: AssetType.Etf;
  assetType: AssetType.Equity | AssetType.Etf;
  bidId: string;
  bidPrice: number;
  bidSize: number;
  bidTick: string;
  closePrice: number;
  cusip: string;
  delayed: boolean;
  description: string;
  digits: number;
  divAmount: number;
  divDate: string;
  divYield: number;
  exchange: string;
  exchangeName: string;
  highPrice: number;
  lastId: string;
  lastPrice: number;
  lastSize: number;
  lowPrice: number;
  marginable: boolean;
  mark: number;
  markChangeInDouble: number;
  markPercentChangeInDouble: number;
  nAV: number;
  netChange: number;
  netPercentChangeInDouble: number;
  openPrice: number;
  peRatio: number;
  quoteTimeInLong: number;
  realtimeEntitled: boolean;
  regularMarketLastPrice: number;
  regularMarketLastSize: number;
  regularMarketNetChange: number;
  regularMarketPercentChangeInDouble: number;
  regularMarketTradeTimeInLong: number;
  securityStatus: string;
  shortable: boolean;
  symbol: string;
  totalVolume: number;
  tradeTimeInLong: number;
  volatility: number;
}

export type Quote = OptionQuote | EquityQuote;

export interface GetQuotesResponse {
  [symbol: string]: Quote;
}

export async function getQuote(td: TDAmeritrade, symbol: string) {
  const response = await apiGet<Quote>(td, `marketdata/${symbol}/quotes`);

  return response.data;
}

export async function getQuotes(td: TDAmeritrade, symbols: string[]) {
  const response = await apiGet<GetQuotesResponse>(td, 'marketdata/quotes', {
    symbol: symbols.join(','),
  });

  return response.data;
}

export function isOptionQuote(quote: Quote): quote is OptionQuote {
  return quote.assetMainType === 'OPTION';
}

export function isEquityQuote(quote: Quote): quote is EquityQuote {
  return quote.assetMainType === 'EQUITY';
}
