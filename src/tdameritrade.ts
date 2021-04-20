import {
  AccountClient,
  createAccountInstance,
  createAccountInstances,
  GetAccountOptions,
} from './accounts';
import { Client } from './client';
import { Config, TDAmeritradeConfig } from './config';
import { EventEmitter, TDAmeritradeEvent } from './events';
import {
  createInstrumentInstance,
  createInstrumentInstances,
  InstrumentClient,
  SearchInstrumentOptions,
} from './instruments';
import {
  createMarketHoursInstance,
  createMarketHoursInstances,
  MarketHoursClient,
  MarketType,
} from './market-hours';
import { GetMoversOptions, MoverClient } from './movers';
import {
  createOptionChainInstance,
  GetOptionChainOptions,
  OptionChainClient,
} from './option-chains';
import {
  createOrderInstance,
  createOrderInstances,
  GetOrdersOptions,
  OrderClient,
  OrderData,
} from './orders';
import { GetPriceHistoryOptions, PriceHistoryClient } from './price-history';
import {
  createQuoteInstance,
  createQuotesInstances,
  QuoteClient,
} from './quotes';
import {
  createSavedOrderInstance,
  createSavedOrderInstances,
  SavedOrderClient,
  SavedOrderData,
} from './saved-orders';
import {
  createTransactionInstance,
  createTransactionInstances,
  GetTransactionsOptions,
  TransactionClient,
} from './transactions';
import { Preferences, UserInfoClient, UserPrincipalField } from './user-info';
import {
  createWatchlistInstance,
  createWatchlistInstances,
  CreateWatchlistRequest,
  UpdateWatchlistRequest,
  WatchlistClient,
} from './watchlists';

export class TDAmeritrade {
  private emitter: EventEmitter;
  private config: Config;
  private client: Client;
  private accountClient: AccountClient;
  private orderClient: OrderClient;
  private savedOrderClient: SavedOrderClient;
  private instrumentClient: InstrumentClient;
  private marketHoursClient: MarketHoursClient;
  private moverClient: MoverClient;
  private optionChainClient: OptionChainClient;
  private priceHistoryClient: PriceHistoryClient;
  private quoteClient: QuoteClient;
  private transactionClient: TransactionClient;
  private userInfoClient: UserInfoClient;
  private watchlistClient: WatchlistClient;

