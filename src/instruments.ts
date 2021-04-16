import { Client } from './client';

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

export enum OptionType {
  Vanilla = 'VANILLA',
  Binary = 'BINARY',
  Barrier = 'BARRIER',
}

export enum OptionPutCall {
  Call = 'CALL',
  Put = 'PUT',
}

export interface BaseInstrument {
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
  type: OptionType;
  putCall: OptionPutCall;
  underlyingSymbol: string;
  optionMultiplier: number;
  optionDeliverables: OptionDeliverable[];
}

export type InstrumentData =
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

export interface SearchInstrumentOptions {
  symbol: string;
  projection: SearchInstrumentProjection;
}

export class InstrumentClient {
  constructor(private client: Client) {}

  async searchInstruments(options: SearchInstrumentOptions) {
    const response = await this.client.get<InstrumentData[]>(
      'instruments',
      options
    );

    return response.data;
  }

  async getInstrument(cusip: string) {
    const response = await this.client.get<InstrumentData>(
      `instruments/${cusip}`
    );

    return response.data;
  }
}

export class Instrument {
  constructor(
    protected data: InstrumentData,
    private instrumentClient: InstrumentClient
  ) {}

  get assetType() {
    return this.data.assetType;
  }

  get cusip() {
    return this.data.cusip;
  }

  get symbol() {
    return this.data.symbol;
  }

  get description() {
    return this.data.description;
  }

  get fundamental() {
    return this.data.fundamental;
  }

  toJson() {
    return { ...this.data } as InstrumentData;
  }

  async refresh() {
    this.data = await this.instrumentClient.getInstrument(this.cusip);
  }
}

export function createInstrumentInstance(
  data: InstrumentData,
  instrumentClient: InstrumentClient
) {
  return new Instrument(data, instrumentClient);
}

export function createInstrumentInstances(
  data: InstrumentData[],
  instrumentClient: InstrumentClient
) {
  return data.map((data) => new Instrument(data, instrumentClient));
}
