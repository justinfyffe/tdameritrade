export interface TDAmeritradeConfig {
  apiKey: string;
  apiUrl?: string;

  redirectUri: string;
  sslKey: string;
  sslCert: string;

  accessToken?: string;
  accessTokenExpires?: Date;
  refreshToken?: string;
  refreshTokenExpires?: Date;
}

export class Config {
  apiKey: string;
  apiUrl?: string;

  redirectUri: string;
  sslKey: string;
  sslCert: string;

  accessToken?: string;
  accessTokenExpires?: Date;
  refreshToken?: string;
  refreshTokenExpires?: Date;

  constructor(config: TDAmeritradeConfig) {
    this.apiKey = config.apiKey;
    this.apiUrl = config.apiUrl ?? 'https://api.tdameritrade.com/v1';

    this.redirectUri = config.redirectUri ?? 'https://localhost:8443';
    this.sslKey = config.sslKey;
    this.sslCert = config.sslCert;

    this.accessToken = config.accessToken;
    this.accessTokenExpires = config.accessTokenExpires;
    this.refreshToken = config.refreshToken;
    this.refreshTokenExpires = config.refreshTokenExpires;
  }

  hasAccessTokenExpired() {
    return (
      this.accessToken == null ||
      this.accessTokenExpires == null ||
      this.accessTokenExpires.getTime() < new Date().getTime()
    );
  }

  hasRefreshTokenExpired() {
    return (
      this.refreshToken == null ||
      this.refreshTokenExpires == null ||
      this.refreshTokenExpires.getTime() < new Date().getTime()
    );
  }
}
