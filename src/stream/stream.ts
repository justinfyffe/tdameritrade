import { EventEmitter2 } from 'eventemitter2';
import {
  AccountSettings,
  UserInfoService,
  UserPrincipal,
  UserPrincipalField,
} from '../user-info';
import { AccountService } from './accounts';
import { ActiveService } from './actives';
import { ChartService } from './charts';
import { Client } from './client';
import { NewsService } from './news';
import { Quotes } from './quotes';
import { TimeSaleService } from './timesales';

export enum QualityOfService {
  Express = 0, // 500ms
  RealTime = 1, // 750ms
  Fast = 2, // 1000ms (default)
  Moderate = 3, // 1500ms,
  Slow = 4, // 3000ms
  Delayed = 5, // 5000ms
}

export enum StreamEvent {
  Open = 'open',
  Close = 'close',
  Error = 'error',
}

export interface StreamContext {
  socket?: WebSocket;
  account?: AccountSettings;
  userPrincipals?: UserPrincipal;
}

interface StreamCredentials {
  userid: string;
  token: string;
  company: string;
  segment: string;
  cddomain: string;
  usergroup: string;
  accesslevel: string;
  authorized: 'Y';
  timestamp: number;
  appid: string;
  acl: string;
}

interface StreamOptions {
  accountId?: string;
}

export class Stream {
  readonly accounts: AccountService;
  readonly actives: ActiveService;
  readonly charts: ChartService;
  readonly news: NewsService;
  readonly quotes: Quotes;
  readonly timeSales: TimeSaleService;

  private client: Client;
  private userPrincipals: UserPrincipal;
  private accountSettings: AccountSettings;

  private emitter = new EventEmitter2();

  constructor(private userInfo: UserInfoService) {
    this.client = new Client();

    this.accounts = new AccountService(this.client);
    this.actives = new ActiveService(this.client);
    this.charts = new ChartService(this.client);
    this.news = new NewsService(this.client);
    this.quotes = new Quotes(this.client);
    this.timeSales = new TimeSaleService(this.client);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  on(event: StreamEvent, fn: (...args: any[]) => void | Promise<void>) {
    this.emitter.on(event, fn);
  }

  async open(options?: StreamOptions) {
    if (this.client.isOpen()) {
      return;
    }

    this.userPrincipals = await this.userInfo.getUserPrincipals([
      UserPrincipalField.StreamerConnectionInfo,
      UserPrincipalField.StreamerSubscriptionKeys,
    ]);

    this.accountSettings = this.getAccount(
      this.userPrincipals.accounts,
      options?.accountId ?? this.userPrincipals.primaryAccountId
    );

    if (this.accountSettings == null) {
      throw new StreamError({
        userPrincipals: this.userPrincipals,
      });
    }

    this.accounts.setSubscriptionKey(
      this.userPrincipals.streamerSubscriptionKeys.keys[0].key
    );

    await this.client.open(
      this.userPrincipals.streamerInfo.streamerSocketUrl,
      this.userPrincipals.streamerInfo.appId,
      this.accountSettings.accountId
    );
  }

  close() {
    this.client.close();
  }

  async login() {
    const credentials: StreamCredentials = {
      userid: this.accountSettings.accountId,
      token: this.userPrincipals.streamerInfo.token,
      company: this.accountSettings.company,
      segment: this.accountSettings.segment,
      cddomain: this.accountSettings.accountCdDomainId,
      usergroup: this.userPrincipals.streamerInfo.userGroup,
      accesslevel: this.userPrincipals.streamerInfo.accessLevel,
      authorized: 'Y',
      timestamp: new Date(
        this.userPrincipals.streamerInfo.tokenTimestamp
      ).getTime(),
      appid: this.userPrincipals.streamerInfo.appId,
      acl: this.userPrincipals.streamerInfo.acl,
    };

    await this.client.send({
      service: 'ADMIN',
      command: 'LOGIN',
      parameters: {
        credential: jsonToQueryString(credentials),
        token: this.userPrincipals.streamerInfo.token,
        version: '1.0',
      },
    });
  }

  async logout() {
    await this.client.send({
      service: 'ADMIN',
      command: 'LOGOUT',
    });
  }

  async changeQualityOfService(qos: QualityOfService) {
    await this.client.send({
      service: 'ADMIN',
      command: 'QOS',
      parameters: { qoslevel: qos },
    });
  }

  private getAccount(accounts: AccountSettings[], accountId: string) {
    return accounts.find((account) => account.accountId === accountId)!;
  }
}

function jsonToQueryString<T = unknown>(json: T) {
  return Object.keys(json)
    .map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(json[key]))
    .join('&');
}

export class StreamError extends Error {
  context?: StreamContext;

  constructor(context?: StreamContext) {
    super('An error has occurred while calling TD Ameritrade via stream');
    this.context = context;
  }
}
