import * as querystring from 'querystring';
import { checkAccess } from './auth';
import { TDAmeritrade } from './tdameritrade';

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
  await checkAccess(td);
  return await td.axios.request<T>({
    method,
    url: path,
    data: querystring.stringify(data),
    headers: {
      Authorization: `Bearer ${td.accessToken}`,
      Accept: 'application/json',
    },
  });
}
