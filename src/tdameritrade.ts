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
import { UserInfo } from './user-info';
import { Watchlists } from './watchlists';

export interface TdAmeritradeTokens {
  accessToken?: string;
  accessTokenExpires?: number;
  refreshToken?: string;
  refreshTokenExpires?: number;
}

export interface TdAmeritradeConfig {
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
}

export async function tdameritrade(config: TdAmeritradeConfig) {
  if (!config.apiKey) {
    throw new Error('Missing `apiKey` property');
  }

  return new TdAmeritrade(config);
}

export class TdAmeritrade {
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

  constructor(config: TdAmeritradeConfig) {
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
