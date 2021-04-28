import { AxiosInstance } from 'axios';

export interface TDAmeritradeConfig {
  apiKey: string;
  apiUrl?: string;

  redirectUri?: string;
  sslKey?: string;
  sslCert?: string;

  accessToken?: string;
  accessTokenExpires?: Date;
  refreshToken?: string;
  refreshTokenExpires?: Date;

  axios?: AxiosInstance;
}

export interface TDAmeritradeInstance {
  apiKey: string;

  accessToken: string;
  accessTokenExpires: Date;
  refreshToken: string;
  refreshTokenExpires: Date;

  axios: AxiosInstance;
}
