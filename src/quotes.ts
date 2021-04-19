import { Client } from './client';

export interface BaseQuoteData {
  symbol: string;
  description: string;
  exchangeName: string;
  securityStatus: string;
}

export interface MutualFundQuoteData extends BaseQuoteData {
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

export interface FutureQuoteData extends BaseQuoteData {
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

export interface FutureOptionQuoteData extends BaseQuoteData {
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

export interface IndexQuoteData extends BaseQuoteData {
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

export interface OptionQuoteData extends BaseQuoteData {
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

export interface ForexQuoteData extends BaseQuoteData {
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

export interface EquityQuoteData extends BaseQuoteData {
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

type QuoteData =
  | MutualFundQuoteData
  | FutureQuoteData
  | FutureOptionQuoteData
  | IndexQuoteData
  | OptionQuoteData
  | ForexQuoteData
  | EquityQuoteData;

export class QuoteClient {
  constructor(private client: Client) {}

  async getQuote(symbol: string) {
    const response = await this.client.get<QuoteData>(
      `marketdata/${symbol}/quotes`
    );

    return response.data;
  }

  async getQuotes(symbols: string[]) {
    const response = await this.client.get<QuoteData[]>('marketdata/quotes', {
      symbol: symbols.join(','),
    });

    return response.data;
  }
}

abstract class BaseQuote {
  constructor(
    protected data: BaseQuoteData,
    private quoteClient: QuoteClient
  ) {}

  get symbol() {
    return this.data.symbol;
  }

  get description() {
    return this.data.description;
  }

  get exchangeName() {
    return this.data.exchangeName;
  }

  get securityStatus() {
    return this.data.securityStatus;
  }

  toJson() {
    return { ...this.data } as BaseQuoteData;
  }

  async refresh() {
    this.data = await this.quoteClient.getQuote(this.symbol);
  }
}

export class MutualFundQuote extends BaseQuote {
  constructor(protected data: MutualFundQuoteData, quoteClient: QuoteClient) {
    super(data, quoteClient);
  }

  get closePrice() {
    return this.data.closePrice;
  }

  get netChange() {
    return this.data.netChange;
  }

  get totalVolume() {
    return this.data.totalVolume;
  }

  get tradeTimeInLong() {
    return this.data.tradeTimeInLong;
  }

  get exchange() {
    return this.data.exchange;
  }

  get digits() {
    return this.data.digits;
  }

  get '52WkHigh'() {
    return this.data['52WkHigh'];
  }

  get '52WkLow'() {
    return this.data['52WkLow'];
  }

  get nAV() {
    return this.data.nAV;
  }

  get peRatio() {
    return this.data.peRatio;
  }

  get divAmount() {
    return this.data.divAmount;
  }

  get divYield() {
    return this.data.divYield;
  }

  get divDate() {
    return this.data.divDate;
  }

  toJson() {
    return { ...this.data } as MutualFundQuoteData;
  }
}

export class FutureQuote extends BaseQuote {
  constructor(protected data: FutureQuoteData, quoteClient: QuoteClient) {
    super(data, quoteClient);
  }

  get bidPriceInDouble() {
    return this.data.bidPriceInDouble;
  }

  get askPriceInDouble() {
    return this.data.askPriceInDouble;
  }

  get lastPriceInDouble() {
    return this.data.lastPriceInDouble;
  }

  get bidId() {
    return this.data.bidId;
  }

  get askId() {
    return this.data.askId;
  }

  get highPriceInDouble() {
    return this.data.highPriceInDouble;
  }

  get lowPriceInDouble() {
    return this.data.lowPriceInDouble;
  }

  get closePriceInDouble() {
    return this.data.closePriceInDouble;
  }

  get exchange() {
    return this.data.exchange;
  }

  get lastId() {
    return this.data.lastId;
  }

  get openPriceInDouble() {
    return this.data.openPriceInDouble;
  }

  get changeInDouble() {
    return this.data.changeInDouble;
  }

  get futurePercentChange() {
    return this.data.futurePercentChange;
  }

