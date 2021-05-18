import { Mutex, Semaphore } from 'async-mutex';
import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import * as fs from 'fs';
import { checkAccess } from './auth';

export interface TDAmeritradeTokens {
  accessToken: string;
  accessTokenExpires: Date;
  refreshToken: string;
  refreshTokenExpires: Date;
}

export interface TDAmeritradeRequest {
  request: AxiosRequestConfig;
  throttled: boolean;
}

export interface TDAmeritradeResponse {
  request: AxiosRequestConfig;
  response: AxiosResponse;
  throttled: boolean;
}

export interface TDAmeritradeError {
  request: AxiosRequestConfig;
  error: AxiosError;
  throttled: boolean;
}

export interface TDAmeritradeConfig {
  apiKey: string;
  apiUrl?: string;

  sslKey: string;
  sslCert: string;
  redirectUri: string;

  accessToken?: string;
  accessTokenExpires?: Date;
  refreshToken?: string;
  refreshTokenExpires?: Date;

  retries?: number;
  timeout?: number;
  maxRequestsPerMinute?: number;
  maxConcurrentRequests?: number;

  onAuth(oauthUrl: string): void | Promise<void>;
  onTokens(tokens: TDAmeritradeTokens): void | Promise<void>;
  onRequestQueued?: (request: TDAmeritradeRequest) => void | Promise<void>;
  onRequest?: (request: TDAmeritradeRequest) => void | Promise<void>;
  onResponse?: (response: TDAmeritradeResponse) => void | Promise<void>;
  onRetry?: (error: TDAmeritradeError) => void | Promise<void>;
  onFailed?: (error: TDAmeritradeError) => void | Promise<void>;
}

export interface TDAmeritrade {
  readonly apiKey: string;
  readonly baseURL: string;

  readonly redirectUri: string;
  readonly sslKey: string;
  readonly sslCert: string;

  readonly retries: number;
  readonly timeout: number;
  readonly maxRequestsPerMinute: number;
  readonly maxConcurrentRequests: number;

  auth: TDAmeritradeTokens;
  recentRequestTimestamps: number[];

  readonly throttleLock: Mutex;
  readonly requestLock: Semaphore;

  readonly onAuth?: (oauthUrl: string) => void | Promise<void>;
  readonly onTokens?: (tokens: TDAmeritradeTokens) => void | Promise<void>;
  readonly onRequestQueued?: (
    request: TDAmeritradeRequest
  ) => void | Promise<void>;
  readonly onRequest?: (request: TDAmeritradeRequest) => void | Promise<void>;
  readonly onResponse?: (
    response: TDAmeritradeResponse
  ) => void | Promise<void>;
  readonly onRetry?: (error: TDAmeritradeError) => void | Promise<void>;
  readonly onFailed?: (error: TDAmeritradeError) => void | Promise<void>;
}

export async function tdameritrade(config: TDAmeritradeConfig) {
  if (!config.apiKey) {
    throw new Error('Missing `apiKey` property');
  }

  if (!config.sslKey) {
    throw new Error('Missing `sslKey` property');
  }

  if (!fs.existsSync(config.sslKey)) {
    throw new Error(`Cannot read SSL key path: ${config.sslKey}`);
  }

  if (!config.sslCert) {
    throw new Error('Missing `sslCert` config property');
  }

  if (!fs.existsSync(config.sslCert)) {
    throw new Error(`Cannot read SSL cert path: ${config.sslKey}`);
  }

  const td: TDAmeritrade = {
    apiKey: config.apiKey,
    baseURL: config.apiUrl ?? 'https://api.tdameritrade.com/v1',

    redirectUri: config.redirectUri,
    sslKey: config.sslKey,
    sslCert: config.sslCert,

    retries: config.retries ?? 0,
    timeout: config.timeout ?? 10_000,
    maxRequestsPerMinute: config.maxRequestsPerMinute ?? 120,
    maxConcurrentRequests: config.maxConcurrentRequests ?? 5,

    auth: {
      accessToken: config.accessToken,
      accessTokenExpires: config.accessTokenExpires,
      refreshToken: config.refreshToken,
      refreshTokenExpires: config.refreshTokenExpires,
    },
    recentRequestTimestamps: [],

    throttleLock: new Mutex(),
    requestLock: new Semaphore(config.maxConcurrentRequests ?? 5),

    onAuth: config.onAuth,
    onTokens: config.onTokens,
    onRequestQueued: config.onRequestQueued,
    onRequest: config.onRequest,
    onResponse: config.onResponse,
    onRetry: config.onRetry,
    onFailed: config.onFailed,
  };

  await checkAccess(td);

  return td;
}
