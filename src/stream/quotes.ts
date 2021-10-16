import { EventEmitter2 } from 'eventemitter2';
import { Client } from './client';

interface EquityQuote {
  symbol: string;
  bidPrice: number;
  askPrice: number;
  lastPrice: number;
  bidSize: number;
  askSize: number;
  bidId: string;
  askId: string;
  totalVolume: number;
  lastSize: number;
  tradeTime: number;
  quoteTime: number;
  highPrice: number;
  lowPrice: number;
  bidTick: string;
  closePrice: number;
  exchangeId: string;
  marginable: boolean;
  shortable: boolean;
  quoteDay: number;
  tradeDay: number;
  volatility: number;
  description: string;
  lastId: string;
  digits: number;
  openPrice: number;
  netChange: number;
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
  peRatio: number;
  dividendAmount: number;
  dividendYield: number;
  nav: number;
  fundPrice: number;
  exchangeName: string;
  dividendDate: string;
  regularMarketQuote: boolean;
  regularMarketTrade: boolean;
  regularMarketLastPrice: number;
  regularMarketLastSize: number;
  regularMarketTradeTime: number;
  regularMarketTradeDay: number;
  regularMarketNetChange: number;
  securityStatus: string;
  mark: number;
  quoteTimeInLong: number;
  tradeTimeInLong: number;
  regularMarketTradeTimeInLong: number;
}

interface OptionQuote {
  symbol: string;
  description: string;
  bidPrice: number;
  askPrice: number;
  lastPrice: number;
  highPrice: number;
  lowPrice: number;
  closePrice: number;
  totalVolume: number;
  openInterest: number;
  volatility: number;
  quoteTime: number;
  tradeTime: number;
  quoteDay: number;
  tradeDay: number;
  expirationYear: number;
  multiplier: number;
  digits: number;
  openPrice: number;
  bidSize: number;
  askSize: number;
  lastSize: number;
  netChange: number;
  strikePrice: number;
  contractType: string;
  underlying: string;
  expirationMonth: number;
  daysToExpiration: number;
  delta: number;
  gamma: number;
  theta: number;
  vega: number;
  rho: number;
  securityStatus: string;
  theoreticalOptionValue: number;
  underlyingPrice: number;
  uvExpirationType: string;
  mark: number;
}

enum EquityQuoteFields {
  Symbol = 0,
  BidPrice = 1,
  AskPrice = 2,
  LastPrice = 3,
  BidSize = 4,
  AskSize = 5,
  AskId = 6,
  BidId = 7,
  TotalVolume = 8,
  LastSize = 9,
  TradeTime = 10,
  QuoteTime = 11,
  HighPrice = 12,
  LowPrice = 13,
  BidTick = 14,
  ClosePrice = 15,
  ExchangeId = 16,
  Marginable = 17,
  Shortable = 18,
  QuoteDay = 22,
  TradeDay = 23,
  Volatility = 24,
  Description = 25,
  LastId = 26,
  Digits = 27,
  OpenPrice = 28,
  NetChange = 29,
  FiftyTwoWeekHigh = 30,
  FiftyTwoWeekLow = 31,
  PeRatio = 32,
  DividendAmount = 33,
  DividendYield = 34,
  Nav = 37,
  FundPrice = 38,
  ExchangeName = 39,
  DividendDate = 40,
  RegularMarketQuote = 41,
  RegularMarketTrade = 42,
  RegularMarketLastPrice = 43,
  RegularMarketLastSize = 44,
  RegularMarketTradeTime = 45,
  RegularMarketTradeDay = 46,
  RegularMarketNetChange = 47,
  SecurityStatus = 48,
  Mark = 49,
  QuoteTimeInLong = 50,
  TradeTimeInLong = 51,
  RegularMarketTradeTimeInLong = 52,
}

enum OptionQuoteFields {
  Symbol = 0,
  Description = 1,
  BidPrice = 2,
  AskPrice = 3,
  LastPrice = 4,
  HighPrice = 5,
  LowPrice = 6,
  ClosePrice = 7,
  TotalVolume = 8,
  OpenInterest = 9,
  Volatility = 10,
  QuoteTime = 11,
  TradeTime = 12,
  MoneyIntrinsicValue = 13,
  QuoteDay = 14,
  TradeDay = 15,
  ExpirationYear = 16,
  Multiplier = 17,
  Digits = 18,
  OpenPrice = 19,
  BidSize = 20,
  AskSize = 21,
  LastSize = 22,
  NetChange = 23,
  StrikePrice = 24,
  ContractType = 25,
  Underlying = 26,
  ExpirationMonth = 27,
  Deliverables = 28,
  TimeValue = 29,
  ExpirationDay = 30,
  DaysToExpiration = 31,
  Delta = 32,
  Gamma = 33,
  Theta = 34,
  Vega = 35,
  Rho = 36,
  SecurityStatus = 37,
  TheoreticalOptionValue = 38,
  UnderlyingPrice = 39,
  UvExpirationType = 40,
  Mark = 41,
}

