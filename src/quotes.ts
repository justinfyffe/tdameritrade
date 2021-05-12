import { apiGet } from './client';
import { TDAmeritrade } from './tdameritrade';

export interface MutualFundQuote {
  symbol: string;
  description: string;
  closePrice: number;
  netChange: number;
  totalVolume: number;
  tradeTimeInLong: number;
  exchange: string;
  exchangeName: string;
  digits: number;
  '52WkHigh': number;
  '52WkLow': number;
  nAV: number;
  peRatio: number;
  divAmount: number;
  divYield: number;
  divDate: string;
  securityStatus: string;
}

export interface FutureQuote {
  symbol: string;
  bidPriceInDouble: number;
  askPriceInDouble: number;
  lastPriceInDouble: number;
  bidId: string;
  askId: string;
  highPriceInDouble: number;
  lowPriceInDouble: number;
  closePriceInDouble: number;
  exchange: string;
  description: string;
  lastId: string;
  openPriceInDouble: number;
  changeInDouble: number;
  futurePercentChange: number;
  exchangeName: string;
  securityStatus: string;
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

export interface FutureOptionQuote {
  symbol: string;
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
  exchangeName: string;
  securityStatus: string;
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

export interface IndexQuote {
  symbol: string;
  description: string;
  lastPrice: number;
  openPrice: number;
  highPrice: number;
  lowPrice: number;
  closePrice: number;
  netChange: number;
  totalVolume: number;
  tradeTimeInLong: number;
  exchange: string;
  exchangeName: string;
  digits: number;
  '52WkHigh': number;
  '52WkLow': number;
  securityStatus: string;
}

export interface OptionQuote {
  symbol: string;
  description: string;
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
  securityStatus: string;
  theoreticalOptionValue: number;
  underlyingPrice: number;
  uvExpirationType: string;
  exchange: string;
  exchangeName: string;
  settlementType: string;
}

export interface ForexQuote {
  symbol: string;
  bidPriceInDouble: number;
  askPriceInDouble: number;
  lastPriceInDouble: number;
  highPriceInDouble: number;
  lowPriceInDouble: number;
  closePriceInDouble: number;
  exchange: string;
  description: string;
  openPriceInDouble: number;
  changeInDouble: number;
  percentChange: number;
  exchangeName: string;
  digits: number;
  securityStatus: string;
  tick: number;
  tickAmount: number;
  product: string;
  tradingHours: string;
  isTradable: boolean;
  '52WkHighInDouble': number;
  '52WkLowInDouble': number;
  mark: number;
}

export interface EquityQuote {
  symbol: string;
  description: string;
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
  exchangeName: string;
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
  securityStatus: string;
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

export function isMutualFundQuote(quote: Quote): quote is MutualFundQuote {
  return 'nAV' in quote;
}

export function isFutureQuote(quote: Quote): quote is FutureQuote {
  return (
    'futureMultiplier' in quote ||
    'futurePriceFormat' in quote ||
    'futureSettlementPrice' in quote ||
    'futureActiveSymbol' in quote
  );
}

export function isFutureOptionQuote(quote: Quote): quote is FutureOptionQuote {
  return 'contractType' in quote && 'futureExpirationDate' in quote;
}

export function isIndexQuote(quote: Quote): quote is IndexQuote {
  return (
    'totalVolume' in quote &&
    !isEquityQuote(quote) &&
    !isMutualFundQuote(quote) &&
    !isOptionQuote(quote)
  );
}

export function isOptionQuote(quote: Quote): quote is OptionQuote {
  return 'delta' in quote && !isFutureOptionQuote(quote);
}

export function isForexQuote(quote: Quote): quote is ForexQuote {
  return 'isTradable' in quote;
}

export function isEquityQuote(quote: Quote): quote is EquityQuote {
  return 'shortable' in quote;
}
