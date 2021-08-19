import { format } from 'date-fns';
import { Client } from './client';

export enum AssetType {
  CashEquivalent = 'CASH_EQUIVALENT',
  Equity = 'EQUITY',
  Option = 'OPTION',
}

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

export interface DividendOrInterestTransaction {
  cashBalanceEffectFlag: boolean;
  description: string;
  fees: TransactionFees;
  netAmount: number;
  settlementDate: string;
  subAccount: string;
  transactionDate: string;
  transactionId: number;
  transactionItem: {
    accountId: number;
    cost: number;
    instrument: TransactionInstrument;
  };
  transactionSubType: string;
  type: TransactionType.DividendOrInterest;
}

export interface ElectronicFundTransaction {
  achStatus?: AchStatus;
  cashBalanceEffectFlag: boolean;
  clearingReferenceNumber?: string;
  description: string;
  fees: TransactionFees;
  netAmount: number;
  settlementDate: string;
  subAccount: string;
  transactionDate: string;
  transactionId: number;
  transactionItem: {
    accountId: number;
    cost: number;
  };
  transactionSubType: string;
  type: TransactionType.ElectronicFund;
}

export interface JournalTransaction {
  cashBalanceEffectFlag: boolean;
  description: string;
  fees: TransactionFees;
  netAmount: number;
  settlementDate: string;
  subAccount: string;
  transactionDate: string;
  transactionId: number;
  transactionItem: {
    accountId: number;
    cost: number;
  };
  transactionSubType: string;
  type: TransactionType.Journal;
}

export interface ReceiveAndDeliverTransaction {
  cashBalanceEffectFlag: boolean;
  description: string;
  fees: TransactionFees;
  netAmount: number;
  settlementDate: string;
  subAccount: string;
  transactionDate: string;
  transactionId: number;
  transactionItem: {
    accountId: number;
    amount: number;
    cost: number;
    instrument: TransactionInstrument;
  };
  transactionSubType: string;
  type: TransactionType.ReceiveAndDeliver;
}

export interface TradeTransaction {
  cashBalanceEffectFlag: boolean;
  description: string;
  fees: TransactionFees;
  netAmount: number;
  orderDate: string;
  orderId: string;
  settlementDate: string;
  subAccount: string;
  transactionDate: string;
  transactionId: number;
  transactionItem: {
    accountId: number;
    amount: number;
    cost: number;
    instruction: string;
    instrument: TransactionInstrument;
    price: number;
  };
  transactionSubType: string;
  type: TransactionType.Trade;
}

export interface WireInTransaction {
  cashBalanceEffectFlag: boolean;
  description: string;
  fees: TransactionFees;
  netAmount: number;
  settlementDate: string;
  subAccount: string;
  transactionDate: string;
  transactionId: number;
  transactionItem: {
    accountId: number;
    cost: number;
  };
  transactionSubType: string;
  type: TransactionType.WireIn;
}

export type Transaction =
  | DividendOrInterestTransaction
  | ElectronicFundTransaction
  | JournalTransaction
  | ReceiveAndDeliverTransaction
  | TradeTransaction
  | WireInTransaction;

export interface CashEquivalentInstrument {
  assetType: AssetType.CashEquivalent;
  cusip: string;
  symbol: string;
  type: string;
}

export interface EquityTransactionInstrument {
  assetType: AssetType.Equity;
  cusip: string;
  symbol: string;
}

export interface OptionTransactionInstrument {
  assetType: AssetType.Option;
  cusip: string;
  description: string;
  symbol: string;
  underlyingSymbol: string;
  optionExpirationDate: string;
  putCall: string;
}

export type TransactionInstrument =
  | CashEquivalentInstrument
  | EquityTransactionInstrument
  | OptionTransactionInstrument;

export interface TransactionFees {
  additionalFee: number;
  cdscFee: number;
  commission: number;
  optRegFee: number;
  otherCharges: number;
  rFee: number;
  regFee: number;
  secFee: number;
}

export interface ListTransactionsOptions {
  type?: TransactionType;
  symbol?: string;
  startDate?: Date;
  endDate?: Date;
}

export class Transactions {
  constructor(private client: Client) {}

  async get(accountId: string, transactionId: number) {
    const response = await this.client.get<Transaction>(
      `accounts/${accountId}/transactions/${transactionId}`
    );

    return response?.data;
  }

  async list(accountId: string, options?: ListTransactionsOptions) {
    const response = await this.client.get<Transaction[]>(
      `accounts/${accountId}/transactions`,
      {
        ...options,
        startDate: options?.startDate
          ? format(options.startDate, 'yyyy-MM-dd')
          : undefined,
        endDate: options?.endDate
          ? format(options.endDate, 'yyyy-MM-dd')
          : undefined,
      }
    );

    return response?.data;
  }
}
