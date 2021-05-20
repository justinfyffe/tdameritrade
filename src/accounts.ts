import {
  CurrentBalances,
  InitialBalances,
  MarginAccountCurrentBalances,
  MarginAccountInitialBalances,
  MarginAccountProjectedBalances,
  ProjectedBalances,
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
  accountId: string;
  currentBalances: CurrentBalances;
  initialBalances: InitialBalances;
  isClosingOnlyRestricted: boolean;
  isDayTrader: boolean;
  orderStrategies?: Order[];
  positions?: Position[];
  projectedBalances: ProjectedBalances;
  roundTrips: number;
  type: AccountType;
}

export interface MarginAccount extends Account {
  type: AccountType.Margin;
  currentBalances: MarginAccountCurrentBalances;
  initialBalances: MarginAccountInitialBalances;
  projectedBalances: MarginAccountProjectedBalances;
}

export interface CashAccount extends Account {
  type: AccountType.Cash;
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
