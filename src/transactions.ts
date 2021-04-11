export enum TransactionType {
  Trade = 'TRADE',
  ReceiveAndDeliver = 'RECEIVE_AND_DELIVER',
  DividendOrInterest = 'DIVIDEND_OR_INTEREST',
  AchReceipt = 'ACH_RECEIPT',
  AchDisbursement = 'ACH_DISBURSEMENT',
  CashReceipt = 'CASH_RECEIPT',
  CashDisbursement = 'CASH_DISBURSEMENT',
  ElectronicFund = 'ELECTRONIC_FUND',
  WireOut = 'WIRE_OUT',
  WireIn = 'WIRE_IN',
  Journal = 'JOURNAL',
  Memorandum = 'MEMORANDUM',
  MarginCall = 'MARGIN_CALL',
  MoneyMarket = 'MONEY_MARKET',
  SmaAdjustment = 'SMA_ADJUSTMENT'
}

export enum AchStatus {
  Approved = 'Approved',
  Reject = 'Rejected',
  Cancel = 'Cancel',
  Error = 'Error'
}

export interface Transaction {
  type: TransactionType;
  clearingReferenceNumber: string;
  subAccount: string;
  settlementDate: string;
  orderId: string;
  sma: number;
  requirementReallocationAmount: number;
  dayTradeBuyingPowerEffect: number;
  netAmount: number;
  transactionDate: string;
  orderDate: string;
  transactionSubType: string;
  transactionId: number;
  cashBalanceEffectFlag: boolean;
  description: string;
  achStatus: AchStatus;
  accruedInterest: number;
  fees: unknown;
  transactionItem: TransactionItem;
}

export interface TransactionItem {
  accountId: number;
  amount: number;
  price: number;
  cost: number;
  parentOrderKey: number;
  parentChildIndicator: string;
  instruction: string;
  positionEffect: string;
  instrument: TransactionInstrument;
}

export interface TransactionInstrument {
  symbol: string;
  underlyingSymbol: string;
  optionExpirationDate: string;
  optionStrikePrice: number;
  putCall: string;
  cusip: string;
  description: string;
  assetType: string;
  bondMaturityDate: string;
  bondInterestRate: number;
}
