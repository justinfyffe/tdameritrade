import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import * as WebSocket from 'ws';
import { Accounts } from './accounts';
import { Auth } from './auth';
import { Client } from './client';
import { Instruments } from './instruments';
import { MarketHours } from './market-hours';
import { Movers } from './movers';
import { OptionChains } from './option-chains';
import { Orders } from './orders';
import { PriceHistory } from './price-history';
import { Quotes } from './quotes';
import { SavedOrders } from './saved-orders';
import { Transactions } from './transactions';
import { AccountSettings, UserInfo, UserPrincipal } from './user-info';
import { Watchlists } from './watchlists';

export interface TDAmeritradeTokens {
  accessToken?: string;
  accessTokenExpires?: number;
  refreshToken?: string;
  refreshTokenExpires?: number;
}

export interface TDAmeritradeClientContext<T = unknown> {
  request?: AxiosRequestConfig;
  response?: AxiosResponse<T>;
  error?: AxiosError;
  retries?: number;
  timestamp?: Date;
  metadata?: unknown;
}

export interface TDAmeritradeRequestContext<T = unknown> {
  requestId: string;
  retries: number;

  request?: AxiosRequestConfig;
  response?: AxiosResponse<T>;
  error?: AxiosError;
  timestamp?: Date;
  metadata?: unknown;
}

export interface TDAmeritradeStreamContext {
  socket: WebSocket;
  account: AccountSettings;
  userPrincipals: UserPrincipal;
}

export class TDAmeritradeError extends Error {
  requestContext?: TDAmeritradeRequestContext;
  streamContext?: TDAmeritradeStreamContext;

  constructor(context?: {
    request?: TDAmeritradeRequestContext;
    stream?: TDAmeritradeStreamContext;
  }) {
    super('An error has occurred while calling TD Ameritrade');
    this.requestContext = context?.request;
    this.streamContext = context?.stream;
  }
}

export interface TDAmeritradeConfig {
  apiKey: string;
  apiUrl?: string;

  sslKey: string;
  sslCert: string;
  redirectUri: string;

  accessToken?: string;
  accessTokenExpires?: number;
  refreshToken?: string;
  refreshTokenExpires?: number;
  autoRefreshTokens?: boolean;

  retries?: number;
  timeout?: number;

  onAuth?(oauthUrl: string): void | Promise<void>;
  onTokens?(tokens: TDAmeritradeTokens): void | Promise<void>;
  onRequest?: (context: TDAmeritradeClientContext) => void | Promise<void>;
  onResponse?: (context: TDAmeritradeClientContext) => void | Promise<void>;
  onRetry?: (context: TDAmeritradeClientContext) => void | Promise<void>;
  onFailed?: (context: TDAmeritradeClientContext) => void | Promise<void>;
}

export interface TDAmeritrade2 {
  readonly apiKey: string;
  readonly baseURL: string;

  readonly redirectUri?: string;
  readonly sslKey?: string;
  readonly sslCert?: string;

  readonly retries: number;
  readonly timeout: number;

  auth: TDAmeritradeTokens;
  stream?: TDAmeritradeStreamContext;

  readonly onAuth?: (oauthUrl: string) => void | Promise<void>;
  readonly onTokens?: (tokens: TDAmeritradeTokens) => void | Promise<void>;
  readonly onRequest?: (
    context: TDAmeritradeClientContext
  ) => void | Promise<void>;
  readonly onResponse?: (
    context: TDAmeritradeClientContext
  ) => void | Promise<void>;
  readonly onRetry?: (
    context: TDAmeritradeClientContext
  ) => void | Promise<void>;
  readonly onFailed?: (
    context: TDAmeritradeClientContext
  ) => void | Promise<void>;
}

export async function tdameritrade(config: TDAmeritradeConfig) {
  if (!config.apiKey) {
    throw new Error('Missing `apiKey` property');
  }

  const td: TDAmeritrade = {
    apiKey: config.apiKey,
    baseURL: config.apiUrl ?? 'https://api.tdameritrade.com/v1',

    redirectUri: config.redirectUri,
    sslKey: config.sslKey,
    sslCert: config.sslCert,

    retries: config.retries ?? 0,
    timeout: config.timeout ?? 10_000,

    auth: {
      accessToken: config.accessToken,
      accessTokenExpires: config.accessTokenExpires,
      refreshToken: config.refreshToken,
      refreshTokenExpires: config.refreshTokenExpires,
    },

    onAuth: config.onAuth,
    onTokens: config.onTokens,
    onRequest: config.onRequest,
    onResponse: config.onResponse,
    onRetry: config.onRetry,
    onFailed: config.onFailed,
  };

  return td;
}

export class TDAmeritrade {
  readonly client: Client;
  readonly auth: Auth;
  readonly accounts: Accounts;
  readonly instruments: Instruments;
  readonly marketHours: MarketHours;
  readonly movers: Movers;
  readonly optionChains: OptionChains;
  readonly orders: Orders;
  readonly priceHistory: PriceHistory;
  readonly quotes: Quotes;
  readonly savedOrders: SavedOrders;
  readonly transactions: Transactions;
  readonly userInfo: UserInfo;
  readonly watchlists: Watchlists;

  constructor(config: TDAmeritradeConfig) {
    this.auth = new Auth(
      {
        apiKey: config.apiKey,
        baseUrl: config.apiUrl ?? 'https://api.tdameritrade.com/v1',
        sslKey: config.sslKey,
        sslCert: config.sslCert,
        redirectUri: config.redirectUri,
        autoRefreshTokens: config.autoRefreshTokens ?? true,
      },
      {
        accessToken: config.accessToken,
        accessTokenExpires: config.accessTokenExpires,
        refreshToken: config.refreshToken,
        refreshTokenExpires: config.refreshTokenExpires,
      }
    );

    this.client = new Client({
      baseUrl: config.apiUrl ?? 'https://api.tdameritrade.com/v1',
      timeout: config.timeout,
      retries: config.retries,
      auth: this.auth,
    });

    this.accounts = new Accounts(this.client);
    this.instruments = new Instruments(this.client);
    this.marketHours = new MarketHours(this.client);
    this.movers = new Movers(this.client);
    this.optionChains = new OptionChains(this.client);
    this.orders = new Orders(this.client);
    this.priceHistory = new PriceHistory(this.client);
    this.quotes = new Quotes(this.client);
    this.savedOrders = new SavedOrders(this.client);
    this.transactions = new Transactions(this.client);
    this.userInfo = new UserInfo(this.client);
    this.watchlists = new Watchlists(this.client);
  }
}
