import {
  CashAccountCurrentBalance,
  CashAccountInitialBalance,
  CashAccountProjectedBalance,
  MarginAccountCurrentBalance,
  MarginAccountInitialBalance,
  MarginAccountProjectedBalance,
} from './balances';
import { Client } from './client';
import {
  createOrderInstance,
  createOrderInstances,
  GetOrdersOptions,
  Order,
  OrderClient,
  OrderData,
} from './orders';
import { Position } from './positions';
import {
  createSavedOrderInstance,
  createSavedOrderInstances,
  SavedOrderClient,
} from './saved-orders';
import {
  createTransactionInstance,
  createTransactionInstances,
  GetTransactionsOptions,
  TransactionClient,
} from './transactions';
import { Preferences, UserInfoClient } from './user-info';
import {
  createWatchlistInstance,
  createWatchlistInstances,
  CreateWatchlistRequest,
  UpdateWatchlistRequest,
  WatchlistClient,
} from './watchlists';

export enum AccountType {
  Cash = 'CASH',
  Margin = 'MARGIN',
}

interface BaseAccountData {
  type: AccountType;
  accountId: number;
  roundTrips: number;
  isDayTrader: boolean;
  isClosingOnlyRestricted: boolean;
  positions?: Position[];
  orderStrategies?: Order[];
}

interface MarginAccountData extends BaseAccountData {
  type: AccountType.Margin;
  initialBalances: MarginAccountInitialBalance[];
  currentBalances: MarginAccountCurrentBalance[];
  projectedBalances: MarginAccountProjectedBalance[];
}

interface CashAccountData extends BaseAccountData {
  type: AccountType.Cash;
  initialBalances: CashAccountInitialBalance[];
  currentBalances: CashAccountCurrentBalance[];
  projectedBalances: CashAccountProjectedBalance[];
}

export type AccountData = MarginAccountData | CashAccountData;

export interface GetAccountOptions {
  positions?: boolean;
  orders?: boolean;
}

interface GetAccountResponse {
  securitiesAccount: AccountData;
}

export class AccountClient {
  constructor(private client: Client) {}

  async getAccounts(options?: GetAccountOptions) {
    const fields = [];
    options?.positions && fields.push('positions');
    options?.orders && fields.push('orders');

    const response = await this.client.get<GetAccountResponse[]>('accounts', {
      fields,
    });

    return response.data.map((data) => data.securitiesAccount);
  }

  async getAccount(accountId: number, options?: GetAccountOptions) {
    const fields = [];
    options?.positions && fields.push('positions');
    options?.orders && fields.push('orders');

    const response = await this.client.get<GetAccountResponse>(
      `accounts/${accountId}`,
      { fields }
    );

    return response.data.securitiesAccount;
  }
}

abstract class BaseAccount {
  constructor(
    protected data: AccountData,
    protected accountClient: AccountClient,
    protected orderClient: OrderClient,
    protected savedOrderClient: SavedOrderClient,
    protected transactionClient: TransactionClient,
    protected userInfoClient: UserInfoClient,
    protected watchlistClient: WatchlistClient
  ) {}

  get type() {
    return this.data.type;
  }

  get accountId() {
    return this.data.accountId;
  }

  get roundTrips() {
    return this.data.roundTrips;
  }

  get isDayTrader() {
    return this.data.isDayTrader;
  }

  get isClosingOnlyRestricted() {
    return this.data.isClosingOnlyRestricted;
  }

  get positions() {
    return this.data.positions;
  }

  get orders() {
    return this.data.orderStrategies;
  }

  toJson() {
    return { ...this.data } as AccountData;
  }

  async cancelOrder(orderId: number) {
    await this.orderClient.cancelOrder(this.accountId, orderId);
  }

  async getOrder(orderId: number) {
    const data = await this.orderClient.getOrder(this.accountId, orderId);
    return createOrderInstance(data, this.orderClient);
  }

  async getOrders(options: Omit<GetOrdersOptions, 'accountId'>) {
    const data = await this.orderClient.getOrders({
      accountId: this.accountId,
      ...options,
    });
    return createOrderInstances(data, this.orderClient);
  }

  async placeOrder(order: Partial<OrderData>) {
    const data = await this.orderClient.placeOrder(this.accountId, order);
    return createOrderInstance(data, this.orderClient);
  }

  async replaceOrder(orderId: number, order: Partial<OrderData>) {
    const data = await this.orderClient.replaceOrder(
      this.accountId,
      orderId,
      order
    );
    return createOrderInstance(data, this.orderClient);
  }

  async createSavedOrder(order: Partial<OrderData>) {
    const data = await this.savedOrderClient.createSavedOrder(
      this.accountId,
      order
    );

    return createSavedOrderInstance(
      data,
      this.orderClient,
      this.savedOrderClient
    );
  }

  async deleteSavedOrder(savedOrderId: number) {
    await this.savedOrderClient.deleteSavedOrder(this.accountId, savedOrderId);
  }

  async getSavedOrder(savedOrderId: number) {
    const data = await this.savedOrderClient.getSavedOrder(
      this.accountId,
      savedOrderId
    );

    return createSavedOrderInstance(
      data,
      this.orderClient,
      this.savedOrderClient
    );
  }

