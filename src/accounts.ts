import {
  Balances,
  CashAccountCurrentBalances,
  CashAccountInitialBalances,
  CashAccountProjectedBalances,
  MarginAccountCurrentBalances,
  MarginAccountInitialBalances,
  MarginAccountProjectedBalances,
} from './balances';
import { apiGet } from './client';
import { Order } from './orders';
import { Position } from './positions';
import { TDAmeritrade } from './tdameritrade';

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

  initialBalances: Balances;
  currentBalances: Balances;
  projectedBalances: Balances;
}

export interface MarginAccount extends Account {
  type: AccountType.Margin;
  initialBalances: MarginAccountInitialBalances;
  currentBalances: MarginAccountCurrentBalances;
  projectedBalances: MarginAccountProjectedBalances;
}

export interface CashAccount extends Account {
  type: AccountType.Cash;
  initialBalances: CashAccountInitialBalances;
  currentBalances: CashAccountCurrentBalances;
  projectedBalances: CashAccountProjectedBalances;
}

interface FieldOptions {
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
  accountId: string,
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

export function isCashAccount(account: Account): account is CashAccount {
  return account.type === AccountType.Cash;
}

export function isMarginAccount(account: Account): account is MarginAccount {
  return account.type === AccountType.Margin;
}
