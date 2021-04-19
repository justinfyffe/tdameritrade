import { Client } from './client';

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
  SmaAdjustment = 'SMA_ADJUSTMENT',
}

export enum AchStatus {
  Approved = 'Approved',
  Reject = 'Rejected',
  Cancel = 'Cancel',
  Error = 'Error',
}

export interface TransactionData {
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
  transactionItem: TransactionItemData;
}

export interface TransactionItemData {
  accountId: number;
  amount: number;
  price: number;
  cost: number;
  parentOrderKey: number;
  parentChildIndicator: string;
  instruction: string;
  positionEffect: string;
  instrument: TransactionInstrumentData;
}

export interface TransactionInstrumentData {
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

export interface GetTransactionsOptions {
  type?: TransactionType;
  symbol?: string;
  startDate?: string;
  endDate?: string;
}

export class TransactionClient {
  constructor(private client: Client) {}

  async getTransaction(accountId: number, transactionId: number) {
    const response = await this.client.get<TransactionData>(
      `accounts/${accountId}/transactions/${transactionId}`
    );

    return response.data;
  }

  async getTransactions(accountId: number, options?: GetTransactionsOptions) {
    const response = await this.client.get<TransactionData[]>(
      `accounts/${accountId}/transactions`,
      options
    );

    return response.data;
  }
}

export class Transaction {
  constructor(
    protected data: TransactionData,
    private transactionClient: TransactionClient
  ) {}

  get type() {
    return this.data.type;
  }

  get clearingReferenceNumber() {
    return this.data.clearingReferenceNumber;
  }

  get subAccount() {
    return this.data.subAccount;
  }

  get settlementDate() {
    return this.data.settlementDate;
  }

  get orderId() {
    return this.data.orderId;
  }

  get sma() {
    return this.data.sma;
  }

  get requirementReallocationAmount() {
    return this.data.requirementReallocationAmount;
  }

  get dayTradeBuyingPowerEffect() {
    return this.data.dayTradeBuyingPowerEffect;
  }

  get netAmount() {
    return this.data.netAmount;
  }

  get transactionDate() {
    return this.data.transactionDate;
  }

  get orderDate() {
    return this.data.orderDate;
  }

  get transactionSubType() {
    return this.data.transactionSubType;
  }

  get transactionId() {
    return this.data.transactionId;
  }

  get cashBalanceEffectFlag() {
    return this.data.cashBalanceEffectFlag;
  }

  get description() {
    return this.data.description;
  }

  get achStatus() {
    return this.data.achStatus;
  }

  get accruedInterest() {
    return this.data.accruedInterest;
  }

  get fees() {
    return this.data.fees;
  }

  get transactionItem() {
    return this.data.transactionItem;
  }

  toJson() {
    return { ...this.data } as TransactionData;
  }

  async refresh() {
    this.data = await this.transactionClient.getTransaction(
      this.transactionItem.accountId,
      this.transactionId
    );
  }
}

export function createTransactionInstance(
  data: TransactionData,
  transactionClient: TransactionClient
) {
  return new Transaction(data, transactionClient);
}

export function createTransactionInstances(
  data: TransactionData[],
  transactionClient: TransactionClient
) {
  return data.map((data) => new Transaction(data, transactionClient));
}
