export enum AssetType {
  Equity = 'EQUITY',
  Option = 'OPTION',
}

export enum OptionType {
  Put = 'PUT',
  Call = 'CALL',
}

export interface Position {
  averagePrice: number;
  currentDayProfitLoss: number;
  currentDayProfitLossPercentage: number;
  instrument: Instrument;
  longQuantity: number;
  marketValue: number;
  settledLongQuantity: number;
  settledShortQuantity: number;
  shortQuantity: number;
}

export interface EquityPosition extends Position {
  instrument: EquityInstrument;
}

export interface OptionPosition extends Position {
  instrument: OptionInstrument;
}

export interface EquityInstrument {
  assetType: AssetType.Equity;
  cusip: string;
  symbol: string;
}

export interface OptionInstrument {
  assetType: AssetType.Option;
  cusip: string;
  description: string;
  putCall: OptionType;
  symbol: string;
  underlyingSymbol: string;
}

export type Instrument = EquityInstrument | OptionInstrument;

export function isEquityPosition(
  position: Position
): position is EquityPosition {
  return position.instrument.assetType === AssetType.Equity;
}

export function isOptionPosition(
  position: Position
): position is OptionPosition {
  return position.instrument.assetType === AssetType.Option;
}
