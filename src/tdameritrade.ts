import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

export interface TDAmeritradeTokens {
  accessToken?: string;
  accessTokenExpires?: number;
  refreshToken?: string;
  refreshTokenExpires?: number;
}

export interface TDAmeritradeContext {
  request?: AxiosRequestConfig;
  response?: AxiosResponse;
  error?: AxiosError;
  retries?: number;
  timestamp?: Date;
  metadata?: unknown;
}

export class TDAmeritradeError extends Error {
  context: TDAmeritradeContext;

  constructor(context: TDAmeritradeContext) {
    super('An error has occurred while calling TD Ameritrade');
    this.context = context;
  }
}

export interface TDAmeritradeConfig {
  apiKey: string;
  apiUrl?: string;

  sslKey?: string;
  sslCert?: string;
  redirectUri?: string;

  accessToken?: string;
  accessTokenExpires?: number;
  refreshToken?: string;
  refreshTokenExpires?: number;

  retries?: number;
  timeout?: number;

  onAuth?(oauthUrl: string): void | Promise<void>;
  onTokens?(tokens: TDAmeritradeTokens): void | Promise<void>;
  onRequest?: (context: TDAmeritradeContext) => void | Promise<void>;
  onResponse?: (context: TDAmeritradeContext) => void | Promise<void>;
  onRetry?: (context: TDAmeritradeContext) => void | Promise<void>;
  onFailed?: (context: TDAmeritradeContext) => void | Promise<void>;
}

export interface TDAmeritrade {
  readonly apiKey: string;
  readonly baseURL: string;

  readonly redirectUri?: string;
  readonly sslKey?: string;
  readonly sslCert?: string;

  readonly retries: number;
  readonly timeout: number;

  auth: TDAmeritradeTokens;

  readonly onAuth?: (oauthUrl: string) => void | Promise<void>;
  readonly onTokens?: (tokens: TDAmeritradeTokens) => void | Promise<void>;
  readonly onRequest?: (context: TDAmeritradeContext) => void | Promise<void>;
  readonly onResponse?: (context: TDAmeritradeContext) => void | Promise<void>;
  readonly onRetry?: (context: TDAmeritradeContext) => void | Promise<void>;
  readonly onFailed?: (context: TDAmeritradeContext) => void | Promise<void>;
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