enum QuoteEvent {
  EquityQuote = 'equity-quote',
  OptionQuote = 'option-quote',
}

interface EquityQuoteData {
  key: string;
  [EquityQuoteFields.BidPrice]: number;
  [EquityQuoteFields.AskPrice]: number;
  [EquityQuoteFields.LastPrice]: number;
  [EquityQuoteFields.BidSize]: number;
  [EquityQuoteFields.AskSize]: number;
  [EquityQuoteFields.AskId]: string;
  [EquityQuoteFields.BidId]: string;
  [EquityQuoteFields.TotalVolume]: number;
  [EquityQuoteFields.LastSize]: number;
  [EquityQuoteFields.TradeTime]: number;
  [EquityQuoteFields.QuoteTime]: number;
  [EquityQuoteFields.HighPrice]: number;
  [EquityQuoteFields.LowPrice]: number;
  [EquityQuoteFields.BidTick]: string;
  [EquityQuoteFields.ClosePrice]: number;
  [EquityQuoteFields.ExchangeId]: string;
  [EquityQuoteFields.Marginable]: boolean;
  [EquityQuoteFields.Shortable]: boolean;
  [EquityQuoteFields.QuoteDay]: number;
  [EquityQuoteFields.TradeDay]: number;
  [EquityQuoteFields.Volatility]: number;
  [EquityQuoteFields.Description]: string;
  [EquityQuoteFields.LastId]: string;
  [EquityQuoteFields.Digits]: number;
  [EquityQuoteFields.OpenPrice]: number;
  [EquityQuoteFields.NetChange]: number;
  [EquityQuoteFields.FiftyTwoWeekHigh]: number;
  [EquityQuoteFields.FiftyTwoWeekLow]: number;
  [EquityQuoteFields.PeRatio]: number;
  [EquityQuoteFields.DividendAmount]: number;
  [EquityQuoteFields.DividendYield]: number;
  [EquityQuoteFields.Nav]: number;
  [EquityQuoteFields.FundPrice]: number;
  [EquityQuoteFields.ExchangeName]: string;
  [EquityQuoteFields.DividendDate]: string;
  [EquityQuoteFields.RegularMarketQuote]: boolean;
  [EquityQuoteFields.RegularMarketTrade]: boolean;
  [EquityQuoteFields.RegularMarketLastPrice]: number;
  [EquityQuoteFields.RegularMarketLastSize]: number;
  [EquityQuoteFields.RegularMarketTradeTime]: number;
  [EquityQuoteFields.RegularMarketTradeDay]: number;
  [EquityQuoteFields.RegularMarketNetChange]: number;
  [EquityQuoteFields.SecurityStatus]: string;
  [EquityQuoteFields.Mark]: number;
  [EquityQuoteFields.QuoteTimeInLong]: number;
  [EquityQuoteFields.TradeTimeInLong]: number;
  [EquityQuoteFields.RegularMarketTradeTimeInLong]: number;
}

interface OptionQuoteData {
  key: string;
  [OptionQuoteFields.Description]: string;
  [OptionQuoteFields.BidPrice]: number;
  [OptionQuoteFields.AskPrice]: number;
  [OptionQuoteFields.LastPrice]: number;
  [OptionQuoteFields.HighPrice]: number;
  [OptionQuoteFields.LowPrice]: number;
  [OptionQuoteFields.ClosePrice]: number;
  [OptionQuoteFields.TotalVolume]: number;
  [OptionQuoteFields.OpenInterest]: number;
  [OptionQuoteFields.Volatility]: number;
  [OptionQuoteFields.QuoteTime]: number;
  [OptionQuoteFields.TradeTime]: number;
  [OptionQuoteFields.MoneyIntrinsicValue]: number;
  [OptionQuoteFields.QuoteDay]: number;
  [OptionQuoteFields.TradeDay]: number;
  [OptionQuoteFields.ExpirationYear]: number;
  [OptionQuoteFields.Multiplier]: number;
  [OptionQuoteFields.Digits]: number;
  [OptionQuoteFields.OpenPrice]: number;
  [OptionQuoteFields.BidSize]: number;
  [OptionQuoteFields.AskSize]: number;
  [OptionQuoteFields.LastSize]: number;
  [OptionQuoteFields.NetChange]: number;
  [OptionQuoteFields.StrikePrice]: number;
  [OptionQuoteFields.ContractType]: string;
  [OptionQuoteFields.Underlying]: string;
  [OptionQuoteFields.ExpirationMonth]: number;
  [OptionQuoteFields.Deliverables]: string;
  [OptionQuoteFields.TimeValue]: number;
  [OptionQuoteFields.ExpirationDay]: number;
  [OptionQuoteFields.DaysToExpiration]: number;
  [OptionQuoteFields.Delta]: number;
  [OptionQuoteFields.Gamma]: number;
  [OptionQuoteFields.Theta]: number;
  [OptionQuoteFields.Vega]: number;
  [OptionQuoteFields.Rho]: number;
  [OptionQuoteFields.SecurityStatus]: string;
  [OptionQuoteFields.TheoreticalOptionValue]: number;
  [OptionQuoteFields.UnderlyingPrice]: number;
  [OptionQuoteFields.UvExpirationType]: string;
  [OptionQuoteFields.Mark]: number;
}

