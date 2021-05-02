import { apiGet } from './client';
import { TDAmeritrade } from './tdameritrade';

export enum AssetType {
  Equity = 'EQUITY',
  Etf = 'ETF',
  Option = 'OPTION',
  Index = 'INDEX',
  MutualFund = 'MUTUAL_FUND',
  CashEquivalent = 'CASH_EQUIVALENT',
  FixedIncome = 'FIXED_INCOME',
  Currency = 'CURRENCY',
}

export enum MutualFundType {
  NotApplicable = 'NOT_APPLICABLE',
  OpenEndNonTaxable = 'OPEN_END_NON_TAXABLE',
  OpenEndTaxable = 'OPEN_END_TAXABLE',
  NoLoadNonTaxable = 'NO_LOAD_NON_TAXABLE',
  NoLoadTaxable = 'NO_LOAD_TAXABLE',
}

export enum CashEquivalentType {
  Savings = 'SAVINGS',
  MoneyMarketFund = 'MONEY_MARKET_FUND',
}

export enum OptionInstrumentType {
  Vanilla = 'VANILLA',
  Binary = 'BINARY',
  Barrier = 'BARRIER',
}

export enum OptionPutCall {
  Call = 'CALL',
  Put = 'PUT',
}

interface BaseInstrument {
  assetType: AssetType;
  cusip: string;
  symbol: string;
  description: string;
  fundamental?: FundamentalData;
}

export interface EquityInstrument extends BaseInstrument {
  assetType: AssetType.Equity;
}

export interface FixedIncomeInstrument extends BaseInstrument {
  assetType: AssetType.FixedIncome;
  maturityDate: string;
  variableRate: number;
  factor: number;
}

export interface MututalFundInstrument extends BaseInstrument {
  assetType: AssetType.MutualFund;
  type: MutualFundType;
}

export interface CashEquivalentInstrument extends BaseInstrument {
  assetType: AssetType.CashEquivalent;
  type: CashEquivalentType;
}

export interface OptionInstrument extends BaseInstrument {
  assetType: AssetType.Option;
  type: OptionInstrumentType;
  putCall: OptionPutCall;
  underlyingSymbol: string;
  optionMultiplier: number;
  optionDeliverables: OptionDeliverable[];
}

export type Instrument =
  | EquityInstrument
  | FixedIncomeInstrument
  | MututalFundInstrument
  | CashEquivalentInstrument
  | OptionInstrument;

export interface FundamentalData {
  symbol: string;
  high52: number;
  low52: number;
  dividendAmount: number;
  dividendYield: number;
  dividendDate: string;
  peRatio: number;
  pegRatio: number;
  pbRatio: number;
  prRatio: number;
  pcfRatio: number;
  grossMarginTTM: number;
  grossMarginMRQ: number;
  netProfitMarginTTM: number;
  netProfitMarginMRQ: number;
  operatingMarginTTM: number;
  operatingMarginMRQ: number;
  returnOnEquity: number;
  returnOnAssets: number;
  returnOnInvestment: number;
  quickRatio: number;
  currentRatio: number;
  interestCoverage: number;
  totalDebtToCapital: number;
  ltDebtToEquity: number;
  totalDebtToEquity: number;
  epsTTM: number;
  epsChangePercentTTM: number;
  epsChangeYear: number;
  epsChange: number;
  revChangeYear: number;
  revChangeTTM: number;
  revChangeIn: number;
  sharesOutstanding: number;
  marketCapFloat: number;
  marketCap: number;
  bookValuePerShare: number;
  shortIntToFloat: number;
  shortIntDayToCover: number;
  divGrowthRate3Year: number;
  dividendPayAmount: number;
  dividendPayDate: string;
  beta: number;
  vol1DayAvg: number;
  vol10DayAvg: number;
  vol3MonthAvg: number;
}

export interface OptionDeliverable {
  symbol: string;
  deliverableUnits: number;
  currentType: 'USD' | 'CAD' | 'EUR' | 'JPY';
  assetType: AssetType;
}

export enum SearchInstrumentProjection {
  SymbolSearch = 'symbol-search',
  SymbolRegex = 'symbol-regex',
  DescSearch = 'desc-search',
  DescRegex = 'desc-regex',
  Fundamental = 'fundamental',
}

export async function searchInstruments(
  td: TDAmeritrade,
  symbol: string,
  projection: SearchInstrumentProjection
) {
  const response = await apiGet<Instrument[]>(td, 'instruments', {
    symbol,
    projection,
  });
  return response.data;
}

export async function getInstrument(td: TDAmeritrade, cusip: string) {
  const response = await apiGet<Instrument>(td, `instruments/${cusip}`);
  return response.data;
}
