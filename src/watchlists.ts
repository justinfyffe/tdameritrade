export enum WatchlistAssetType {
  Equity = 'EQUITY',
  Option = 'OPTION',
  MutualFund = 'MUTUAL_FUND',
  FixedIncome = 'FIXED_INCOME',
  Index = 'INDEX'
}

export interface WatchList {
  name: string;

}

export interface WatchListItem {
  quantity: number;
  averagePrice: number;
  commission: number;
  purchasedDate: string;
  instrument: WatchlistInstrument;
}

export interface WatchlistInstrument {
  symbol: string;
  assetType: WatchlistAssetType;
}
