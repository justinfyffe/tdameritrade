import { Client } from './client';

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

export class InstrumentService {
  constructor(private client: Client) {}

  async search(symbol: string, projection: SearchInstrumentProjection) {
    const response = await this.client.get<SearchInstrumentsResponse>(
      'instruments',
      {
        symbol,
        projection,
      }
    );
    return response?.data;
  }

  async get(cusip: string) {
    const response = await this.client.get<Instrument>(`instruments/${cusip}`);
    return response?.data;
  }

  isFundamentalInstrument(
    instrument: Instrument
  ): instrument is FundamentalInstrument {
    return 'fundamental' in instrument;
  }
}