  get openInterest() {
    return this.data.openInterest;
  }

  get mark() {
    return this.data.mark;
  }

  get tick() {
    return this.data.tick;
  }

  get tickAmount() {
    return this.data.tickAmount;
  }

  get product() {
    return this.data.product;
  }

  get futurePriceFormat() {
    return this.data.futurePriceFormat;
  }

  get futureTradingHours() {
    return this.data.futureTradingHours;
  }

  get futureIsTradable() {
    return this.data.futureIsTradable;
  }

  get futureMultiplier() {
    return this.data.futureMultiplier;
  }

  get futureIsActive() {
    return this.data.futureIsActive;
  }

  get futureSettlementPrice() {
    return this.data.futureSettlementPrice;
  }

  get futureActiveSymbol() {
    return this.data.futureActiveSymbol;
  }

  get futureExpirationDate() {
    return this.data.futureExpirationDate;
  }

  toJson() {
    return { ...this.data } as FutureQuoteData;
  }
}

export class FutureOptionQuote extends BaseQuote {
  constructor(protected data: FutureOptionQuoteData, quoteClient: QuoteClient) {
    super(data, quoteClient);
  }

  get bidPriceInDouble() {
    return this.data.bidPriceInDouble;
  }

  get askPriceInDouble() {
    return this.data.askPriceInDouble;
  }

  get lastPriceInDouble() {
    return this.data.lastPriceInDouble;
  }

  get highPriceInDouble() {
    return this.data.highPriceInDouble;
  }

  get lowPriceInDouble() {
    return this.data.lowPriceInDouble;
  }

  get closePriceInDouble() {
    return this.data.closePriceInDouble;
  }

  get description() {
    return this.data.description;
  }

  get openPriceInDouble() {
    return this.data.openPriceInDouble;
  }

  get netChangeInDouble() {
    return this.data.netChangeInDouble;
  }

  get openInterest() {
    return this.data.openInterest;
  }

  get volatility() {
    return this.data.volatility;
  }

  get moneyIntrinsicValueInDouble() {
    return this.data.moneyIntrinsicValueInDouble;
  }

  get multiplierInDouble() {
    return this.data.multiplierInDouble;
  }

  get digits() {
    return this.data.digits;
  }

  get strikePriceInDouble() {
    return this.data.strikePriceInDouble;
  }

  get contractType() {
    return this.data.contractType;
  }

  get underlying() {
    return this.data.underlying;
  }

  get timeValueInDouble() {
    return this.data.timeValueInDouble;
  }

  get deltaInDouble() {
    return this.data.deltaInDouble;
  }

  get gammaInDouble() {
    return this.data.gammaInDouble;
  }

  get thetaInDouble() {
    return this.data.thetaInDouble;
  }

  get vegaInDouble() {
    return this.data.vegaInDouble;
  }

  get rhoInDouble() {
    return this.data.rhoInDouble;
  }

  get mark() {
    return this.data.mark;
  }

  get tick() {
    return this.data.tick;
  }

  get tickAmount() {
    return this.data.tickAmount;
  }

  get futureIsTradable() {
    return this.data.futureIsTradable;
  }

  get futureTradingHours() {
    return this.data.futureTradingHours;
  }

  get futurePercentChange() {
    return this.data.futurePercentChange;
  }

  get futureIsActive() {
    return this.data.futureIsActive;
  }

  get futureExpirationDate() {
    return this.data.futureExpirationDate;
  }

  get expirationType() {
    return this.data.expirationType;
  }

  get exerciseType() {
    return this.data.exerciseType;
  }

  get inTheMoney() {
    return this.data.inTheMoney;
  }

  toJson() {
    return { ...this.data } as FutureOptionQuoteData;
  }
}

export class IndexQuote extends BaseQuote {
  constructor(protected data: IndexQuoteData, quoteClient: QuoteClient) {
    super(data, quoteClient);
  }

  get lastPrice() {
    return this.data.lastPrice;
  }

  get openPrice() {
    return this.data.openPrice;
  }

