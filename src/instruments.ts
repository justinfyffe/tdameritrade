import { apiGet } from './client';
import { TDAmeritrade } from './tdameritrade';

export enum AssetType {
  Equity = 'EQUITY',
  Etf = 'ETF',
  Forex = 'FOREX',
  Future = 'FUTURE',
  FutureOption = 'FUTURE_OPTION',
  Index = 'INDEX',
  Indicator = 'INDICATOR',
  MutualFund = 'MUTUAL_FUND',
  Option = 'OPTION',
  Bond = 'BOND',
  Unknown = 'UNKNOWN',
}

export interface Instrument {
  assetType: AssetType;
  cusip: string;
  symbol: string;
  description: string;
  exchange: string;
}

export interface FundamentalInstrument extends Instrument {
  assetType:
    | AssetType.Equity
    | AssetType.Etf
    | AssetType.MutualFund
    | AssetType.Unknown;
  fundamental: FundamentalData;
}

export interface BondInstrument extends Instrument {
  assetType: AssetType.Bond;
  bondPrice: number;
}

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
  return response.data;
}

export async function getInstrument(td: TDAmeritrade, cusip: string) {
  const response = await apiGet<Instrument>(td, `instruments/${cusip}`);
  return response.data;
}

export function isFundamentalInstrument(
  instrument: Instrument
): instrument is FundamentalInstrument {
  return 'fundamental' in instrument;
}

export function isBondInstrument(
  instrument: Instrument
): instrument is BondInstrument {
  return instrument.assetType === AssetType.Bond;
}
