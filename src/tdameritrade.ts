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
import {
  createOrderInstance,
  createOrderInstances,
  GetOrdersOptions,
  OrderClient,
  OrderData,
} from './orders';
import {
  createSavedOrderInstance,
  createSavedOrderInstances,
  SavedOrderClient,
  SavedOrderData,
} from './saved-orders';

export class TDAmeritrade {
  private emitter: EventEmitter;
  private config: Config;
  private client: Client;
  private accountClient: AccountClient;
  private orderClient: OrderClient;
  private savedOrderClient: SavedOrderClient;
  private instrumentClient: InstrumentClient;
  private marketHoursClient: MarketHoursClient;

  constructor(config: TDAmeritradeConfig) {
    this.emitter = new EventEmitter();

    this.config = new Config(config);
    this.client = new Client(this.emitter, this.config);
    this.accountClient = new AccountClient(this.client);
    this.orderClient = new OrderClient(this.client);
    this.savedOrderClient = new SavedOrderClient(this.client);
    this.instrumentClient = new InstrumentClient(this.client);
    this.marketHoursClient = new MarketHoursClient(this.client);
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
      this.savedOrderClient
    );
  }

  async getAccount(accountId: number, options?: GetAccountOptions) {
    const data = await this.accountClient.getAccount(accountId, options);
    return createAccountInstance(
      data,
      this.accountClient,
      this.orderClient,
      this.savedOrderClient
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

  // Option Chains

  // Price History

  // Quotes

  // Transactions

  // User Info

  // Watchlists
}
