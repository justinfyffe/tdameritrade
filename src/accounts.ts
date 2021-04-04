import { Instrument } from './instruments';
import { Order } from './orders';

export enum AccountType {
  Cash = 'CASH',
  Margin = 'MARGIN',
}

export interface Account {
  type: AccountType;
  accountId: string;
  roundTrips: number;
  isDayTrader: boolean;
  isClosingOnlyRestricted: boolean;
  positions?: Position[];
  orderStrategies?: Order[];
  initialBalances: Balance;
  currentBalances: Balance;
  projectedBalances: Balance;
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

export interface Balance {
  accountValue: number;
  accruedInterest: number;
  availableFundsNonMarginableTrade: number;
  bondValue: number;
  buyingPower: number;
  buyingPowerNonMarginableTrade: number;
  cashAvailableForTrading: number;
  cashAvailableForWithdrawal: number;
  cashBalance: number;
  cashDebitCallValue: number;
  cashReceipts: number;
  dayTradingBuyingPower: number;
  dayTradingBuyingPowerCall: number;
  dayTradingEquityCall: number;
  equity: number;
  equityPercentage: number;
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
  savings: number;
  shortBalance: number;
  shortMarginValue: number;
  shortOptionMarketValue: number;
  shortStockValue: number;
  sma: number;
  totalCash: number;
  isInCall: boolean;
  unsettledCash: number;
}
