import { EventEmitter2 } from 'eventemitter2';
import { Client } from './client';

enum TimeSaleFields {
  Symbol = 0,
  TradeTime = 1,
  LastPrice = 2,
  LastSize = 3,
  LastSequence = 4,
}

export enum TimeSalesEvent {
  EquityTimeSales = 'equity-time-sales',
  OptionTimeSales = 'option-time-sales',
}

interface TimeSaleResponse {
  key: string;
  seq: number;
  [TimeSaleFields.TradeTime]: number;
  [TimeSaleFields.LastPrice]: number;
  [TimeSaleFields.LastSize]: number;
  [TimeSaleFields.LastSequence]: number;
}

interface TimeSaleOptions {
  symbols: string[];
}

export class TimeSales {
  private emitter = new EventEmitter2();

  constructor(private client: Client) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  on(event: TimeSalesEvent, fn: (...args: any[]) => void | Promise<void>) {
    this.emitter.on(event, fn);
  }

  subscribeToEquityTimeSales(options: TimeSaleOptions) {
    const fields = Object.values(TimeSaleFields).filter(
      (value) => typeof value === 'number'
    );

    this.client.send(
      {
        service: 'TIMESALE_EQUITY',
        command: 'SUBS',
        parameters: {
          keys: options.symbols.map((symbol) => symbol.toUpperCase()).join(','),
          fields: fields.join(','),
        },
      },
      async (response: TimeSaleResponse) => {
        const result = await this.adaptTimeSale(response);
        await this.emitter.emitAsync(TimeSalesEvent.EquityTimeSales, result);
      }
    );
  }

  subscribeToOptionTimeSales(options: TimeSaleOptions) {
    const fields = Object.values(TimeSaleFields).filter(
      (value) => typeof value === 'number'
    );

    this.client.send(
      {
        service: 'TIMESALE_OPTIONS',
        command: 'SUBS',
        parameters: {
          keys: options.symbols.map((symbol) => symbol.toUpperCase()).join(','),
          fields: fields.join(','),
        },
      },
      async (response: TimeSaleResponse) => {
        const result = await this.adaptTimeSale(response);
        await this.emitter.emitAsync(TimeSalesEvent.OptionTimeSales, result);
      }
    );
  }

  private async adaptTimeSale(content: TimeSaleResponse) {
    return content;
  }
}
