import axios, { AxiosInstance } from 'axios';
import * as fs from 'fs';
import { checkAccess } from './auth';

export interface TDAmeritradeConfig {
  apiKey: string;
  apiUrl?: string;

  sslKey: string;
  sslCert: string;
  redirectUri?: string;

  accessToken?: string;
  accessTokenExpires?: Date;
  refreshToken?: string;
  refreshTokenExpires?: Date;
}

export interface TDAmeritrade {
  apiKey: string;

  redirectUri: string;
  sslKey: string;
  sslCert: string;

  accessToken: string;
  accessTokenExpires: Date;
  refreshToken: string;
  refreshTokenExpires: Date;

  axios: AxiosInstance;
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

  const baseURL = config.apiUrl ?? 'https://api.tdameritrade.com/v1';

  const td: TDAmeritrade = {
    apiKey: config.apiKey,

    redirectUri: config.redirectUri ?? 'https://localhost:8443',
    sslKey: config.sslKey,
    sslCert: config.sslCert,

    accessToken: config.accessToken,
    accessTokenExpires: config.accessTokenExpires,
    refreshToken: config.refreshToken,
    refreshTokenExpires: config.refreshTokenExpires,

    axios: axios.create({ baseURL }),
  };

  await checkAccess(td);

  return td;
}