interface EquityQuoteOptions {
  symbols: string[];
}

interface OptionQuoteOptions {
  symbols: string[];
}

export class Quotes {
  private emitter = new EventEmitter2();

  constructor(private client: Client) {
    this.setupEmitter();
  }

  // Events

  onEquityQuote(fn: (quote: EquityQuote) => void | Promise<void>) {
    this.emitter.on(QuoteEvent.EquityQuote, fn);
  }

  onOptionQuote(fn: (quote: OptionQuote) => void | Promise<void>) {
    this.emitter.on(QuoteEvent.OptionQuote, fn);
  }

  // Stream Operations

  subscribeToEquityQuotes(options: EquityQuoteOptions) {
    const fields = Object.values(EquityQuoteFields).filter(
      (value) => typeof value === 'number'
    );

    this.client.send({
      service: 'QUOTE',
      command: 'SUBS',
      parameters: {
        keys: options.symbols.map((symbol) => symbol.toUpperCase()).join(','),
        fields: fields.join(','),
      },
    });
  }

  subscribeToOptionQuotes(options: OptionQuoteOptions) {
    const fields = Object.values(OptionQuoteFields).filter(
      (value) => typeof value === 'number'
    );

    this.client.send({
      service: 'OPTION',
      command: 'SUBS',
      parameters: {
        keys: options.symbols.map((symbol) => symbol.toUpperCase()).join(','),
        fields: fields.join(','),
      },
    });
  }

  // Adapters

  private adaptEquityQuote(content: EquityQuoteData): EquityQuote {
    return {
      symbol: content.key,
      bidPrice: content[EquityQuoteFields.BidPrice],
      askPrice: content[EquityQuoteFields.AskPrice],
      lastPrice: content[EquityQuoteFields.LastPrice],
      bidSize: content[EquityQuoteFields.BidSize],
      askSize: content[EquityQuoteFields.AskSize],
      bidId: content[EquityQuoteFields.BidId],
      askId: content[EquityQuoteFields.AskId],
      totalVolume: content[EquityQuoteFields.TotalVolume],
      lastSize: content[EquityQuoteFields.LastSize],
      tradeTime: content[EquityQuoteFields.TradeTime],
      quoteTime: content[EquityQuoteFields.QuoteTime],
      highPrice: content[EquityQuoteFields.HighPrice],
      lowPrice: content[EquityQuoteFields.LowPrice],
      bidTick: content[EquityQuoteFields.BidTick],
      closePrice: content[EquityQuoteFields.ClosePrice],
      exchangeId: content[EquityQuoteFields.ExchangeId],
      marginable: content[EquityQuoteFields.Marginable],
      shortable: content[EquityQuoteFields.Shortable],
      quoteDay: content[EquityQuoteFields.QuoteDay],
      tradeDay: content[EquityQuoteFields.TradeDay],
      volatility: content[EquityQuoteFields.Volatility],
      description: content[EquityQuoteFields.Description],
      lastId: content[EquityQuoteFields.LastId],
      digits: content[EquityQuoteFields.Digits],
      openPrice: content[EquityQuoteFields.OpenPrice],
      netChange: content[EquityQuoteFields.NetChange],
      fiftyTwoWeekHigh: content[EquityQuoteFields.FiftyTwoWeekHigh],
      fiftyTwoWeekLow: content[EquityQuoteFields.FiftyTwoWeekLow],
      peRatio: content[EquityQuoteFields.PeRatio],
      dividendAmount: content[EquityQuoteFields.DividendAmount],
      dividendYield: content[EquityQuoteFields.DividendYield],
      nav: content[EquityQuoteFields.Nav],
      fundPrice: content[EquityQuoteFields.FundPrice],
      exchangeName: content[EquityQuoteFields.ExchangeName],
      dividendDate: content[EquityQuoteFields.DividendDate],
      regularMarketQuote: content[EquityQuoteFields.RegularMarketQuote],
      regularMarketTrade: content[EquityQuoteFields.RegularMarketTrade],
      regularMarketLastPrice: content[EquityQuoteFields.RegularMarketLastPrice],
      regularMarketLastSize: content[EquityQuoteFields.RegularMarketLastSize],
      regularMarketTradeTime: content[EquityQuoteFields.RegularMarketTradeTime],
      regularMarketTradeDay: content[EquityQuoteFields.RegularMarketTradeDay],
      regularMarketNetChange: content[EquityQuoteFields.RegularMarketNetChange],
      securityStatus: content[EquityQuoteFields.SecurityStatus],
      mark: content[EquityQuoteFields.Mark],
      quoteTimeInLong: content[EquityQuoteFields.QuoteTimeInLong],
      tradeTimeInLong: content[EquityQuoteFields.TradeTimeInLong],
      regularMarketTradeTimeInLong:
        content[EquityQuoteFields.RegularMarketTradeTimeInLong],
    };
  }

