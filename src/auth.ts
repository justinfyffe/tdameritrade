import axios from 'axios';
import { EventEmitter2 } from 'eventemitter2';
import * as fs from 'fs';
import * as https from 'https';
import * as querystring from 'querystring';

const ACCESS_TOKEN_EXPIRES = 25 * 60 * 1000; // 25 minutes
const REFRESH_TOKEN_EXPIRES = 75 * 24 * 60 * 60 * 1000; // 75 days

export enum AuthEvent {
  Auth = 'auth',
  Tokens = 'tokens',
}

export interface AuthTokens {
  accessToken?: string;
  accessTokenExpires?: number;
  refreshToken?: string;
  refreshTokenExpires?: number;
}

interface AuthConfig {
  apiKey: string;
  baseUrl: string;
  redirectUri: string;
  sslKey: string;
  sslCert: string;
  autoRefreshTokens: boolean;
  tokens?: AuthTokens;
}

export class AuthService {
  private emitter = new EventEmitter2();

  constructor(private config: AuthConfig, private tokens: AuthTokens) {}

  onAuth(fn: (url: string) => void | Promise<void>) {
    this.emitter.on(AuthEvent.Auth, fn);
  }

  onTokens(fn: (tokens: AuthTokens) => void | Promise<void>) {
    this.emitter.on(AuthEvent.Tokens, fn);
  }

  isAuthenticated() {
    return this.isAccessTokenValid();
  }

  getTokens() {
    return this.tokens;
  }

  setTokens(tokens: AuthTokens) {
    this.tokens = tokens;
  }

  async getAccessToken() {
    if (this.config.autoRefreshTokens) {
      if (!this.isRefreshTokenValid()) {
        await this.refreshRefreshToken();
      } else if (!this.isAccessTokenValid()) {
        await this.refreshAccessToken();
      }
    }

    return this.tokens.accessToken;
  }

  async authenticate() {
    if (this.isAccessTokenValid() || this.isRefreshTokenValid()) {
      await this.refreshTokens();
      return;
    }

    if (!fs.existsSync(this.config.sslKey)) {
      throw new Error(`Cannot read SSL key path: ${this.config.sslKey}`);
    }

    if (!fs.existsSync(this.config.sslCert)) {
      throw new Error(`Cannot read SSL cert path: ${this.config.sslCert}`);
    }

    return new Promise<AuthTokens>((resolve, reject) => {
      const serverOptions = {
        key: fs.readFileSync(this.config.sslKey!),
        cert: fs.readFileSync(this.config.sslCert!),
      };

      const server = https.createServer(serverOptions, async (req, res) => {
        if (req.url == null) {
          res.writeHead(422);
          res.write('Missing path');
          return res.end();
        }

        const requestUrl = new URL(req.url, 'http://127.0.0.1:8443');
        if (!requestUrl.searchParams.has('code')) {
          res.writeHead(422);
          res.write('Authorization code is required');
          return res.end();
        }

        try {
          await this.createAccessToken(requestUrl.searchParams.get('code')!);

          res.writeHead(204);
          res.end();
          resolve(this.tokens);
        } catch (error) {
          res.writeHead(500);
          res.end();
          reject(error);
        } finally {
          server.close();
        }
      });

      const { port, hostname } = new URL(this.config.redirectUri!);
      server.listen(Number(port), hostname, async () => {
        const query = querystring.stringify({
          response_type: 'code',
          redirect_uri: this.config.redirectUri,
          client_id: `${this.config.apiKey}@AMER.OAUTHAP`,
        });

        await this.emitter.emitAsync(
          AuthEvent.Auth,
          `https://auth.tdameritrade.com/auth?${query}`
        );
      });
    });
  }

  private async refreshTokens() {
    if (!this.isRefreshTokenValid()) {
      await this.refreshRefreshToken();
    } else if (!this.isAccessTokenValid()) {
      await this.refreshAccessToken();
    }

    return this.tokens;
  }

  private async createAccessToken(code: string) {
    const response = await axios.post<{
      access_token: string;
      refresh_token: string;
    }>(
      '/oauth2/token',
      querystring.stringify({
        grant_type: 'authorization_code',
        access_type: 'offline',
        code,
        client_id: this.config.apiKey,
        redirect_uri: this.config.redirectUri,
      }),
      {
        baseURL: this.config.baseUrl,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const today = new Date();
    this.tokens.accessToken = response.data.access_token;
    this.tokens.accessTokenExpires = today.getTime() + ACCESS_TOKEN_EXPIRES;
    this.tokens.refreshToken = response.data.refresh_token;
    this.tokens.refreshTokenExpires = today.getTime() + REFRESH_TOKEN_EXPIRES;
    await this.emitter.emitAsync(AuthEvent.Tokens, { ...this.tokens });
  }

  private async refreshAccessToken() {
    const response = await axios.post<{ access_token: string }>(
      '/oauth2/token',
      querystring.stringify({
        grant_type: 'refresh_token',
        refresh_token: this.tokens.refreshToken,
        client_id: this.config.apiKey,
      }),
      {
        baseURL: this.config.baseUrl,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const today = new Date();
    this.tokens.accessToken = response.data.access_token;
    this.tokens.accessTokenExpires = today.getTime() + ACCESS_TOKEN_EXPIRES;
    await this.emitter.emitAsync(AuthEvent.Tokens, { ...this.tokens });
  }

  private async refreshRefreshToken() {
    const response = await axios.post<{
      access_token: string;
      refresh_token: string;
    }>(
      '/oauth2/token',
      querystring.stringify({
        grant_type: 'refresh_token',
        access_type: 'offline',
        refresh_token: this.tokens.refreshToken,
        client_id: this.config.apiKey,
      }),
      {
        baseURL: this.config.baseUrl,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const today = new Date();
    this.tokens.accessToken = response.data.access_token;
    this.tokens.accessTokenExpires = today.getTime() + ACCESS_TOKEN_EXPIRES;
    this.tokens.refreshToken = response.data.refresh_token;
    this.tokens.refreshTokenExpires = today.getTime() + REFRESH_TOKEN_EXPIRES;
    await this.emitter.emitAsync(AuthEvent.Tokens, { ...this.tokens });
  }

  private isAccessTokenValid() {
    return (
      this.tokens.accessToken != null &&
      this.tokens.accessTokenExpires != null &&
      this.tokens.accessTokenExpires > new Date().getTime()
    );
  }

  private isRefreshTokenValid() {
    return (
      this.tokens.refreshToken != null &&
      this.tokens.refreshTokenExpires != null &&
      this.tokens.refreshTokenExpires > new Date().getTime()
    );
  }
}
