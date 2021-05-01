import { apiGet } from './client';
import { TDAmeritrade } from './tdameritrade';

export interface BaseQuote {
  symbol: string;
  description: string;
  exchangeName: string;
  securityStatus: string;
}

export interface MutualFundQuote extends BaseQuote {
  closePrice: number;
  netChange: number;
  totalVolume: number;
  tradeTimeInLong: number;
  exchange: string;
  digits: number;
  '52WkHigh': number;
  '52WkLow': number;
  nAV: number;
  peRatio: number;
  divAmount: number;
  divYield: number;
  divDate: string;
}

export interface FutureQuote extends BaseQuote {
  bidPriceInDouble: number;
  askPriceInDouble: number;
  lastPriceInDouble: number;
  bidId: string;
  askId: string;
  highPriceInDouble: number;
  lowPriceInDouble: number;
  closePriceInDouble: number;
  exchange: string;
  lastId: string;
  openPriceInDouble: number;
  changeInDouble: number;
  futurePercentChange: number;
  openInterest: number;
  mark: number;
  tick: number;
  tickAmount: number;
  product: string;
  futurePriceFormat: string;
  futureTradingHours: string;
  futureIsTradable: boolean;
  futureMultiplier: number;
  futureIsActive: boolean;
  futureSettlementPrice: number;
  futureActiveSymbol: string;
  futureExpirationDate: string;
}

export interface FutureOptionQuote extends BaseQuote {
  bidPriceInDouble: number;
  askPriceInDouble: number;
  lastPriceInDouble: number;
  highPriceInDouble: number;
  lowPriceInDouble: number;
  closePriceInDouble: number;
  description: string;
  openPriceInDouble: number;
  netChangeInDouble: number;
  openInterest: number;
  volatility: number;
  moneyIntrinsicValueInDouble: number;
  multiplierInDouble: number;
  digits: number;
  strikePriceInDouble: number;
  contractType: string;
  underlying: string;
  timeValueInDouble: number;
  deltaInDouble: number;
  gammaInDouble: number;
  thetaInDouble: number;
  vegaInDouble: number;
  rhoInDouble: number;
  mark: number;
  tick: number;
  tickAmount: number;
  futureIsTradable: boolean;
  futureTradingHours: string;
  futurePercentChange: number;
  futureIsActive: boolean;
  futureExpirationDate: number;
  expirationType: string;
  exerciseType: string;
  inTheMoney: boolean;
}

export interface IndexQuote extends BaseQuote {
  lastPrice: number;
  openPrice: number;
  highPrice: number;
  lowPrice: number;
  closePrice: number;
  netChange: number;
  totalVolume: number;
  tradeTimeInLong: number;
  exchange: string;
  digits: number;
  '52WkHigh': number;
  '52WkLow': number;
}

export interface OptionQuote extends BaseQuote {
  bidPrice: number;
  bidSize: number;
  askPrice: number;
  lastPrice: number;
  lastSize: number;
  openPrice: number;
  highPrice: number;
  lowPrice: number;
  closePrice: number;
  netChange: number;
  totalVolume: number;
  quoteTimeInLong: number;
  tradeTimeInLong: number;
  mark: number;
  openInterest: number;
  volatility: number;
  moneyIntrinsicValue: number;
  multiplier: number;
  strikePrice: number;
  contractType: string;
  underlying: string;
  timeValue: number;
  deliverables: string;
  delta: number;
  gamma: number;
  theta: number;
  vega: number;
  rho: number;
  theoreticalOptionValue: number;
  underlyingPrice: number;
  uvExpirationType: string;
  exchange: string;
  settlementType: string;
}

export interface ForexQuote extends BaseQuote {
  bidPriceInDouble: number;
  askPriceInDouble: number;
  lastPriceInDouble: number;
  highPriceInDouble: number;
  lowPriceInDouble: number;
  closePriceInDouble: number;
  exchange: string;
  openPriceInDouble: number;
  changeInDouble: number;
  percentChange: number;
  digits: number;
  tick: number;
  tickAmount: number;
  product: string;
  tradingHours: string;
  isTradable: boolean;
  '52WkHighInDouble': number;
  '52WkLowInDouble': number;
  mark: number;
}

export interface EquityQuote extends BaseQuote {
  bidPrice: number;
  bidSize: number;
  bidId: string;
  askPrice: number;
  askSize: number;
  askId: string;
  lastPrice: number;
  lastSize: number;
  lastId: string;
  openPrice: number;
  highPrice: number;
  lowPrice: number;
  closePrice: number;
  netChange: number;
  totalVolume: number;
  quoteTimeInLong: number;
  tradeTimeInLong: number;
  mark: number;
  exchange: string;
  marginable: boolean;
  shortable: boolean;
  volatility: number;
  digits: number;
  '52WkHigh': number;
  '52WkLow': number;
  peRatio: number;
  divAmount: number;
  divYield: number;
  divDate: string;
  regularMarketLastPrice: number;
  regularMarketLastSize: number;
  regularMarketNetChange: number;
  regularMarketTradeTimeInLong: number;
}

type Quote =
  | MutualFundQuote
  | FutureQuote
  | FutureOptionQuote
  | IndexQuote
  | OptionQuote
  | ForexQuote
  | EquityQuote;

export async function getQuote(td: TDAmeritrade, symbol: string) {
  const response = await apiGet<Quote>(td, `marketdata/${symbol}/quotes`);

  return response.data;
}

export async function getQuotes(td: TDAmeritrade, symbols: string[]) {
  const response = await await apiGet<Quote[]>(td, 'marketdata/quotes', {
    symbol: symbols.join(','),
  });

  return response.data;
}
