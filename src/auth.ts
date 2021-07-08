import axios from 'axios';
import * as fs from 'fs';
import * as https from 'https';
import * as querystring from 'querystring';
import { TDAmeritrade } from './tdameritrade';

const ACCESS_TOKEN_EXPIRES = 25 * 60 * 1000; // 25 minutes
const REFRESH_TOKEN_EXPIRES = 75 * 24 * 60 * 60 * 1000; // 75 days

export function hasAuthentication(td: TDAmeritrade) {
  return td.auth.accessToken != null && td.auth.refreshToken != null;
}

export function hasAccessTokenExpired(td: TDAmeritrade) {
  return (
    td.auth.accessToken == null ||
    td.auth.accessTokenExpires == null ||
    td.auth.accessTokenExpires < new Date().getTime()
  );
}

export function hasRefreshTokenExpired(td: TDAmeritrade) {
  return (
    td.auth.refreshToken == null ||
    td.auth.refreshTokenExpires == null ||
    td.auth.refreshTokenExpires < new Date().getTime()
  );
}

export async function refreshAccessToken(td: TDAmeritrade) {
  const response = await axios.post<{ access_token: string }>(
    '/oauth2/token',
    querystring.stringify({
      grant_type: 'refresh_token',
      refresh_token: td.auth.refreshToken,
      client_id: td.apiKey,
    }),
    {
      baseURL: td.baseURL,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

  const today = new Date();
  td.auth.accessToken = response.data.access_token;
  td.auth.accessTokenExpires = today.getTime() + ACCESS_TOKEN_EXPIRES;
  td.onTokens?.(td.auth);
}

export async function refreshRefreshToken(td: TDAmeritrade) {
  const response = await axios.post<{
    access_token: string;
    refresh_token: string;
  }>(
    '/oauth2/token',
    querystring.stringify({
      grant_type: 'refresh_token',
      access_type: 'offline',
      refresh_token: td.auth.refreshToken,
      client_id: td.apiKey,
    }),
    {
      baseURL: td.baseURL,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

  const today = new Date();
  td.auth.accessToken = response.data.access_token;
  td.auth.accessTokenExpires = today.getTime() + ACCESS_TOKEN_EXPIRES;
  td.auth.refreshToken = response.data.refresh_token;
  td.auth.refreshTokenExpires = today.getTime() + REFRESH_TOKEN_EXPIRES;
  td.onTokens?.(td.auth);
}

export async function authenticate(td: TDAmeritrade) {
  if (!td.sslKey) {
    throw new Error('Missing `sslKey` property');
  }

  if (!fs.existsSync(td.sslKey)) {
    throw new Error(`Cannot read SSL key path: ${td.sslKey}`);
  }

  if (!td.sslCert) {
    throw new Error('Missing `sslCert` config property');
  }

  if (!fs.existsSync(td.sslCert)) {
    throw new Error(`Cannot read SSL cert path: ${td.sslKey}`);
  }

  return new Promise<void>((resolve, reject) => {
    const serverOptions = {
      key: fs.readFileSync(td.sslKey!),
      cert: fs.readFileSync(td.sslCert!),
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
        await createAccessToken(requestUrl.searchParams.get('code')!, td);

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

    const { port, hostname } = new URL(td.redirectUri!);
    server.listen(Number(port), hostname, () => {
      const query = querystring.stringify({
        response_type: 'code',
        redirect_uri: td.redirectUri,
        client_id: `${td.apiKey}@AMER.OAUTHAP`,
      });

      td.onAuth?.(`https://auth.tdameritrade.com/auth?${query}`);
    });
  });
}

async function createAccessToken(code: string, td: TDAmeritrade) {
  const response = await axios.post<{
    access_token: string;
    refresh_token: string;
  }>(
    '/oauth2/token',
    querystring.stringify({
      grant_type: 'authorization_code',
      access_type: 'offline',
      code,
      client_id: td.apiKey,
      redirect_uri: td.redirectUri,
    }),
    {
      baseURL: td.baseURL,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

  const today = new Date();
  td.auth.accessToken = response.data.access_token;
  td.auth.accessTokenExpires = today.getTime() + ACCESS_TOKEN_EXPIRES;
  td.auth.refreshToken = response.data.refresh_token;
  td.auth.refreshTokenExpires = today.getTime() + REFRESH_TOKEN_EXPIRES;
  td.onTokens?.(td.auth);
}
