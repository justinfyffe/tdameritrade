import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import * as querystring from 'querystring';
import { TDAmeritrade, TDAmeritradeError } from './tdameritrade';

export interface TDAmeritradeRequest extends AxiosRequestConfig {}
export interface TDAmeritradeResponse extends AxiosResponse {}

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
  const request = buildRequest(td, method, path, data);

  let response: AxiosResponse<T> | null = null;
  let error: TDAmeritradeError | null = null;
  let success = true;
  let retryCounter = 0;

  do {
    try {
      const request = buildRequest(td, method, path, data);
      await td.onRequest?.({ request });

      response = await axios.request<T>(buildRequest(td, method, path, data));

      // Break out of the loop
      retryCounter = td.retries + 1;
    } catch (e) {
      retryCounter++;

      if (retryCounter <= td.retries) {
        await td.onRetry?.({ request, error: e });
      } else {
        success = false;
        error = new TDAmeritradeError({ request, error: e });
        await td.onFailed?.(error);
      }
    }
  } while (retryCounter <= td.retries);

  if (success && response != null) {
    await td.onResponse?.({ request, response });
  }

  if (!success && error != null) {
    throw error;
  }

  return response!;
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
