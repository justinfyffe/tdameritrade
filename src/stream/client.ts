import { v4 as uuidv4 } from 'uuid';
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

interface StreamResponse<T = unknown> {
  service: StreamService;
  command: StreamCommand;
  requestid: string;
  timestamp: number;
  content: T;
}

interface StreamFullResponse {
  response: StreamResponse[];
}

interface StreamOptions {
  accountId?: string;
}

interface StreamRequestOptions {
  service: StreamService;
  command: StreamCommand;
  parameters?: unknown;
  adapter?: (response: unknown) => unknown | Promise<unknown>;
  callback?: (result: unknown) => void | Promise<void>;
}

interface StreamRequestContext {
  adapter?: (response: unknown) => unknown | Promise<unknown>;
  callback?: (result: unknown) => void | Promise<void>;
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
      `wss://${userPrincipals.streamerInfo.streamerSocketUrl}/ws`
    ),
    account,
    userPrincipals: userPrincipals,
  };
  td.stream.socket.onmessage = onMessage;
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
  const { service, command, parameters, callback } = options;

  const requestId = generateRequestId();

  requests.set(requestId, { callback });

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

async function onMessage(evt: MessageEvent<StreamFullResponse>) {
  for (const response of evt.data.response) {
    const context = requests.get(response.requestid);
    if (context == null) {
      continue;
    }

    const result = context.adapter
      ? await context.adapter(response.content)
      : response.content;
    context.callback?.(result);
  }
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