  get highPrice() {
    return this.data.highPrice;
  }

  get lowPrice() {
    return this.data.lowPrice;
  }

  get closePrice() {
    return this.data.closePrice;
  }

  get netChange() {
    return this.data.netChange;
  }

  get totalVolume() {
    return this.data.totalVolume;
  }

  get tradeTimeInLong() {
    return this.data.tradeTimeInLong;
  }

  get exchange() {
    return this.data.exchange;
  }

  get digits() {
    return this.data.digits;
  }

  get '52WkHigh'() {
    return this.data['52WkHigh'];
  }

  get '52WkLow'() {
    return this.data['52WkLow'];
  }

  toJson() {
    return { ...this.data } as IndexQuoteData;
  }
}

export class OptionQuote extends BaseQuote {
  constructor(protected data: OptionQuoteData, quoteClient: QuoteClient) {
    super(data, quoteClient);
  }

  get bidPrice() {
    return this.data.bidPrice;
  }

  get bidSize() {
    return this.data.bidSize;
  }

  get askPrice() {
    return this.data.askPrice;
  }

  get lastPrice() {
    return this.data.lastPrice;
  }

  get lastSize() {
    return this.data.lastSize;
  }

  get openPrice() {
    return this.data.openPrice;
  }

  get highPrice() {
    return this.data.highPrice;
  }

  get lowPrice() {
    return this.data.lowPrice;
  }

  get closePrice() {
    return this.data.closePrice;
  }

  get netChange() {
    return this.data.netChange;
  }

  get totalVolume() {
    return this.data.totalVolume;
  }

  get quoteTimeInLong() {
    return this.data.quoteTimeInLong;
  }

  get tradeTimeInLong() {
    return this.data.tradeTimeInLong;
  }

  get mark() {
    return this.data.mark;
  }

  get openInterest() {
    return this.data.openInterest;
  }

  get volatility() {
    return this.data.volatility;
  }

  get moneyIntrinsicValue() {
    return this.data.moneyIntrinsicValue;
  }

  get multiplier() {
    return this.data.multiplier;
  }

  get strikePrice() {
    return this.data.strikePrice;
  }

  get contractType() {
    return this.data.contractType;
  }

  get underlying() {
    return this.data.underlying;
  }

  get timeValue() {
    return this.data.timeValue;
  }

  get deliverables() {
    return this.data.deliverables;
  }

  get delta() {
    return this.data.delta;
  }

  get gamma() {
    return this.data.gamma;
  }

  get theta() {
    return this.data.theta;
  }

  get vega() {
    return this.data.vega;
  }

  get rho() {
    return this.data.rho;
  }

  get theoreticalOptionValue() {
    return this.data.theoreticalOptionValue;
  }

  get underlyingPrice() {
    return this.data.underlyingPrice;
  }

  get uvExpirationType() {
    return this.data.uvExpirationType;
  }

  get exchange() {
    return this.data.exchange;
  }

  get settlementType() {
    return this.data.settlementType;
  }

  toJson() {
    return { ...this.data } as OptionQuoteData;
  }
}

export class ForexQuote extends BaseQuote {
  constructor(protected data: ForexQuoteData, quoteClient: QuoteClient) {
    super(data, quoteClient);
  }

  get bidPriceInDouble() {
    return this.data.bidPriceInDouble;
  }

  get askPriceInDouble() {
    return this.data.askPriceInDouble;
  }

  get lastPriceInDouble() {
    return this.data.lastPriceInDouble;
  }

  get highPriceInDouble() {
    return this.data.highPriceInDouble;
  }

  get lowPriceInDouble() {
    return this.data.lowPriceInDouble;
  }

  get closePriceInDouble() {
    return this.data.closePriceInDouble;
  }

  get exchange() {
    return this.data.exchange;
  }

  get openPriceInDouble() {
    return this.data.openPriceInDouble;
  }

  get changeInDouble() {
    return this.data.changeInDouble;
  }

  get percentChange() {
    return this.data.percentChange;
  }

  get digits() {
    return this.data.digits;
  }

