import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { EventEmitter2 } from 'eventemitter2';
import * as querystring from 'querystring';
import { v4 as uuidv4 } from 'uuid';
import { AuthService } from './auth';

export enum ClientEvent {
  Request = 'request',
  Response = 'response',
  Retry = 'retry',
  Failed = 'failed',
}

export interface ClientContext<T = unknown> {
  requestId: string;
  retries: number;

  request?: AxiosRequestConfig;
  response?: AxiosResponse<T>;
  error?: AxiosError;
  timestamp?: Date;
  metadata?: unknown;
}

export interface ClientConfig {
  baseUrl: string;
  auth: AuthService;
  timeout?: number;
  retries?: number;
}

export class Client {
  private baseUrl: string;
  private timeout: number;
  private retries: number;
  private auth: AuthService;

  private emitter = new EventEmitter2();

  constructor(options: ClientConfig) {
    this.baseUrl = options.baseUrl;
    this.auth = options.auth;
    this.retries = options.retries ?? 3;
    this.timeout = options.timeout ?? 10_000;
  }

  onRequest(fn: (content: ClientContext) => void | Promise<void>) {
    this.emitter.on(ClientEvent.Request, fn);
  }

  onResponse(fn: (content: ClientContext) => void | Promise<void>) {
    this.emitter.on(ClientEvent.Response, fn);
  }

  onRetry(fn: (content: ClientContext) => void | Promise<void>) {
    this.emitter.on(ClientEvent.Retry, fn);
  }

  onFailed(fn: (content: ClientContext) => void | Promise<void>) {
    this.emitter.on(ClientEvent.Failed, fn);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async get<T = unknown>(path: string, data?: any) {
    const query = data != null ? `?${querystring.stringify(data)}` : '';
    return await this.request<T>('get', `/${path}${query}`, null);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async post<T = unknown>(path: string, data?: any) {
    return await this.request<T>('post', path, data);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async put<T = unknown>(path: string, data?: any) {
    return await this.request<T>('put', path, data);
  }

  async delete(path: string) {
    return await this.request('delete', path);
  }

  private async request<T = unknown>(
    method: 'get' | 'post' | 'put' | 'delete',
    path: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?: any
  ) {
    let error: ClientError | null = null;
    const context: ClientContext<T> = { requestId: uuidv4(), retries: 0 };

    let success = true;
    do {
      context.request = await this.buildRequest(method, path, data);
      context.timestamp = new Date();

      try {
        await this.emitter.emitAsync(ClientEvent.Request, context);
        context.response = await axios.request<T>(context.request);
      } catch (e) {
        context.retries!++;
        context.error = e;

        if (context.retries! <= this.retries) {
          await this.emitter.emitAsync(ClientEvent.Retry, context);
        } else {
          success = false;
          error = new ClientError<T>(context);
          await this.emitter.emitAsync(ClientEvent.Failed, context);
        }
      }
    } while (!success && context.retries! <= this.retries);

    if (success && context.response != null) {
      await this.emitter.emitAsync(ClientEvent.Response, context);
    }

    if (!success && error != null) {
      throw error;
    }

    return context.response!;
  }

  private async buildRequest(
    method: 'get' | 'post' | 'put' | 'delete',
    path: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?: any
  ) {
    const accessToken = await this.auth.getAccessToken();
    return {
      method,
      baseURL: this.baseUrl,
      url: path,
      data: querystring.stringify(data),
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
      },
      timeout: this.timeout,
    } as AxiosRequestConfig;
  }
}

export class ClientError<T = unknown> extends Error {
  context?: ClientContext;

  constructor(context?: ClientContext<T>) {
    super('An error has occurred while calling TD Ameritrade via HTTP client');
    this.context = context;
  }
}
