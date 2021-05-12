export enum AssetType {
  Equity = 'EQUITY',
  Option = 'OPTION',
  Index = 'INDEX',
  MutualFund = 'MUTUAL_FUND',
  CashEquivalent = 'CASH_EQUIVALENT',
  FixedIncome = 'FIXED_INCOME',
  Currency = 'CURRENCY',
}

export enum CashEquivalentType {
  Savings = 'SAVINGS',
  MoneyMarketFund = 'MONEY_MARKET_FUND',
}

export enum MutualFundType {
  NotApplicable = 'NOT_APPLICABLE',
  OpenEndNonTaxable = 'OPEN_END_NON_TAXABLE',
  OpenEndTaxable = 'OPEN_END_TAXABLE',
  NoLoadNonTaxable = 'NO_LOAD_NON_TAXABLE',
  NoLoadTaxable = 'NO_LOAD_TAXABLE',
}

export enum OptionDeliverableCurrency {
  USD = 'USD',
  CAD = 'CAD',
  EUR = 'EUR',
  JPY = 'JPY',
}

export enum OptionInstrumentType {
  Vanilla = 'VANILLA',
  Binary = 'BINARY',
  Barrier = 'BARRIER',
}

export enum OptionType {
  Put = 'PUT',
  Call = 'CALL',
}

export interface Position {
  shortQuantity: number;
  averagePrice: number;
  currentDayProfitLoss: number;
  currentDayProfitLossPercentage: number;
  longQuantity: number;
  settledLongQuantity: number;
  settledShortQuantity: number;
  agedQuantity: number;
  instrument: Instrument;
  marketValue: number;
}

export interface CashEquivalentPosition extends Position {
  instrument: CashEquivalentInstrument;
}

export interface EquityPosition extends Position {
  instrument: EquityInstrument;
}

export interface FixedIncomePosition extends Position {
  instrument: FixedIncomeInstrument;
}

export interface MutualFundPosition extends Position {
  instrument: MutualFundInstrument;
}

export interface OptionPosition extends Position {
  instrument: OptionInstrument;
}

export interface CashEquivalentInstrument {
  assetType: AssetType.CashEquivalent;
  cusip: string;
  symbol: string;
  description: string;
  type: CashEquivalentType;
}

export interface EquityInstrument {
  assetType: AssetType.Equity;
  cusip: string;
  symbol: string;
  description: string;
}

export interface FixedIncomeInstrument {
  assetType: AssetType.FixedIncome;
  cusip: string;
  symbol: string;
  description: string;
  maturityDate: string;
  variableRate: number;
  factor: number;
}

export interface MutualFundInstrument {
  assetType: AssetType.MutualFund;
  cusip: string;
  symbol: string;
  description: string;
  type: MutualFundType;
}

export interface OptionInstrument {
  assetType: AssetType.Option;
  cusip: string;
  symbol: string;
  description: string;
  type: OptionInstrumentType;
  putCall: OptionType;
  underlyingSymbol: string;
  optionMultiplier: number;
  optionDeliverables: OptionDeliverable[];
}

export type Instrument =
  | EquityInstrument
  | FixedIncomeInstrument
  | MutualFundInstrument
  | CashEquivalentInstrument
  | OptionInstrument;

export interface OptionDeliverable {
  symbol: string;
  assetType: AssetType;
  deliverableUnits: string;
  currencyType: OptionDeliverableCurrency;
}

export function isCashEquivalentPosition(
  position: Position
): position is CashEquivalentPosition {
  return position.instrument.assetType === AssetType.CashEquivalent;
}

export function isEquityPosition(
  position: Position
): position is EquityPosition {
  return position.instrument.assetType === AssetType.Equity;
}

export function isFixedIncomePosition(
  position: Position
): position is FixedIncomePosition {
  return position.instrument.assetType === AssetType.FixedIncome;
}

export function isMutualFundPosition(
  position: Position
): position is MutualFundPosition {
  return position.instrument.assetType === AssetType.MutualFund;
}

export function isOptionPosition(
  position: Position
): position is OptionPosition {
  return position.instrument.assetType === AssetType.Option;
}
