import {
  CurrentBalances,
  InitialBalances,
  MarginAccountCurrentBalances,
  MarginAccountInitialBalances,
  MarginAccountProjectedBalances,
  ProjectedBalances,
} from './balances';
import { Client } from './client';
import { Order } from './orders';
import {
  AssetType,
  EquityPosition,
  OptionPosition,
  Position,
} from './positions';

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

export class Accounts {
  constructor(private client: Client) {}

  async getAll(fieldOptions?: FieldOptions) {
    const fields: string[] = [];
    fieldOptions?.positions && fields.push('positions');
    fieldOptions?.orders && fields.push('orders');

    const response = await this.client.get<GetAccountResponse[]>('accounts', {
      fields: fields.join(','),
    });

    return response?.data?.map((data) => data.securitiesAccount);
  }

  async get(accountId: string, fieldOptions?: FieldOptions) {
    const fields: string[] = [];
    fieldOptions?.positions && fields.push('positions');
    fieldOptions?.orders && fields.push('orders');

    const response = await this.client.get<GetAccountResponse>(
      `accounts/${accountId}`,
      { fields: fields.join(',') }
    );

    return response?.data?.securitiesAccount;
  }

  isCashAccount(account: Account): account is CashAccount {
    return account.type === AccountType.Cash;
  }

  isMarginAccount(account: Account): account is MarginAccount {
    return account.type === AccountType.Margin;
  }

  isEquityPosition(position: Position): position is EquityPosition {
    return position.instrument.assetType === AssetType.Equity;
  }

  isOptionPosition(position: Position): position is OptionPosition {
    return position.instrument.assetType === AssetType.Option;
  }
}
