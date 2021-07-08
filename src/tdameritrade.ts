import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

export interface TDAmeritradeTokens {
  accessToken?: string;
  accessTokenExpires?: number;
  refreshToken?: string;
  refreshTokenExpires?: number;
}

export interface TDAmeritradeRequest {
  request: AxiosRequestConfig;
}

export interface TDAmeritradeResponse {
  request: AxiosRequestConfig;
  response: AxiosResponse;
}

export interface TDAmeritradeRetry extends TDAmeritradeErrorContext {}

export class TDAmeritradeError extends Error {
  request: AxiosRequestConfig;
  error: AxiosError;

  constructor(context: TDAmeritradeErrorContext) {
    super('An error has occurred while calling TD Ameritrade');
    this.request = context.request;
    this.error = context.error;
  }
}

interface TDAmeritradeErrorContext {
  request: AxiosRequestConfig;
  error: AxiosError;
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
  onRequest?: (request: TDAmeritradeRequest) => void | Promise<void>;
  onResponse?: (response: TDAmeritradeResponse) => void | Promise<void>;
  onRetry?: (retry: TDAmeritradeRetry) => void | Promise<void>;
  onFailed?: (error: TDAmeritradeError) => void | Promise<void>;
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
  readonly onRequest?: (request: TDAmeritradeRequest) => void | Promise<void>;
  readonly onResponse?: (
    response: TDAmeritradeResponse
  ) => void | Promise<void>;
  readonly onRetry?: (retry: TDAmeritradeRetry) => void | Promise<void>;
  readonly onFailed?: (error: TDAmeritradeError) => void | Promise<void>;
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
