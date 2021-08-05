import { apiGet } from './client';
import { TDAmeritrade } from './tdameritrade';

export enum OptionContractType {
  All = 'ALL',
  StandardContracts = 'S',
  NonStandardContracts = 'NS',
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

export enum OptionRange {
  All = 'ALL',
  InTheMoney = 'ITM',
  NearTheMoney = 'NTM',
  OutOfTheMoney = 'OTM',
  StrikesAboveMarket = 'SAK',
  StrikesBelowMarket = 'SBM',
  StrikesNearMarket = 'SNK',
}

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

export interface OptionChain {
  symbol: string;
  status: string;
  underlying: OptionUnderlying;
  strategy: OptionStrategy;
  interval: number;
  isDelayed: boolean;
  isIndex: boolean;
  daysToExpiration: number;
  interestRate: number;
  underlyingPrice: number;
  volatility: number;
  callExpDateMap: ExpirationStrikeMap;
  putExpDateMap: ExpirationStrikeMap;
}

export interface OptionUnderlying {
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

export interface ExpirationStrikeMap {
  [date: string]: {
    [strike: string]: Option[];
  };
}

export interface Option {
  putCall: OptionType;
  symbol: string;
  description: string;
  exchangeName: string;
  bid: number;
  ask: number;
  last: number;
  mark: number;
  bidSize: number;
  askSize: number;
  bidAskSize: string;
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
  inTheMoney: boolean;
  theoreticalOptionValue: number;
  theoreticalVolatility: number;
  mini: boolean;
  nonStandard: boolean;
  optionDeliverablesList: OptionDeliverable[];
  strikePrice: number;
  expirationDate: number;
  expirationType: string;
  lastTradingDay: number;
  multiplier: number;
  settlementType: string;
  deliverableNote: string;
  isIndexOption: boolean;
  percentChange: number;
  markChange: number;
  markPercentChange: number;
}

export interface OptionDeliverable {
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
  fromDate?: Date;
  toDate?: Date;
  volatility?: number;
  underlyingPrice?: number;
  interestRate?: number;
  daysToExpiration?: number;
  expMonth?: OptionMonth;
  optionType?: OptionContractType;
}

export async function getOptionChain(
  td: TDAmeritrade,
  symbol: string,
  options?: GetOptionChainOptions
) {
  const query = {
    ...options,
    fromDate: options?.fromDate?.toISOString() ?? undefined,
    toDate: options?.toDate?.toISOString() ?? undefined,
    symbol,
  };

  const response = await apiGet<OptionChain>(td, 'marketdata/chains', query);
  return response?.data;
}

export function getCallOptions(optionChain: OptionChain) {
  return flattenOptionMap(optionChain.callExpDateMap);
}

export function getPutOptions(optionChain: OptionChain) {
  return flattenOptionMap(optionChain.putExpDateMap);
}

function flattenOptionMap(map: ExpirationStrikeMap) {
  return Object.values(map).reduce((options, strikeMap) => {
    Object.values(strikeMap).forEach((strikeOptions) => {
      options.push(...strikeOptions);
    });

    return options;
  }, [] as Option[]);
}
