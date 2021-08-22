import { EventEmitter2 } from 'eventemitter2';
import { v4 as uuidv4 } from 'uuid';
import * as WebSocket from 'ws';

enum ClientEvent {
  Open = 'open',
  Close = 'close',
  Error = 'error',
}

export interface StreamRequest {
  service: string;
  command: string;
  requestid: string;
  account: string;
  source: string;
  parameters?: unknown;
}

interface HeartbeatResponse {
  heartbeat: string;
}

interface Response {
  notify?: HeartbeatResponse[];
  data?: (DataResponse | CodeResponse)[];
  response?: (DataResponse | CodeResponse)[];
}

interface DataResponse {
  service: string;
  command: string;
  requestid: string;
  timestamp: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: any;
}

interface CodeResponse {
  service: string;
  command: string;
  requestid: string;
  timestamp: number;
  content: {
    code: number;
    msg: string;
  };
}

interface RequestContext {
  onSuccess?: (message: string) => void | Promise<void>;
  onError?: (message: string) => void | Promise<void>;
  onData?: (result: unknown) => void | Promise<void>;
}

interface SendOptions {
  service: string;
  command: string;
  parameters?: unknown;
}

export class Client {
  private socket: WebSocket;
  private appId: string;
  private accountId: string;

  private emitter = new EventEmitter2();

  // Map holding all request ids -> request contexts
  private requests = new Map<string, RequestContext>();

  constructor() {}

  onOpen(fn: () => void | Promise<void>) {
    this.emitter.on(ClientEvent.Open, fn);
  }

  onClose(fn: () => void | Promise<void>) {
    this.emitter.on(ClientEvent.Open, fn);
  }

  onError(fn: (error: Error) => void | Promise<void>) {
    this.emitter.on(ClientEvent.Error, fn);
  }

  isOpen() {
    return this.socket.readyState === this.socket.OPEN;
  }

  async open(streamUrl: string, appId: string, accountId: string) {
    if (this.socket != null && this.isOpen()) {
      return;
    }

    this.appId = appId;
    this.accountId = accountId;
    this.socket = new WebSocket(`ws://${streamUrl}/ws`);

    this.socket.on('close', async () => {
      await this.emitter.emitAsync(ClientEvent.Close);
    });

    this.socket.on('error', async (error) => {
      await this.emitter.emitAsync(ClientEvent.Error, error);
    });

    this.socket.on('message', async (message: WebSocket.Data) => {
      await this.processMessage(message);
    });

    return new Promise<void>((resolve) => {
      this.socket!.on('open', async () => {
        await this.emitter.emitAsync(ClientEvent.Open);
        resolve();
      });
    });
  }

  close() {
    if (this.isOpen()) {
      this.socket.close();
    }
  }

  send(
    options: SendOptions,
    onData?: (result: unknown) => void | Promise<void>
  ): void | Promise<void> {
    const requestId = this.generateRequestId();
    const request: StreamRequest = {
      service: options.service,
      command: options.command,
      parameters: options.parameters ?? {},
      requestid: requestId,
      account: this.accountId,
      source: this.appId,
    };

    return new Promise<void>((resolve, reject) => {
      this.requests.set(requestId, {
        onSuccess: () => this.handleSuccess(requestId, resolve),
        onError: () => this.handleError(requestId, reject),
        onData,
      });
    }).then(() => {
      this.socket.send(JSON.stringify({ requests: [request] }));
    });
  }

  private generateRequestId() {
    return uuidv4();
  }

  private async handleSuccess(requestId: string, resolve: () => void) {
    this.requests.delete(requestId);
    resolve();
  }

  private async handleError(requestId: string, reject: () => void) {
    this.requests.delete(requestId);
    reject();
  }

  private async processMessage(message: WebSocket.Data) {
    const data: Response = JSON.parse(message.toString());

    if ('notify' in data) {
      // Just a heartbeat, return
      return;
    }

    console.log('data');
    console.log(data);
    console.log('data.data.content');
    console.log(data.data?.[0]?.content);
    console.log('data.response.content');
    console.log(data.response?.[0]?.content);

    const responses = data.response || data.data;
    for (const response of responses!) {
      if ('code' in response.content) {
        await this.processCodeResponse(response);
      } else {
        await this.processDataResponse(response);
      }
    }
  }

  private async processCodeResponse(response: CodeResponse) {
    const context = this.requests.get(response.requestid);
    if (context == null) {
      return;
    }

    if (response.content.code === 0) {
      await context.onSuccess?.(response.content.msg);
    } else {
      await context.onError?.(response.content.msg);
    }
  }

  private async processDataResponse(response: DataResponse) {
    const context = this.requests.get(response.requestid);
    if (context == null) {
      return;
    }

    await context.onData?.(response.content);
  }
}
