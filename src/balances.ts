interface MarginBalances {
  accruedInterest: number;
  availableFundsNonMarginableTrade: number;
  bondValue: number;
  buyingPower: number;
  cashBalance: number;
  cashReceipts: number;
  dayTradingBuyingPower: number;
  dayTradingBuyingPowerCall: number;
  equity: number;
  equityPercentage: number;
  liquidationValue: number;
  longMarginValue: number;
  longOptionMarketValue: number;
  maintenanceCall: number;
  maintenanceRequirement: number;
  moneyMarketFund: number;
  mutualFundValue: number;
  pendingDeposits: number;
  regTCall: number;
  shortMarginValue: number;
  isInCall: boolean;
  marginBalance: number;
  shortBalance: number;
  shortOptionMarketValue: number;
}

export interface MarginAccountInitialBalances extends MarginBalances {
  cashAvailableForTrading: number;
  dayTradingEquityCall: number;
  longStockValue: number;
  margin: number;
  marginEquity: number;
  shortStockValue: number;
  totalCash: number;
  unsettledCash: number;
  accountValue: number;
}

export interface MarginAccountCurrentBalances extends MarginBalances {
  longMarketValue: number;
  savings: number;
  shortMarketValue: number;
  availableFunds: number;
  buyingPowerNonMarginableTrade: number;
  sma: number;
  stockBuyingPower: number;
  optionBuyingPower: number;
}

export interface MarginAccountProjectedBalances extends MarginBalances {
  longMarketValue: number;
  savings: number;
  shortMarketValue: number;
  availableFunds: number;
  buyingPowerNonMarginableTrade: number;
  sma: number;
  stockBuyingPower: number;
  optionBuyingPower: number;
}

interface CashBalances {
  accruedInterest: number;
  bondValue: number;
  cashAvailableForTrading: number;
  cashAvailableForWithdrawal: number;
  cashBalance: number;
  cashDebitCallValue: number;
  cashReceipts: number;
  liquidationValue: number;
  longOptionMarketValue: number;
  moneyMarketFund: number;
  mutualFundValue: number;
  pendingDeposits: number;
  shortOptionMarketValue: number;
  unsettledCash: number;
}

export interface CashAccountInitialBalances extends CashBalances {
  longStockValue: number;
  shortStockValue: number;
  isInCall: boolean;
  accountValue: number;
}

export interface CashAccountCurrentBalances extends CashBalances {
  longMarketValue: number;
  savings: number;
  shortMarketValue: number;
  cashCall: number;
  longNonMarginableMarketValue: number;
  totalCash: number;
}

export interface CashAccountProjectedBalances extends CashBalances {
  longMarketValue: number;
  savings: number;
  shortMarketValue: number;
  cashCall: number;
  longNonMarginableMarketValue: number;
  totalCash: number;
}

export type Balances = MarginBalances | CashBalances;
