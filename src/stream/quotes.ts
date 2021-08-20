import { EventEmitter2 } from 'eventemitter2';
import { Client } from './client';

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
  IslandBid = 19,
  IslandAsk = 20,
  IslandVolume = 21,
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
  IslandBidsize = 35,
  IslandAskSize = 36,
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
  TradetimeInLong = 51,
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

export enum QuotesEvent {
  EquityQuote = 'equity-quote',
  OptionQuote = 'option-quote',
}

interface EquityQuoteResponse {}

interface OptionQuoteResponse {}

interface EquityQuoteOptions {
  symbols: string[];
}

interface OptionQuoteOptions {
  symbols: string[];
}

export class Quotes {
  private emitter = new EventEmitter2();

  constructor(private client: Client) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  on(event: QuotesEvent, fn: (...args: any[]) => void | Promise<void>) {
    this.emitter.on(event, fn);
  }

  subscribeToEquityQuotes(options: EquityQuoteOptions) {
    const fields = Object.values(EquityQuoteFields).filter(
      (value) => typeof value === 'number'
    );

    this.client.send(
      {
        service: 'QUOTE',
        command: 'SUBS',
        parameters: {
          keys: options.symbols.map((symbol) => symbol.toUpperCase()).join(','),
          fields: fields.join(','),
        },
      },
      async (response: EquityQuoteResponse) => {
        const result = await this.adaptEquityQuote(response);
        await this.emitter.emitAsync(QuotesEvent.EquityQuote, result);
      }
    );
  }

  subscribeToOptionQuotes(options: OptionQuoteOptions) {
    const fields = Object.values(OptionQuoteFields).filter(
      (value) => typeof value === 'number'
    );

    this.client.send(
      {
        service: 'OPTION',
        command: 'SUBS',
        parameters: {
          keys: options.symbols.map((symbol) => symbol.toUpperCase()).join(','),
          fields: fields.join(','),
        },
      },
      async (response: OptionQuoteResponse) => {
        const result = await this.adaptOptionQuote(response);
        await this.emitter.emitAsync(QuotesEvent.OptionQuote, result);
      }
    );
  }

  private async adaptEquityQuote(content: EquityQuoteResponse) {
    return content;
  }

  private async adaptOptionQuote(content: OptionQuoteResponse) {
    return content;
  }
}
