import { apiGet } from './client';
import { TDAmeritrade } from './tdameritrade';

export enum AssetType {
  Equity = 'EQUITY',
  Etf = 'ETF',
  Option = 'OPTION',
}

export interface Instrument {
  assetType: AssetType;
  cusip: string;
  description: string;
  exchange: string;
  symbol: string;
}

export interface FundamentalInstrument extends Instrument {
  assetType: AssetType.Equity | AssetType.Etf;
  fundamental: FundamentalData;
}

export interface FundamentalData {
  beta: number;
  bookValuePerShare: number;
  currentRatio: number;
  divGrowthRate3Year: number;
  dividendAmount: number;
  dividendDate: string;
  dividendPayAmount: number;
  dividendPayDate: string;
  dividendYield: number;
  epsChange: number;
  epsChangePercentTTM: number;
  epsChangeYear: number;
  epsTTM: number;
  grossMarginMRQ: number;
  grossMarginTTM: number;
  high52: number;
  interestCoverage: number;
  low52: number;
  ltDebtToEquity: number;
  marketCap: number;
  marketCapFloat: number;
  netProfitMarginMRQ: number;
  netProfitMarginTTM: number;
  operatingMarginMRQ: number;
  operatingMarginTTM: number;
  pbRatio: number;
  pcfRatio: number;
  peRatio: number;
  pegRatio: number;
  prRatio: number;
  quickRatio: number;
  returnOnAssets: number;
  returnOnEquity: number;
  returnOnInvestment: number;
  revChangeIn: number;
  revChangeTTM: number;
  revChangeYear: number;
  sharesOutstanding: number;
  shortIntDayToCover: number;
  shortIntToFloat: number;
  symbol: string;
  totalDebtToCapital: number;
  totalDebtToEquity: number;
  vol1DayAvg: number;
  vol3MonthAvg: number;
  vol10DayAvg: number;
}

export enum SearchInstrumentProjection {
  SymbolSearch = 'symbol-search',
  SymbolRegex = 'symbol-regex',
  DescSearch = 'desc-search',
  DescRegex = 'desc-regex',
  Fundamental = 'fundamental',
}

export interface SearchInstrumentsResponse {
  [symbol: string]: Instrument;
}

export async function searchInstruments(
  td: TDAmeritrade,
  symbol: string,
  projection: SearchInstrumentProjection
) {
  const response = await apiGet<SearchInstrumentsResponse>(td, 'instruments', {
    symbol,
    projection,
  });
  return response?.data;
}

export async function getInstrument(td: TDAmeritrade, cusip: string) {
  const response = await apiGet<Instrument>(td, `instruments/${cusip}`);
  return response?.data;
}

export function isFundamentalInstrument(
  instrument: Instrument
): instrument is FundamentalInstrument {
  return 'fundamental' in instrument;
}
