import * as EventEmitter3 from 'eventemitter3';

export enum TDAmeritradeEvent {
  OAuth = 'oauth',
  Token = 'token',
}

export interface OAuthEventPayload {
  url: string;
}

export interface TokenEventPayload {
  accessToken: string;
  accessTokenExpires: Date;
  refreshToken: string;
  refreshTokenExpires: Date;
}

export class EventEmitter {
  private emitter: EventEmitter3;

  constructor() {
    this.emitter = new EventEmitter3();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  emit(event: TDAmeritradeEvent, ...args: any[]) {
    this.emitter.emit(event, args);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  on(event: TDAmeritradeEvent, fn: (...args: any[]) => void, context?: any) {
    this.emitter.on(event, fn, context);
  }
}