  get tick() {
    return this.data.tick;
  }

  get tickAmount() {
    return this.data.tickAmount;
  }

  get product() {
    return this.data.product;
  }

  get tradingHours() {
    return this.data.tradingHours;
  }

  get isTradable() {
    return this.data.isTradable;
  }

  get '52WkHighInDouble'() {
    return this.data['52WkHighInDouble'];
  }

  get '52WkLowInDouble'() {
    return this.data['52WkLowInDouble'];
  }

  get mark() {
    return this.data.mark;
  }

  toJson() {
    return { ...this.data } as ForexQuoteData;
  }
}

export class EquityQuote extends BaseQuote {
  constructor(protected data: EquityQuoteData, quoteClient: QuoteClient) {
    super(data, quoteClient);
  }

  get bidPrice() {
    return this.data.bidPrice;
  }

  get bidSize() {
    return this.data.bidSize;
  }

  get bidId() {
    return this.data.bidId;
  }

  get askPrice() {
    return this.data.askPrice;
  }

  get askSize() {
    return this.data.askSize;
  }

  get askId() {
    return this.data.askId;
  }

  get lastPrice() {
    return this.data.lastPrice;
  }

  get lastSize() {
    return this.data.lastSize;
  }

  get lastId() {
    return this.data.lastId;
  }

  get openPrice() {
    return this.data.openPrice;
  }

  get highPrice() {
    return this.data.highPrice;
  }

  get lowPrice() {
    return this.data.lowPrice;
  }

  get closePrice() {
    return this.data.closePrice;
  }

  get netChange() {
    return this.data.netChange;
  }

  get totalVolume() {
    return this.data.totalVolume;
  }

  get quoteTimeInLong() {
    return this.data.quoteTimeInLong;
  }

  get tradeTimeInLong() {
    return this.data.tradeTimeInLong;
  }

  get mark() {
    return this.data.mark;
  }

  get exchange() {
    return this.data.exchange;
  }

  get marginable() {
    return this.data.marginable;
  }

  get shortable() {
    return this.data.shortable;
  }

  get volatility() {
    return this.data.volatility;
  }

  get digits() {
    return this.data.digits;
  }

  get '52WkHigh'() {
    return this.data['52WkHigh'];
  }

  get '52WkLow'() {
    return this.data['52WkLow'];
  }

  get peRatio() {
    return this.data.peRatio;
  }

  get divAmount() {
    return this.data.divAmount;
  }

  get divYield() {
    return this.data.divYield;
  }

  get divDate() {
    return this.data.divDate;
  }

  get regularMarketLastPrice() {
    return this.data.regularMarketLastPrice;
  }

  get regularMarketLastSize() {
    return this.data.regularMarketLastSize;
  }

  get regularMarketNetChange() {
    return this.data.regularMarketNetChange;
  }

  get regularMarketTradeTimeInLong() {
    return this.data.regularMarketTradeTimeInLong;
  }

  toJson() {
    return { ...this.data } as EquityQuoteData;
  }
}

export function createQuoteInstance(data: QuoteData, quoteClient: QuoteClient) {
  // Mutual Fund
  if ('nAV' in data) {
    return new MutualFundQuote(data, quoteClient);
  }

  // Future Option
  if ('futureTradingHours' in data && 'volatility' in data) {
    return new FutureOptionQuote(data, quoteClient);
  }

  // Future
  if ('futureTradingHours' in data) {
    return new FutureQuote(data, quoteClient);
  }

  // Option
  if ('theoreticalOptionValue' in data) {
    return new OptionQuote(data, quoteClient);
  }

  // Forex
  if ('product' in data) {
    return new ForexQuote(data, quoteClient);
  }

  // Equity
  if ('marginable' in data) {
    return new EquityQuote(data, quoteClient);
  }

  // Index
  return new IndexQuote(data, quoteClient);
}

export function createQuotesInstances(
  data: QuoteData[],
  quoteClient: QuoteClient
) {
  return data.map((data) => createQuoteInstance(data, quoteClient));
}
