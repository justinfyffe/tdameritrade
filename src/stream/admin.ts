import { TDAmeritrade, TDAmeritradeError } from '../tdameritrade';
import { jsonToQueryString } from '../utils';
import { createStreamRequest, StreamCommand, StreamService } from './client';

export enum QualityOfService {
  Express = 0, // 500ms
  RealTime = 1, // 750ms
  Fast = 2, // 1000ms (default)
  Moderate = 3, // 1500ms,
  Slow = 4, // 3000ms
  Delayed = 5, // 5000ms
}

interface StreamCredentials {
  userid: string;
  token: string;
  company: string;
  segment: string;
  cddomain: string;
  usergroup: string;
  accesslevel: string;
  authorized: 'Y';
  timestamp: number;
  appid: string;
  acl: string;
}

interface LoginOptions {
  onSuccess?: (message: string) => void | Promise<void>;
  onError?: (message: string) => void | Promise<void>;
}

interface LogoutOptions {
  onSuccess?: (message: string) => void | Promise<void>;
  onError?: (message: string) => void | Promise<void>;
}

interface ChangeQualityOfLifeOptions {
  qos: QualityOfService;
  onSuccess?: (message: string) => void | Promise<void>;
  onError?: (message: string) => void | Promise<void>;
}

export function login(td: TDAmeritrade, options?: LoginOptions) {
  if (td.stream == null) {
    throw new TDAmeritradeError();
  }

  const { account, userPrincipals } = td.stream;

  const credentials: StreamCredentials = {
    userid: account.accountId,
    token: userPrincipals.streamerInfo.token,
    company: account.company,
    segment: account.segment,
    cddomain: account.accountCdDomainId,
    usergroup: userPrincipals.streamerInfo.userGroup,
    accesslevel: userPrincipals.streamerInfo.accessLevel,
    authorized: 'Y',
    timestamp: new Date(userPrincipals.streamerInfo.tokenTimestamp).getTime(),
    appid: userPrincipals.streamerInfo.appId,
    acl: userPrincipals.streamerInfo.acl,
  };

  return createStreamRequest(td, {
    service: StreamService.Admin,
    command: StreamCommand.Login,
    parameters: {
      credential: jsonToQueryString(credentials),
      token: userPrincipals.streamerInfo.token,
      version: '1.0',
    },
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
}

export function logout(td: TDAmeritrade, options?: LogoutOptions) {
  return createStreamRequest(td, {
    service: StreamService.Admin,
    command: StreamCommand.Logout,
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
}

export function changeQualityOfService(
  td: TDAmeritrade,
  options: ChangeQualityOfLifeOptions
) {
  return createStreamRequest(td, {
    service: StreamService.Admin,
    command: StreamCommand.QualityOfService,
    parameters: { qoslevel: options.qos },
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
}