  async getSavedOrders() {
    const data = await this.savedOrderClient.getSavedOrders(this.accountId);

    return createSavedOrderInstances(
      data,
      this.orderClient,
      this.savedOrderClient
    );
  }

  async replaceSavedOrder(savedOrderId: number, order: Partial<OrderData>) {
    const data = await this.savedOrderClient.replaceSavedOrder(
      this.accountId,
      savedOrderId,
      order
    );

    return createSavedOrderInstance(
      data,
      this.orderClient,
      this.savedOrderClient
    );
  }

  async getTransaction(transactionId: number) {
    const data = await this.transactionClient.getTransaction(
      this.accountId,
      transactionId
    );

    return createTransactionInstance(data, this.transactionClient);
  }

  async getTransactions(options?: GetTransactionsOptions) {
    const data = await this.transactionClient.getTransactions(
      this.accountId,
      options
    );

    return createTransactionInstances(data, this.transactionClient);
  }

  async getPreferences() {
    return await this.userInfoClient.getPreferences(this.accountId);
  }

  async updatePreferences(accountId: number, preferences: Preferences) {
    await this.userInfoClient.updatePreferences(this.accountId, preferences);
  }

  async createWatchlist(watchlist: CreateWatchlistRequest) {
    await this.watchlistClient.createWatchlist(this.accountId, watchlist);
  }

  async deleteWatchlist(watchlistId: number) {
    await this.watchlistClient.deleteWatchlist(this.accountId, watchlistId);
  }

  async getWatchlist(watchlistId: number) {
    const data = await this.watchlistClient.getWatchlist(
      this.accountId,
      watchlistId
    );

    return createWatchlistInstance(data, this.watchlistClient);
  }

  async getWatchlists() {
    const data = await this.watchlistClient.getWatchlists(this.accountId);
    return createWatchlistInstances(data, this.watchlistClient);
  }

  async replaceWatchlist(
    watchlistId: number,
    watchlist: UpdateWatchlistRequest
  ) {
    await this.watchlistClient.replaceWatchlist(
      this.accountId,
      watchlistId,
      watchlist
    );
  }

  async refresh() {
    this.data = await this.accountClient.getAccount(this.accountId, {
      positions: this.positions != null,
      orders: this.orders != null,
    });
  }
}

export class MarginAccount extends BaseAccount {
  constructor(
    protected data: MarginAccountData,
    accountClient: AccountClient,
    orderClient: OrderClient,
    savedOrderClient: SavedOrderClient,
    transactionClient: TransactionClient,
    userInfoClient: UserInfoClient,
    watchlistClient: WatchlistClient
  ) {
    super(
      data,
      accountClient,
      orderClient,
      savedOrderClient,
      transactionClient,
      userInfoClient,
      watchlistClient
    );
  }

  get initialBalances() {
    return this.data.initialBalances;
  }

  get currentBalances() {
    return this.data.currentBalances;
  }

  get projectedBalances() {
    return this.data.projectedBalances;
  }

  toJson() {
    return { ...this.data } as MarginAccountData;
  }
}

export class CashAccount extends BaseAccount {
  constructor(
    protected data: CashAccountData,
    accountClient: AccountClient,
    orderClient: OrderClient,
    savedOrderClient: SavedOrderClient,
    transactionClient: TransactionClient,
    userInfoClient: UserInfoClient,
    watchlistClient: WatchlistClient
  ) {
    super(
      data,
      accountClient,
      orderClient,
      savedOrderClient,
      transactionClient,
      userInfoClient,
      watchlistClient
    );
  }

  get initialBalances() {
    return this.data.initialBalances;
  }

  get currentBalances() {
    return this.data.currentBalances;
  }

  get projectedBalances() {
    return this.data.projectedBalances;
  }

  toJson() {
    return { ...this.data } as CashAccountData;
  }
}

export type Account = MarginAccount | CashAccount;

export function createAccountInstance(
  data: AccountData,
  accountClient: AccountClient,
  orderClient: OrderClient,
  savedOrderClient: SavedOrderClient,
  transactionClient: TransactionClient,
  userInfoClient: UserInfoClient,
  watchlistClient: WatchlistClient
) {
  return data.type === AccountType.Margin
    ? new MarginAccount(
        data,
        accountClient,
        orderClient,
        savedOrderClient,
        transactionClient,
        userInfoClient,
        watchlistClient
      )
    : new CashAccount(
        data,
        accountClient,
        orderClient,
        savedOrderClient,
        transactionClient,
        userInfoClient,
        watchlistClient
      );
}

export function createAccountInstances(
  data: AccountData[],
  accountClient: AccountClient,
  orderClient: OrderClient,
  savedOrderClient: SavedOrderClient,
  transactionClient: TransactionClient,
  userInfoClient: UserInfoClient,
  watchlistClient: WatchlistClient
) {
  return data.map((data) =>
    createAccountInstance(
      data,
      accountClient,
      orderClient,
      savedOrderClient,
      transactionClient,
      userInfoClient,
      watchlistClient
    )
  );
}