  private adaptOptionQuote(content: OptionQuoteData): OptionQuote {
    return {
      symbol: content.key,
      description: content[OptionQuoteFields.Description],
      bidPrice: content[OptionQuoteFields.BidPrice],
      askPrice: content[OptionQuoteFields.AskPrice],
      lastPrice: content[OptionQuoteFields.LastPrice],
      highPrice: content[OptionQuoteFields.HighPrice],
      lowPrice: content[OptionQuoteFields.LowPrice],
      closePrice: content[OptionQuoteFields.ClosePrice],
      totalVolume: content[OptionQuoteFields.TotalVolume],
      openInterest: content[OptionQuoteFields.OpenInterest],
      volatility: content[OptionQuoteFields.Volatility],
      quoteTime: content[OptionQuoteFields.QuoteTime],
      tradeTime: content[OptionQuoteFields.TradeTime],
      quoteDay: content[OptionQuoteFields.QuoteDay],
      tradeDay: content[OptionQuoteFields.TradeDay],
      expirationYear: content[OptionQuoteFields.ExpirationYear],
      multiplier: content[OptionQuoteFields.Multiplier],
      digits: content[OptionQuoteFields.Digits],
      openPrice: content[OptionQuoteFields.OpenPrice],
      bidSize: content[OptionQuoteFields.BidSize],
      askSize: content[OptionQuoteFields.AskSize],
      lastSize: content[OptionQuoteFields.LastSize],
      netChange: content[OptionQuoteFields.NetChange],
      strikePrice: content[OptionQuoteFields.StrikePrice],
      contractType: content[OptionQuoteFields.ContractType],
      underlying: content[OptionQuoteFields.Underlying],
      expirationMonth: content[OptionQuoteFields.ExpirationMonth],
      daysToExpiration: content[OptionQuoteFields.DaysToExpiration],
      delta: content[OptionQuoteFields.Delta],
      gamma: content[OptionQuoteFields.Gamma],
      theta: content[OptionQuoteFields.Theta],
      vega: content[OptionQuoteFields.Vega],
      rho: content[OptionQuoteFields.Rho],
      securityStatus: content[OptionQuoteFields.SecurityStatus],
      theoreticalOptionValue: content[OptionQuoteFields.TheoreticalOptionValue],
      underlyingPrice: content[OptionQuoteFields.UnderlyingPrice],
      uvExpirationType: content[OptionQuoteFields.UvExpirationType],
      mark: content[OptionQuoteFields.Mark],
    };
  }

  // Utilities

  private setupEmitter() {
    this.client.onData('QUOTE', 'SUBS', async (data: EquityQuoteData[]) => {
      data.forEach(async (raw) => {
        const result = this.adaptEquityQuote(raw);
        await this.emitter.emitAsync(QuoteEvent.EquityQuote, result);
      });
    });

    this.client.onData('OPTION', 'SUBS', async (data: OptionQuoteData[]) => {
      data.forEach(async (raw) => {
        const result = this.adaptOptionQuote(raw);
        await this.emitter.emitAsync(QuoteEvent.OptionQuote, result);
      });
    });
  }
}
