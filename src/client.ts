import { SemaphoreInterface } from 'async-mutex';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import * as querystring from 'querystring';
import { checkAccess } from './auth';
import { TDAmeritrade } from './tdameritrade';

export interface TDAmeritradeRequest extends AxiosRequestConfig {}
export interface TDAmeritradeResponse extends AxiosResponse {}

interface RequestOptions {
  throttle?: boolean;
}

export async function apiGet<T = unknown>(
  td: TDAmeritrade,
  path: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any,
  options?: RequestOptions
) {
  const query = data != null ? `?${querystring.stringify(data)}` : '';
  return await makeRequest<T>(td, 'get', `/${path}${query}`, null, options);
}

export async function apiPost<T = unknown>(
  td: TDAmeritrade,
  path: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any,
  options?: RequestOptions
) {
  return await makeRequest<T>(td, 'post', path, data, options);
}

export async function apiPut<T = unknown>(
  td: TDAmeritrade,
  path: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any,
  options?: RequestOptions
) {
  return await makeRequest<T>(td, 'put', path, data, options);
}

export async function apiDelete(
  td: TDAmeritrade,
  path: string,
  options?: RequestOptions
) {
  return await makeRequest(td, 'delete', path, options);
}

export async function makeRequest<T>(
  td: TDAmeritrade,
  method: 'get' | 'post' | 'put' | 'delete',
  path: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any,
  options?: RequestOptions
) {
  const request = buildRequest(td, method, path, data);
  await td.onRequestQueued?.(request);

  let releaseLock: SemaphoreInterface.Releaser;
  if (options?.throttle ?? true) {
    // We only want a few requests at a time to prevent breaching rate limits
    const [_value, release] = await td.requestLock.acquire();
    releaseLock = release;
  }

  await td.onRequest?.(request);

  let response: AxiosResponse<T>;
  let retryCounter = 0;

  do {
    if (options?.throttle ?? true) {
      // Throttle the requests to avoid blowing through the rate limit
      await throttle(td);
    }

    try {
      await checkAccess(td);
      response = await axios.request<T>(buildRequest(td, method, path, data));

      // Break out of the loop
      retryCounter = td.retries + 1;
    } catch (error) {
      retryCounter++;

      if (retryCounter <= td.retries) {
        await td.onRetry(error);
      } else {
        await td.onFailed(error);
      }
    }
  } while (retryCounter <= td.retries);

  await td.onResponse?.(response);

  if (options?.throttle ?? true) {
    // Request is over, release lock so another request can try again.
    releaseLock();
  }

  return response;
}

async function throttle(td: TDAmeritrade) {
  const releaseLock = await td.throttleLock.acquire();

  if (hasExceededRateLimit(td)) {
    await delay(getThrottleTime(td));
  }

  td.recentRequestTimestamps.push(new Date().getTime());

  releaseLock();
}

function hasExceededRateLimit(td: TDAmeritrade) {
  const oneMinuteAgo = new Date().getTime() - 60_000;
  td.recentRequestTimestamps = td.recentRequestTimestamps.filter(
    (timestamp) => timestamp >= oneMinuteAgo
  );
  return td.recentRequestTimestamps.length > td.maxRequestsPerMinute;
}

function getThrottleTime(td: TDAmeritrade) {
  if (td.recentRequestTimestamps.length < td.maxRequestsPerMinute) {
    return 0;
  }

  const timeSinceEarliestRequest =
    new Date().getTime() - td.recentRequestTimestamps[0];
  return 60_000 - timeSinceEarliestRequest;
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
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
