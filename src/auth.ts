import * as fs from 'fs';
import * as https from 'https';
import * as querystring from 'querystring';
import { TDAmeritrade } from './tdameritrade';

export async function checkAccess(td: TDAmeritrade) {
  if (td.accessToken == null || td.refreshToken == null) {
    await authenticate(td);
  } else if (hasRefreshTokenExpired(td)) {
    await refreshRefreshToken(td);
  } else if (hasAccessTokenExpired(td)) {
    await refreshAccessToken(td);
  }
}

function hasAccessTokenExpired(td: TDAmeritrade) {
  return (
    td.accessToken == null ||
    td.accessTokenExpires == null ||
    td.accessTokenExpires.getTime() < new Date().getTime()
  );
}

function hasRefreshTokenExpired(td: TDAmeritrade) {
  return (
    td.refreshToken == null ||
    td.refreshTokenExpires == null ||
    td.refreshTokenExpires.getTime() < new Date().getTime()
  );
}

async function authenticate(td: TDAmeritrade) {
  return new Promise<void>((resolve, reject) => {
    const serverOptions = {
      key: fs.readFileSync(td.sslKey),
      cert: fs.readFileSync(td.sslCert),
    };

    const server = https.createServer(serverOptions, async (req, res) => {
      const requestUrl = new URL(req.url, 'http://127.0.0.1:8443');

      if (!requestUrl.searchParams.has('code')) {
        res.writeHead(422);
        res.write('Authorization code is required');
        return res.end();
      }

      try {
        await createAccessToken(requestUrl.searchParams.get('code'), td);

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

    const { port, hostname } = new URL(td.redirectUri);
    server.listen(Number(port), hostname, () => {
      const query = querystring.stringify({
        response_type: 'code',
        redirect_uri: td.redirectUri,
        client_id: `${td.apiKey}@AMER.OAUTHAP`,
      });

      td.onAuth(`https://auth.tdameritrade.com/auth?${query}`);
    });
  });
}

async function createAccessToken(code: string, td: TDAmeritrade) {
  const response = await td.axios.post<{
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
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

  const today = new Date();
  td.accessToken = response.data.access_token;
  td.accessTokenExpires = new Date(today.getTime() + 25 * 60 * 1000);
  td.refreshToken = response.data.refresh_token;
  td.refreshTokenExpires = new Date(today.getTime() + 85 * 24 * 60 * 60 * 1000);
}

async function refreshAccessToken(td: TDAmeritrade) {
  const response = await td.axios.post<{ access_token: string }>(
    '/oauth2/token',
    querystring.stringify({
      grant_type: 'refresh_token',
      refresh_token: td.refreshToken,
      client_id: td.apiKey,
    }),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

  const today = new Date();
  td.accessToken = response.data.access_token;
  td.accessTokenExpires = new Date(today.getTime() + 25 * 60 * 1000);
}

async function refreshRefreshToken(td: TDAmeritrade) {
  const response = await td.axios.post<{
    access_token: string;
    refresh_token: string;
  }>(
    '/oauth2/token',
    querystring.stringify({
      grant_type: 'refresh_token',
      access_type: 'offline',
      refresh_token: td.refreshToken,
      client_id: td.apiKey,
    }),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

  const today = new Date();
  td.accessToken = response.data.access_token;
  td.accessTokenExpires = new Date(today.getTime() + 25 * 60 * 1000);
  td.refreshToken = response.data.refresh_token;
  td.refreshTokenExpires = new Date(today.getTime() + 85 * 24 * 60 * 60 * 1000);
}
