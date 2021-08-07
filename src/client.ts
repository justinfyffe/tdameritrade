import axios, { AxiosRequestConfig } from 'axios';
import * as querystring from 'querystring';
import {
  TDAmeritrade,
  TDAmeritradeContext,
  TDAmeritradeError,
} from './tdameritrade';

export async function apiGet<T = unknown>(
  td: TDAmeritrade,
  path: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any
) {
  const query = data != null ? `?${querystring.stringify(data)}` : '';
  return await makeRequest<T>(td, 'get', `/${path}${query}`, null);
}

export async function apiPost<T = unknown>(
  td: TDAmeritrade,
  path: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any
) {
  return await makeRequest<T>(td, 'post', path, data);
}

export async function apiPut<T = unknown>(
  td: TDAmeritrade,
  path: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any
) {
  return await makeRequest<T>(td, 'put', path, data);
}

export async function apiDelete(td: TDAmeritrade, path: string) {
  return await makeRequest(td, 'delete', path);
}

export async function makeRequest<T>(
  td: TDAmeritrade,
  method: 'get' | 'post' | 'put' | 'delete',
  path: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any
) {
  let error: TDAmeritradeError | null = null;
  const context: TDAmeritradeContext = { retries: 0 };

  let success = true;
  do {
    context.request = buildRequest(td, method, path, data);
    context.timestamp = new Date();

    try {
      await td.onRequest?.(context);
      context.response = await axios.request<T>(context.request);
    } catch (e) {
      context.retries!++;
      context.error = e;

      if (context.retries! <= td.retries) {
        await td.onRetry?.(context);
      } else {
        success = false;
        error = new TDAmeritradeError(context);
        await td.onFailed?.(context);
      }
    }
  } while (!success && context.retries! <= td.retries);

  if (success && context.response != null) {
    await td.onResponse?.(context);
  }

  if (!success && error != null) {
    throw error;
  }

  return context.response!;
}

function buildRequest(
  td: TDAmeritrade,
  method: 'get' | 'post' | 'put' | 'delete',
  path: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any
) {
  return {
    method,
    baseURL: td.baseURL,
    url: path,
    data: querystring.stringify(data),
    headers: {
      Authorization: `Bearer ${td.auth.accessToken}`,
      Accept: 'application/json',
    },
    timeout: td.timeout,
  } as AxiosRequestConfig;
}
