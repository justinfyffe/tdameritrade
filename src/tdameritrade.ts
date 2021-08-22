import { AccountService } from './accounts';
import { AuthService } from './auth';
import { Client } from './client';
import { InstrumentService } from './instruments';
import { MarketHoursService } from './market-hours';
import { MoverService } from './movers';
import { OptionChainService } from './option-chains';
import { OrderService } from './orders';
import { PriceHistoryService } from './price-history';
import { QuoteService } from './quotes';
import { SavedOrders } from './saved-orders';
import { Stream } from './stream/stream';
import { TransactionService } from './transactions';
import { UserInfoService } from './user-info';
import { WatchlistService } from './watchlists';

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
  readonly auth: AuthService;
  readonly accounts: AccountService;
  readonly instruments: InstrumentService;
  readonly marketHours: MarketHoursService;
  readonly movers: MoverService;
  readonly optionChains: OptionChainService;
  readonly orders: OrderService;
  readonly priceHistory: PriceHistoryService;
  readonly quotes: QuoteService;
  readonly savedOrders: SavedOrders;
  readonly stream: Stream;
  readonly transactions: TransactionService;
  readonly userInfo: UserInfoService;
  readonly watchlists: WatchlistService;

  constructor(config: TdAmeritradeConfig) {
    this.auth = new AuthService(
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

    this.accounts = new AccountService(this.client);
    this.instruments = new InstrumentService(this.client);
    this.marketHours = new MarketHoursService(this.client);
    this.movers = new MoverService(this.client);
    this.optionChains = new OptionChainService(this.client);
    this.orders = new OrderService(this.client);
    this.priceHistory = new PriceHistoryService(this.client);
    this.quotes = new QuoteService(this.client);
    this.savedOrders = new SavedOrders(this.client);
    this.transactions = new TransactionService(this.client);
    this.userInfo = new UserInfoService(this.client);
    this.watchlists = new WatchlistService(this.client);

    this.stream = new Stream(this.userInfo);
  }
}
