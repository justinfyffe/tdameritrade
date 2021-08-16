import { v4 as uuidv4 } from 'uuid';
import * as WebSocket from 'ws';
import { TDAmeritrade, TDAmeritradeError } from '../tdameritrade';
import {
  AccountSettings,
  getUserPrincipals,
  UserPrincipalField,
} from '../user-info';

export enum StreamService {
  AccountActivity = 'ACCT_ACTIVITY',
  ActivesNasdaq = 'ACTIVES_NASDAQ',
  ActivesNyse = 'ACTIVES_NYSE',
  ActivesOptions = 'ACTIVES_OPTIONS',
  ActivesOtcbb = 'ACTIVES_OTCBB',
  Admin = 'ADMIN',
  ChartEquity = 'CHART_EQUITY',
  ChartFutures = 'CHART_FUTURES',
  ChartHistoryFutures = 'CHART_HISTORY_FUTURES',
  ChartOptions = 'CHART_OPTIONS',
  LevelOneForex = 'LEVELONE_FOREX',
  LevelOneFutures = 'LEVELONE_FUTURES',
  LevelOneFuturesOptions = 'LEVELONE_FUTURES_OPTIONS',
  NewsHeadline = 'NEWS_HEADLINE',
  Option = 'OPTION',
  Quote = 'QUOTE',
  TimesaleEquity = 'TIMESALE_EQUITY',
  TimesaleForex = 'TIMESALE_FOREX',
  TimesaleFutures = 'TIMESALE_FUTURES',
  TimesaleOptions = 'TIMESALE_OPTIONS',
}

export enum StreamCommand {
  Add = 'ADD',
  Get = 'GET',
  Login = 'LOGIN',
  Logout = 'LOGOUT',
  QualityOfService = 'QOS',
  Stream = 'STREAM',
  Subscribe = 'SUBS',
  Unsubscribe = 'UNSUBS',
  View = 'VIEW',
}

export interface StreamRequest {
  service: StreamService;
  command: StreamCommand;
  requestid: string;
  account: string;
  source: string;
  parameters?: unknown;
}

interface StreamHeartbeatResponse {
  notify: {
    heartbeat: string;
  }[];
}

interface StreamResponse {
  data?: (StreamDataResponse | StreamCodeResponse)[];
  response?: (StreamDataResponse | StreamCodeResponse)[];
}

interface StreamDataResponse {
  service: StreamService;
  command: StreamCommand;
  requestid: string;
  timestamp: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: any;
}

interface StreamCodeResponse {
  service: StreamService;
  command: StreamCommand;
  requestid: string;
  timestamp: number;
  content: {
    code: number;
    msg: string;
  };
}

interface StreamOptions {
  accountId?: string;
  onOpen?: () => void;
  onClose?: () => void;
  onError?: (error: Error) => void;
}

interface StreamRequestOptions {
  service: StreamService;
  command: StreamCommand;
  parameters?: unknown;
  adapter?: (response: unknown) => unknown | Promise<unknown>;
  onSuccess?: (message: string) => void | Promise<void>;
  onError?: (message: string) => void | Promise<void>;
  onData?: (result: unknown) => void | Promise<void>;
}

interface StreamRequestContext {
  adapter?: (response: unknown) => unknown | Promise<unknown>;
  onSuccess?: (message: string) => void | Promise<void>;
  onError?: (message: string) => void | Promise<void>;
  onData?: (result: unknown) => void | Promise<void>;
}

// Map holding all request ids -> request contexts
const requests = new Map<string, StreamRequestContext>();

export async function createStream(td: TDAmeritrade, options?: StreamOptions) {
  const userPrincipals = await getUserPrincipals(td, [
    UserPrincipalField.StreamerConnectionInfo,
    UserPrincipalField.StreamerSubscriptionKeys,
  ]);

  const account = getAccount(
    userPrincipals.accounts,
    options?.accountId ?? userPrincipals.primaryAccountId
  );

  if (account == null) {
    throw new TDAmeritradeError();
  }

  td.stream = {
    socket: new WebSocket(
      `ws://${userPrincipals.streamerInfo.streamerSocketUrl}/ws`
    ),
    account,
    userPrincipals: userPrincipals,
  };

  td.stream.socket.on('open', () => {
    options?.onOpen?.();
  });
  td.stream.socket.on('close', () => {
    options?.onClose?.();
  });
  td.stream.socket.on('error', (error) => {
    options?.onError?.(error);
  });
  td.stream.socket.on('message', (data) => {
    onMessage(data);
  });
}

export function closeStream(td: TDAmeritrade) {
  td.stream?.socket?.close();
}

export function createStreamRequest(
  td: TDAmeritrade,
  options: StreamRequestOptions
): StreamRequest {
  if (td.stream == null) {
    throw new TDAmeritradeError();
  }

  const { account, userPrincipals } = td.stream;
  const { service, command, parameters, onSuccess, onError, onData } = options;

  const requestId = generateRequestId();

  requests.set(requestId, { onSuccess, onError, onData });

  return {
    service,
    command,
    requestid: requestId,
    account: account.accountId,
    source: userPrincipals.streamerInfo.appId,
    parameters: parameters ?? {},
  };
}

export function sendStreamRequests(
  td: TDAmeritrade,
  requests: StreamRequest[]
) {
  if (td.stream == null) {
    throw new TDAmeritradeError();
  }

  td.stream.socket.send(JSON.stringify({ requests }));
}

async function onMessage(message: WebSocket.Data) {
  const data: StreamHeartbeatResponse | StreamResponse = JSON.parse(
    message.toString()
  );

  if ('notify' in data) {
    onHeartbeat(data);
    return;
  }

  console.log('data');
  console.log(data);
  console.log('data.data.content');
  console.log(data.data?.[0]?.content);
  console.log('data.response.content');
  console.log(data.response?.[0]?.content);

  if (data.response) {
    for (const response of data.response!) {
      if ('code' in response.content) {
        onCode(response);
      } else {
        onData(response);
      }
    }
  }

  if (data.data) {
    for (const response of data.data!) {
      if ('code' in response.content) {
        onCode(response);
      } else {
        onData(response);
      }
    }
  }
}

function onHeartbeat(_response: StreamHeartbeatResponse) {
  return;
}

async function onCode(response: StreamCodeResponse) {
  const context = requests.get(response.requestid);
  if (context == null) {
    return;
  }

  if (response.content.code === 0) {
    await context.onSuccess?.(response.content.msg);
  } else {
    await context.onError?.(response.content.msg);
  }
}

async function onData(response: StreamDataResponse) {
  const context = requests.get(response.requestid);
  if (context == null) {
    return;
  }

  const content = response.content;
  const result = context.adapter ? await context.adapter(content) : content;
  await context.onData?.(result);
}

function getAccount(accounts: AccountSettings[], accountId: string) {
  for (const account of accounts) {
    if (account.accountId === accountId) {
      return account;
    }
  }

  return null;
}

function generateRequestId() {
  return uuidv4();
}
