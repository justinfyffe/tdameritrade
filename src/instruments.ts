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

export interface Instrument {
  assetType: AssetType;
  cusip: string;
  symbol: string;
  description: string;
  fundamental?: FundamentalData;
}

export interface EquityInstrument extends Instrument {
  assetType: AssetType.Equity;
}

export interface FixedIncomeInstrument extends Instrument {
  assetType: AssetType.FixedIncome;
  maturityDate: string;
  variableRate: number;
  factor: number;
}

export interface MututalFundInstrument extends Instrument {
  assetType: AssetType.MutualFund;
  type: MutualFundType;
}

export interface CashEquivalentInstrument extends Instrument {
  assetType: AssetType.CashEquivalent;
  type: CashEquivalentType;
}

export interface OptionInstrument extends Instrument {
  assetType: AssetType.Option;
  type: OptionType;
  putCall: OptionPutCall;
  underlyingSymbol: string;
  optionMultiplier: number;
  optionDeliverables: OptionDeliverable[];
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

export interface OptionDeliverable {
  symbol: string;
  deliverableUnits: number;
  currentType: 'USD' | 'CAD' | 'EUR' | 'JPY';
  assetType: AssetType;
}
