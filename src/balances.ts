export interface Balance {
  accruedInterest: number;
  bondValue: number;
  cashBalance: number;
  cashReceipts: number;
  liquidationValue: number;
  longOptionMarketValue: number;
  moneyMarketFund: number;
  mutualFundValue: number;
  shortOptionMarketValue: number;
  pendingDeposits: number;
}

export interface MarginBalance extends Balance {
  availableFundsNonMarginableTrade: number;
  buyingPower: number;
  dayTradingBuyingPower: number;
  dayTradingBuyingPowerCall: number;
  equity: number;
  equityPercentage: number;
  longMarginValue: number;
  maintenanceCall: number;
  maintenanceRequirement: number;
  regTCall: number;
  shortMarginValue: number;
  isInCall: boolean;
  marginBalance: number;
  shortBalance: number;
}

export interface MarginAccountInitialBalance extends MarginBalance {
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

export interface MarginAccountCurrentBalance extends MarginBalance {
  longMarketValue: number;
  savings: number;
  shortMarketValue: number;
  availableFunds: number;
  buyingPowerNonMarginableTrade: number;
  sma: number;
  stockBuyingPower: number;
  optionBuyingPower: number;
}

export interface MarginAccountProjectedBalance extends MarginBalance {
  longMarketValue: number;
  savings: number;
  shortMarketValue: number;
  availableFunds: number;
  buyingPowerNonMarginableTrade: number;
  sma: number;
  stockBuyingPower: number;
  optionBuyingPower: number;
}

export interface CashBalance extends Balance {
  cashAvailableForTrading: number;
  cashAvailableForWithdrawal: number;
  unsettledCash: number;
  cashDebitCallValue: number;
}

export interface CashAccountInitialBalance extends CashBalance {
  longStockValue: number;
  shortStockValue: number;
  isInCall: boolean;
  accountValue: number;
}

export interface CashAccountCurrentBalance extends CashBalance {
  longMarketValue: number;
  savings: number;
  shortMarketValue: number;
  cashCall: number;
  longNonMarginableMarketValue: number;
  totalCash: number;
}

export interface CashAccountProjectedBalance extends CashBalance {
  longMarketValue: number;
  savings: number;
  shortMarketValue: number;
  cashCall: number;
  longNonMarginableMarketValue: number;
  totalCash: number;
}
