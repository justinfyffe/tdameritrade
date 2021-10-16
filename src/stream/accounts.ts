import { EventEmitter2 } from 'eventemitter2';
import * as xml2js from 'xml2js';
import { Client } from './client';

export interface AccountActivity {
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

enum AccountEvent {
  AccountActivity = 'account-activity',
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

interface AccountActivityData {
  key: string;
  [AccountActivityField.AccountId]: string;
  [AccountActivityField.MessageType]: MessageType;
  [AccountActivityField.MessageData]: string | MessageError | null;
}

export class AccountService {
  subscriptionKey: string;

  private emitter = new EventEmitter2();

  constructor(private client: Client) {
    this.setupEmitter();
  }

  // Events

  onAccountActivity(fn: (activity: AccountActivity) => void | Promise<void>) {
    this.emitter.on(AccountEvent.AccountActivity, fn);
  }

  // Stream Operations

  subscribeToAccountActivity() {
    const fields = Object.values(AccountActivityField).filter(
      (value) => typeof value === 'number'
    );

    this.client.send({
      service: 'ACCT_ACTIVITY',
      command: 'SUBS',
      parameters: {
        keys: this.subscriptionKey,
        fields: fields.join(','),
      },
    });
  }

  // Adapters

  private async adaptAccountActivity(
    data: AccountActivityData
  ): Promise<AccountActivity> {
    const accountId = data[AccountActivityField.AccountId];
    const messageType = data[AccountActivityField.MessageType];
    const messageData = data[AccountActivityField.MessageData];

    let message;
    if (messageData != null) {
      message =
        messageType != MessageType.Error
          ? await xml2js.parseStringPromise(
              data[AccountActivityField.MessageData] as string
            )
          : (messageData as MessageError);
    }

    return {
      accountId,
      type: messageType,
      data: message,
    };
  }

  // Utilities

  private setupEmitter() {
    const service = 'ACCT_ACTIVITY';
    const command = 'SUBS';

    this.client.onData(
      service,
      command,
      async (data: AccountActivityData[]) => {
        data.forEach(async (raw) => {
          const result = await this.adaptAccountActivity(raw);
          await this.emitter.emitAsync(AccountEvent.AccountActivity, result);
        });
      }
    );
  }
}
