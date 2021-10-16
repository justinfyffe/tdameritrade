import { EventEmitter2 } from 'eventemitter2';
import { v4 as uuidv4 } from 'uuid';
import * as WebSocket from 'ws';

enum ClientEvent {
  Open = 'open',
  Close = 'close',
  Error = 'error',
  Data = 'data',
  Status = 'status',
}

export interface StreamRequest {
  service: string;
  command: string;
  requestid: string;
  account: string;
  source: string;
  parameters?: unknown;
}

interface StreamResponse {
  notify?: HeartbeatResponse[];
  data?: ContentResponse[];
  response?: ContentResponse[];
}

interface HeartbeatResponse {
  heartbeat: string;
}

interface ContentResponse {
  service: string;
  command: string;
  requestid?: string;
  timestamp: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: any;
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

  constructor() {}

  public get isOpen() {
    return this.socket != null && this.socket.readyState === this.socket.OPEN;
  }

  // Events

  onOpen(fn: () => void | Promise<void>) {
    this.emitter.on(ClientEvent.Open, fn);
  }

  onClose(fn: () => void | Promise<void>) {
    this.emitter.on(ClientEvent.Open, fn);
  }

  onError(fn: (error: Error) => void | Promise<void>) {
    this.emitter.on(ClientEvent.Error, fn);
  }

  onData(
    service: string,
    command: string,
    fn: (data: unknown) => void | Promise<void>
  ) {
    const event = this.getServiceEvent(service, command);
    this.emitter.on(event, fn);
  }

  // Stream Operations

  async open(streamUrl: string, appId: string, accountId: string) {
    if (this.socket != null && this.isOpen) {
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
    if (this.isOpen) {
      this.socket.close();
    }
  }

  send(options: SendOptions) {
    const requestId = this.generateRequestId();
    const request: StreamRequest = {
      service: options.service,
      command: options.command,
      parameters: options.parameters ?? {},
      requestid: requestId,
      account: this.accountId,
      source: this.appId,
    };

    return new Promise((resolve, reject) => {
      const event = this.getStatusEvent(options.service, options.command);
      this.emitter.once(event, (response: { code: number; msg: string }) => {
        if (response.code === 0) {
          resolve(response.msg);
        } else {
          reject(response.msg);
        }
      });

      this.socket.send(JSON.stringify({ requests: [request] }));
    });
  }

  // Utilities

  private generateRequestId() {
    return uuidv4();
  }

  private async processMessage(message: WebSocket.Data) {
    const data: StreamResponse = JSON.parse(message.toString());

    if ('notify' in data) {
      // Just a heartbeat, return
      return;
    }

    const responses = data.response || data.data;
    for (const response of responses!) {
      await this.processResponse(response);
    }
  }

  private async processResponse(response: ContentResponse) {
    let event: string;
    if ('code' in response.content && 'msg' in response.content) {
      event = this.getStatusEvent(response.service, response.command);
    } else {
      event = this.getServiceEvent(response.service, response.command);
    }

    await this.emitter.emitAsync(event, response.content);
  }

  private getServiceEvent(service: string, command: string) {
    return `${
      ClientEvent.Data
    }-${service.toLowerCase()}-${command.toLowerCase()}`;
  }

  private getStatusEvent(service: string, command: string) {
    return `${
      ClientEvent.Status
    }-${service.toLowerCase()}-${command.toLowerCase()}`;
  }
}
