import { AxiosInstance } from 'axios';
import * as fs from 'fs';
import * as https from 'https';
import * as querystring from 'querystring';
import { Config } from './config';
import {
  EventEmitter,
  OAuthEventPayload,
  TDAmeritradeEvent,
  TokenEventPayload,
} from './events';

export class OAuth {
  constructor(
    private httpClient: AxiosInstance,
    private emitter: EventEmitter,
    private config: Config
  ) {}

  authenticate() {
    return new Promise<void>((resolve, reject) => {
      if (!this.config.sslKey) {
        reject(new Error('Missing `sslKey` config property'));
      } else if (fs.existsSync(this.config.sslKey)) {
        reject(new Error(`Cannot read SSL key path: ${this.config.sslKey}`));
      }

      if (!this.config.sslCert) {
        reject(new Error('Missing `sslCert` config property'));
      } else if (fs.existsSync(this.config.sslCert)) {
        reject(new Error(`Cannot read SSL cert path: ${this.config.sslKey}`));
      }

      if (!this.config.redirectUri) {
        reject(new Error('Missing `redirectUri` config property'));
      }

      const serverOptions = {
        key: fs.readFileSync(this.config.sslKey),
        cert: fs.readFileSync(this.config.sslCert),
      };

      const server = https.createServer(serverOptions, async (req, res) => {
        const requestUrl = new URL(req.url);

        if (!requestUrl.searchParams.has('code')) {
          res.writeHead(422);
          res.write('Authorization code is required');
          return res.end();
        }

        try {
          await this.createAccessToken(requestUrl.searchParams.get('code'));
          res.writeHead(204);
          res.end();
          resolve();
        } catch (error) {
          res.writeHead(500);
          res.end();
          reject(error);
        } finally {
          server.close();
        }
      });

      const { port, hostname } = new URL(this.config.redirectUri);
      server.listen(Number(port) || 8443, hostname, () => {
        this.emitOAuthEvent();
      });
    });
  }

  async checkAccess() {
    if (this.config.accessToken == null || this.config.refreshToken == null) {
      await this.authenticate();
    } else if (this.config.hasRefreshTokenExpired()) {
      await this.refreshRefreshToken();
    } else if (this.config.hasAccessTokenExpired()) {
      await this.refreshAccessToken();
    }
  }

  async createAccessToken(code: string) {
    const response = await this.httpClient.post<{
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
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const today = new Date();
    this.config.accessToken = response.data.access_token;
    this.config.accessTokenExpires = new Date(today.getTime() + 25 * 60 * 1000);
    this.config.refreshToken = response.data.refresh_token;
    this.config.refreshTokenExpires = new Date(
      today.getTime() + 75 * 24 * 60 * 60 * 1000
    );

    this.emitTokenEvent();
  }

  async refreshAccessToken() {
    const response = await this.httpClient.post<{ access_token: string }>(
      '/oauth2/token',
      querystring.stringify({
        grant_type: 'refresh_token',
        refresh_token: this.config.refreshToken,
        client_id: this.config.apiKey,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const today = new Date();
    this.config.accessToken = response.data.access_token;
    this.config.accessTokenExpires = new Date(today.getTime() + 25 * 60 * 1000);

    this.emitTokenEvent();
  }

  async refreshRefreshToken() {
    const response = await this.httpClient.post<{
      access_token: string;
      refresh_token: string;
    }>(
      '/oauth2/token',
      querystring.stringify({
        grant_type: 'refresh_token',
        access_type: 'offline',
        refresh_token: this.config.refreshToken,
        client_id: this.config.apiKey,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const today = new Date();
    this.config.accessToken = response.data.access_token;
    this.config.accessTokenExpires = new Date(today.getTime() + 25 * 60 * 1000);
    this.config.refreshToken = response.data.refresh_token;
    this.config.refreshTokenExpires = new Date(
      today.getTime() + 75 * 24 * 60 * 60 * 1000
    );

    this.emitTokenEvent();
  }

  private emitOAuthEvent() {
    const query = querystring.stringify({
      response_type: 'code',
      redirect_uri: `https://localhost:${process.env.API_CALLBACK_PORT}/auth/callback`,
      client_id: `${process.env.API_KEY}@AMER.OAUTHAP`,
    });

    this.emitter.emit(TDAmeritradeEvent.OAuth, {
      url: `https://auth.tdameritrade.com/auth?${query}`,
    } as OAuthEventPayload);
  }

  private emitTokenEvent() {
    this.emitter.emit(TDAmeritradeEvent.Token, {
      accessToken: this.config.accessToken,
      accessTokenExpires: this.config.accessTokenExpires,
      refreshToken: this.config.refreshToken,
      refreshTokenExpires: this.config.refreshTokenExpires,
    } as TokenEventPayload);
  }
}
