import { Client } from './client';

export enum OptionStrategy {
  Single = 'SINGLE',
  Analytical = 'ANALYTICAL',
  Covered = 'COVERED',
  Vertical = 'VERTICAL',
  Calendar = 'CALENDAR',
  Strangle = 'STRANGLE',
  Straddle = 'STRADDLE',
  Butterfly = 'BUTTERFLY',
  Condor = 'CONDOR',
  Diagonal = 'DIAGONAL',
  Collar = 'COLLAR',
  Roll = 'ROLL',
}

export enum OptionType {
  All = 'ALL',
  Call = 'CALL',
  Put = 'PUT',
}

export enum OptionRange {
  All = 'ALL',
  InTheMoney = 'ITM',
  NearTheMoney = 'NTM',
  OutOfTheMoney = 'OTM',
  StrikesAboveMarket = 'SAK',
  StrikesBelowMarket = 'SBM',
  StrikesNearMarket = 'SNK',
}

export enum OptionMonth {
  All = 'ALL',
  January = 'JAN',
  February = 'FEB',
  March = 'MAR',
  April = 'APR',
  May = 'MAY',
  June = 'JUN',
  July = 'JUL',
  August = 'AUG',
  September = 'SEP',
  October = 'OCT',
  November = 'NOV',
  December = 'DEC',
}

export enum OptionContractType {
  All = 'ALL',
  StandardContracts = 'S',
  NonStandardContracts = 'NS',
}

interface OptionChainData {
  symbol: string;
  status: string;
  underlying: OptionUnderlyingData;
  strategy: OptionStrategy;
  interval: number;
  isDelayed: boolean;
  isIndex: boolean;
  daysToExpiration: number;
  interestRate: number;
  underlyingPrice: number;
  volatility: number;
  callExpDateMap: ExpirationStrikeMapData;
  putExpDateMap: ExpirationStrikeMapData;
}

interface OptionUnderlyingData {
  ask: number;
  askSize: number;
  bid: number;
  bidSize: number;
  change: number;
  close: number;
  delayed: boolean;
  description: string;
  exchangeName: string;
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
  highPrice: number;
  last: number;
  lowPrice: number;
  mark: number;
  markChange: number;
  markPercentChange: number;
  openPrice: number;
  percentChange: number;
  quoteTime: number;
  symbol: string;
  totalVolume: number;
  tradeTime: number;
}

interface ExpirationStrikeMapData {
  [date: string]: {
    [strike: string]: Option[];
  };
}

interface Option {
  putCall: OptionType;
  symbol: string;
  description: string;
  exchangeName: string;
  bidPrice: number;
  askPrice: number;
  lastPrice: number;
  markPrice: number;
  bidSize: number;
  askSize: number;
  lastSize: number;
  highPrice: number;
  lowPrice: number;
  openPrice: number;
  closePrice: number;
  totalVolume: number;
  quoteTimeInLong: number;
  tradeTimeInLong: number;
  netChange: number;
  volatility: number;
  delta: number;
  gamma: number;
  theta: number;
  vega: number;
  rho: number;
  timeValue: number;
  openInterest: number;
  isInTheMoney: boolean;
  theoreticalOptionValue: number;
  theoreticalVolatility: number;
  isMini: boolean;
  isNonStandard: boolean;
  optionDeliverablesList: OptionDeliverableData[];
  strikePrice: number;
  expirationDate: string;
  expirationType: string;
  multiplier: number;
  settlementType: string;
  deliverableNote: string;
  isIndexOption: boolean;
  percentChange: number;
  markChange: number;
  markPercentChange: number;
}

interface OptionDeliverableData {
  symbol: string;
  assetType: string;
  deliverableUnits: string;
  currencyType: string;
}

export interface GetOptionChainOptions {
  contractType?: OptionType;
  strikeCount?: number;
  includeQuotes?: boolean;
  strategy?: OptionStrategy;
  interval?: number;
  strike?: number;
  range?: OptionRange;
  fromDate?: string;
  toDate?: string;
  volatility?: number;
  underlyingPrice?: number;
  interestRate?: number;
  daysToExpiration?: number;
  expMonth?: OptionMonth;
  optionType?: OptionContractType;
}

export class OptionChainClient {
  constructor(private client: Client) {}

  async getOptionChain(symbol: string, options: GetOptionChainOptions) {
    const response = await this.client.get<OptionChainData>(
      'marketdata/chains',
      {
        ...options,
        symbol,
      }
    );
    return response.data;
  }
}

export class OptionChain {
  constructor(
    protected data: OptionChainData,
    protected request: GetOptionChainOptions,
    private optionChainClient: OptionChainClient
  ) {}

  get symbol() {
    return this.data.symbol;
  }

  get status() {
    return this.data.status;
  }

  get underlying() {
    return this.data.underlying;
  }

  get strategy() {
    return this.data.strategy;
  }

  get interval() {
    return this.data.interval;
  }

  get isDelayed() {
    return this.data.isDelayed;
  }

  get isIndex() {
    return this.data.isIndex;
  }

  get daysToExpiration() {
    return this.data.daysToExpiration;
  }

  get interestRate() {
    return this.data.interestRate;
  }

  get underlyingPrice() {
    return this.data.underlyingPrice;
  }

  get volatility() {
    return this.data.volatility;
  }

  get callExpDateMap() {
    return this.data.callExpDateMap;
  }

  get putExpDateMap() {
    return this.data.putExpDateMap;
  }

  private memoCallOptions: Option[] = null;
  get callOptions() {
    if (this.memoCallOptions) {
      return this.memoCallOptions;
    }

    this.memoCallOptions = this.flattenOptionMap(this.data.callExpDateMap);
    return this.memoCallOptions;
  }

  private memoPutOptions: Option[] = null;
  get putOptions() {
    if (this.memoPutOptions) {
      return this.memoPutOptions;
    }

    this.memoPutOptions = this.flattenOptionMap(this.data.putExpDateMap);
    return this.memoPutOptions;
  }

  toJson() {
    return { ...this.data } as OptionChainData;
  }

  async refresh() {
    this.data = await this.optionChainClient.getOptionChain(
      this.symbol,
      this.request
    );
    this.memoCallOptions = null;
    this.memoPutOptions = null;
  }

  private flattenOptionMap(map: ExpirationStrikeMapData) {
    return Object.values(map).reduce((options, strikeMap) => {
      Object.values(strikeMap).forEach((strikeOptions) => {
        options.push(...strikeOptions);
      });

      return options;
    }, [] as Option[]);
  }
}

export function createOptionChainInstance(
  data: OptionChainData,
  request: GetOptionChainOptions,
  optionChainClient: OptionChainClient
) {
  return new OptionChain(data, request, optionChainClient);
}