  constructor(config: TDAmeritradeConfig) {
    this.emitter = new EventEmitter();

    this.config = new Config(config);
    this.client = new Client(this.emitter, this.config);
    this.accountClient = new AccountClient(this.client);
    this.orderClient = new OrderClient(this.client);
    this.savedOrderClient = new SavedOrderClient(this.client);
    this.instrumentClient = new InstrumentClient(this.client);
    this.marketHoursClient = new MarketHoursClient(this.client);
    this.moverClient = new MoverClient(this.client);
    this.optionChainClient = new OptionChainClient(this.client);
    this.priceHistoryClient = new PriceHistoryClient(this.client);
    this.quoteClient = new QuoteClient(this.client);
    this.userInfoClient = new UserInfoClient(this.client);
    this.watchlistClient = new WatchlistClient(this.client);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  on(event: TDAmeritradeEvent, fn: (...args: any[]) => void, context?: any) {
    this.emitter.on(event, fn, context);
  }

  // Accounts

  async getAccounts(options?: GetAccountOptions) {
    const data = await this.accountClient.getAccounts(options);
    return createAccountInstances(
      data,
      this.accountClient,
      this.orderClient,
      this.savedOrderClient,
      this.transactionClient,
      this.userInfoClient,
      this.watchlistClient
    );
  }

  async getAccount(accountId: number, options?: GetAccountOptions) {
    const data = await this.accountClient.getAccount(accountId, options);
    return createAccountInstance(
      data,
      this.accountClient,
      this.orderClient,
      this.savedOrderClient,
      this.transactionClient,
      this.userInfoClient,
      this.watchlistClient
    );
  }

  // Orders

  async cancelOrder(accountId: number, orderId: number) {
    await this.orderClient.cancelOrder(accountId, orderId);
  }

  async getOrder(accountId: number, orderId: number) {
    const data = await this.orderClient.getOrder(accountId, orderId);
    return createOrderInstance(data, this.orderClient);
  }

  async getOrders(options: GetOrdersOptions) {
    const data = await this.orderClient.getOrders(options);
    return createOrderInstances(data, this.orderClient);
  }

  async placeOrder(accountId: number, order: OrderData) {
    const data = await this.orderClient.placeOrder(accountId, order);
    return createOrderInstance(data, this.orderClient);
  }

  async replaceOrder(accountId: number, orderId: number, order: OrderData) {
    const data = await this.orderClient.replaceOrder(accountId, orderId, order);
    return createOrderInstance(data, this.orderClient);
  }

  // Saved Orders

  async createSavedOrder(accountId: number, order: SavedOrderData) {
    const data = await this.savedOrderClient.createSavedOrder(accountId, order);
    return createSavedOrderInstance(
      data,
      this.orderClient,
      this.savedOrderClient
    );
  }

  async deleteSavedOrder(accountId: number, savedOrderId: number) {
    await this.savedOrderClient.deleteSavedOrder(accountId, savedOrderId);
  }

  async getSavedOrder(accountId: number, savedOrderId: number) {
    const data = await this.savedOrderClient.getSavedOrder(
      accountId,
      savedOrderId
    );
    return createSavedOrderInstance(
      data,
      this.orderClient,
      this.savedOrderClient
    );
  }

  async getSavedOrders(accountId: number) {
    const data = await this.savedOrderClient.getSavedOrders(accountId);
    return createSavedOrderInstances(
      data,
      this.orderClient,
      this.savedOrderClient
    );
  }

  async replaceSavedOrder(
    accountId: number,
    savedOrderId: number,
    order: SavedOrderData
  ) {
    const data = await this.savedOrderClient.replaceSavedOrder(
      accountId,
      savedOrderId,
      order
    );
    return createSavedOrderInstance(
      data,
      this.orderClient,
      this.savedOrderClient
    );
  }

  // Instruments

  async searchInstruments(options: SearchInstrumentOptions) {
    const data = await this.instrumentClient.searchInstruments(options);
    return createInstrumentInstances(data, this.instrumentClient);
  }

  async getInstrument(cusip: string) {
    const data = await this.instrumentClient.getInstrument(cusip);
    return createInstrumentInstance(data, this.instrumentClient);
  }

  // Market Hours

  async getMarketHours(markets: MarketType | MarketType[], date: string) {
    const data = await this.marketHoursClient.getHours(markets, date);
    return Array.isArray(data)
      ? createMarketHoursInstances(data, this.marketHoursClient)
      : createMarketHoursInstance(data, this.marketHoursClient);
  }

  // Movers

  async getMovers(index: string, options?: GetMoversOptions) {
    return await this.moverClient.getMovers(index, options);
  }

  // Option Chains

  async getOptionChain(symbol: string, options?: GetOptionChainOptions) {
    const data = await this.optionChainClient.getOptionChain(symbol, options);
    return createOptionChainInstance(data, options, this.optionChainClient);
  }

  // Price History

  async getPriceHistory(symbol: string, options?: GetPriceHistoryOptions) {
    return await this.priceHistoryClient.getPriceHistory(symbol, options);
  }

  // Quotes

  async getQuote(symbol: string) {
    const data = await this.quoteClient.getQuote(symbol);
    return createQuoteInstance(data, this.quoteClient);
  }

  async getQuotes(symbols: string[]) {
    const data = await this.quoteClient.getQuotes(symbols);
    return createQuotesInstances(data, this.quoteClient);
  }

  // Transactions

  async getTransaction(accountId: number, transactionId: number) {
    const data = await this.transactionClient.getTransaction(
      accountId,
      transactionId
    );
    return createTransactionInstance(data, this.transactionClient);
  }

  async getTransactions(accountId: number, options?: GetTransactionsOptions) {
    const data = await this.transactionClient.getTransactions(
      accountId,
      options
    );
    return createTransactionInstances(data, this.transactionClient);
  }

  // User Info

  async getPreferences(accountId: number) {
    return await this.userInfoClient.getPreferences(accountId);
  }

  async updatePreferences(accountId: number, preferences: Preferences) {
    await this.userInfoClient.updatePreferences(accountId, preferences);
  }

  async getStreamerSubscriptionKeys(accountIds: number[]) {
    return await this.userInfoClient.getStreamerSubscriptionKeys(accountIds);
  }

  async getUserPrincipals(fields: UserPrincipalField[] = []) {
    return await this.userInfoClient.getUserPrincipals(fields);
  }

  // Watchlists

  async createWatchlist(accountId: number, watchlist: CreateWatchlistRequest) {
    await this.watchlistClient.createWatchlist(accountId, watchlist);
  }

  async deleteWatchlist(accountId: number, watchlistId: number) {
    await this.watchlistClient.deleteWatchlist(accountId, watchlistId);
  }

  async getWatchlist(accountId: number, watchlistId: number) {
    const data = await this.watchlistClient.getWatchlist(
      accountId,
      watchlistId
    );
    return createWatchlistInstance(data, this.watchlistClient);
  }

  async getWatchlists(accountId?: number) {
    const data = await this.watchlistClient.getWatchlists(accountId);
    return createWatchlistInstances(data, this.watchlistClient);
  }

  async replaceWatchlist(
    accountId: number,
    watchlistId: number,
    watchlist: UpdateWatchlistRequest
  ) {
    await this.watchlistClient.replaceWatchlist(
      accountId,
      watchlistId,
      watchlist
    );
  }
}
