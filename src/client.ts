import axios, { AxiosInstance } from 'axios';
import * as querystring from 'querystring';
import { Config } from './config';
import { EventEmitter } from './events';
import { OAuth } from './oauth';

export class Client {
  private http: AxiosInstance;
  private oauth: OAuth;

  constructor(private emitter: EventEmitter, private config: Config) {
    this.http = axios.create({ baseURL: this.config.apiUrl });
    this.oauth = new OAuth(this.http, this.emitter, this.config);
  }

  async get<T = unknown>(path: string, data?) {
    const query = data != null ? `?${querystring.stringify(data)}` : '';
    return await this.request<T>('get', `/${path}${query}`);
  }

  async post<T = unknown>(path: string, data?) {
    return await this.request<T>('post', path, data);
  }

  async put<T = unknown>(path: string, data?) {
    return await this.request<T>('put', path, data);
  }

  async delete(path: string) {
    return await this.request('delete', path);
  }

  private async request<T>(
    method: 'get' | 'post' | 'put' | 'delete',
    path: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?: any
  ) {
    await this.oauth.checkAccess();

    return await this.http.request<T>({
      method,
      url: path,
      data: querystring.stringify(data),
      headers: {
        Authorization: `Bearer ${this.config.accessToken}`,
        Accept: 'application/json',
      },
    });
  }
}
