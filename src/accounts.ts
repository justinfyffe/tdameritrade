import {
  CashAccountCurrentBalance,
  CashAccountInitialBalance,
  CashAccountProjectedBalance,
  MarginAccountCurrentBalance,
  MarginAccountInitialBalance,
  MarginAccountProjectedBalance,
} from './balances';
import { apiGet } from './client';
import { Order } from './orders';
import { Position } from './positions';
import { TDAmeritrade } from './tdameritrade';

export enum AccountType {
  Cash = 'CASH',
  Margin = 'MARGIN',
}

interface BaseAccount {
  type: AccountType;
  accountId: number;
  roundTrips: number;
  isDayTrader: boolean;
  isClosingOnlyRestricted: boolean;
  positions?: Position[];
  orderStrategies?: Order[];
}

export interface MarginAccount extends BaseAccount {
  type: AccountType.Margin;
  initialBalances: MarginAccountInitialBalance[];
  currentBalances: MarginAccountCurrentBalance[];
  projectedBalances: MarginAccountProjectedBalance[];
}

export interface CashAccount extends BaseAccount {
  type: AccountType.Cash;
  initialBalances: CashAccountInitialBalance[];
  currentBalances: CashAccountCurrentBalance[];
  projectedBalances: CashAccountProjectedBalance[];
}

export type Account = MarginAccount | CashAccount;

export interface FieldOptions {
  positions?: boolean;
  orders?: boolean;
}

interface GetAccountResponse {
  securitiesAccount: Account;
}

export async function getAccounts(
  td: TDAmeritrade,
  fieldOptions?: FieldOptions
) {
  const fields = [];
  fieldOptions?.positions && fields.push('positions');
  fieldOptions?.orders && fields.push('orders');

  const response = await apiGet<GetAccountResponse[]>(td, 'accounts', {
    fields: fields.join(','),
  });

  return response.data.map((data) => data.securitiesAccount);
}

export async function getAccount(
  td: TDAmeritrade,
  accountId: number,
  fieldOptions?: FieldOptions
) {
  const fields = [];
  fieldOptions?.positions && fields.push('positions');
  fieldOptions?.orders && fields.push('orders');

  const response = await apiGet<GetAccountResponse>(
    td,
    `accounts/${accountId}`,
    { fields: fields.join(',') }
  );

  return response.data.securitiesAccount;
}
