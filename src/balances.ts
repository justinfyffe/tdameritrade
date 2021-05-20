export interface MarginAccountCurrentBalances {
  accruedInterest: number;
  availableFunds: number;
  availableFundsNonMarginableTrade: number;
  bondValue: number;
  buyingPower: number;
  buyingPowerNonMarginableTrade: number;
  cashBalance: number;
  cashReceipts: number;
  dayTradingBuyingPower: number;
  equity: number;
  equityPercentage: number;
  liquidationValue: number;
  longMarginValue: number;
  longMarketValue: number;
  longOptionMarketValue: number;
  maintenanceCall: number;
  maintenanceRequirement: number;
  marginBalance: number;
  moneyMarketFund: number;
  pendingDeposits: number;
  regTCall: number;
  savings: number;
  shortBalance: number;
  shortMarginValue: number;
  shortMarketValue: number;
  shortOptionMarketValue: number;
  sma: number;
}

export interface MarginAccountInitialBalances {
  accountValue: number;
  accruedInterest: number;
  availableFundsNonMarginableTrade: number;
  bondValue: number;
  buyingPower: number;
  cashAvailableForTrading: number;
  cashBalance: number;
  cashReceipts: number;
  dayTradingBuyingPower: number;
  dayTradingBuyingPowerCall: number;
  dayTradingEquityCall: number;
  equity: number;
  equityPercentage: number;
  isInCall: boolean;
  liquidationValue: number;
  longMarginValue: number;
  longOptionMarketValue: number;
  longStockValue: number;
  maintenanceCall: number;
  maintenanceRequirement: number;
  margin: number;
  marginBalance: number;
  marginEquity: number;
  moneyMarketFund: number;
  mutualFundValue: number;
  pendingDeposits: number;
  regTCall: number;
  shortBalance: number;
  shortMarginValue: number;
  shortOptionMarketValue: number;
  shortStockValue: number;
  totalCash: number;
}

export interface MarginAccountProjectedBalances {
  availableFunds: number;
  availableFundsNonMarginableTrade: number;
  buyingPower: number;
  dayTradingBuyingPower: number;
  dayTradingBuyingPowerCall: number;
  isInCall: boolean;
  maintenanceCall: number;
  regTCall: number;
  stockBuyingPower: number;
}

export type CurrentBalances = MarginAccountCurrentBalances;
export type InitialBalances = MarginAccountInitialBalances;
export type ProjectedBalances = MarginAccountProjectedBalances;
