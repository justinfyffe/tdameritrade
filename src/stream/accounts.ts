import * as xml2js from 'xml2js';
import { Client } from './client';

interface AccountActivity {
  accountId: string;
  type: MessageType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}

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

export class Accounts {
  private subscriptionKey: string;

  constructor(private client: Client) {}

  setSubscriptionKey(subscriptionKey: string) {
    this.subscriptionKey = subscriptionKey;
  }

  subscribeToAccountActivity(
    onData: (activity: AccountActivity) => void | Promise<void>
  ) {
    const fields = Object.values(AccountActivityField).filter(
      (value) => typeof value === 'number'
    );

    this.client.send(
      {
        service: 'ACCT_ACTIVITY',
        command: 'SUBS',
        parameters: {
          keys: this.subscriptionKey,
          fields: fields.join(','),
        },
      },
      async (response: AccountActivityResponse) => {
        const result = await this.adaptAccountActivity(response);
        onData(result);
      }
    );
  }

  async adaptAccountActivity(
    content: AccountActivityResponse
  ): Promise<AccountActivity> {
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
}
