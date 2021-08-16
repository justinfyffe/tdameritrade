import * as xml2js from 'xml2js';
import { TDAmeritrade } from '../tdameritrade';
import { createStreamRequest, StreamCommand, StreamService } from './client';

enum AccountActivityField {
  Key = 0,
  AccountId = 1,
  MessageType = 2,
  MessageData = 3,
}

enum MessageType {
  Subscribed = 'SUBSCRIBED',
  Error = 'ERROR',
  BrokenTrade = 'BrokenTrade',
  ManualExecution = 'ManualExecution',
  OrderActivation = 'OrderActivation',
  OrderCancelReplaceRequest = 'OrderCancelReplaceRequest',
  OrderCancelRequest = 'OrderCancelRequest',
  OrderEntryRequest = 'OrderEntryRequest',
  OrderFill = 'OrderFill',
  OrderPartialFill = 'OrderPartialFill',
  OrderRejection = 'OrderRejection',
  TooLateToCancel = 'TooLateToCancel',
  OrderCanceled = 'UROUT',
}

enum MessageError {
  InvalidKey = 'INVALID_KEY',
  ExpiredKey = 'EXPIRED_KEY',
  SystemError = 'SYSTEM_ERROR',
}

interface AccountActivityResponse {
  key: string;
  [AccountActivityField.AccountId]: string;
  [AccountActivityField.MessageType]: MessageType;
  [AccountActivityField.MessageData]: string | MessageError | null;
}

interface ActivityOptions {
  onSuccess?: (message: string) => void | Promise<void>;
  onError?: (message: string) => void | Promise<void>;
  onData?: () => void | Promise<void>;
}

export function subscribeToAccountActivity(
  td: TDAmeritrade,
  options?: ActivityOptions
) {
  const key = td.stream?.userPrincipals.streamerSubscriptionKeys.keys[0].key;

  const fields = Object.values(AccountActivityField).filter(
    (value) => typeof value === 'number'
  );

  return createStreamRequest(td, {
    service: StreamService.AccountActivity,
    command: StreamCommand.Subscribe,
    parameters: {
      keys: key,
      fields: fields.join(','),
    },
    adapter: adaptAccountActivity,
    onSuccess: options?.onSuccess,
    onError: options?.onError,
    onData: options?.onData,
  });
}

async function adaptAccountActivity(content: AccountActivityResponse) {
  const accountId = content[AccountActivityField.AccountId];
  const messageType = content[AccountActivityField.MessageType];
  const messageData = content[AccountActivityField.MessageData];

  let data;
  if (messageData != null) {
    data =
      messageType != MessageType.Error
        ? await xml2js.parseStringPromise(
            content[AccountActivityField.MessageData] as string
          )
        : (messageData as MessageError);
  }

  return {
    accountId,
    type: messageType,
    data,
  };
}
