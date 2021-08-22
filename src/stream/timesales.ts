import { EventEmitter2 } from 'eventemitter2';
import { Client } from './client';

export interface TimeSale {
  symbol: string;
  tradeTime: number;
  lastPrice: number;
  lastSize: number;
  lastSequence: number;
}

enum TimeSaleFields {
  Symbol = 0,
  TradeTime = 1,
  LastPrice = 2,
  LastSize = 3,
  LastSequence = 4,
}

enum TimeSaleEvent {
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

export class TimeSaleService {
  private emitter = new EventEmitter2();

  constructor(private client: Client) {}

  onEquityTimeSale(fn: (timesale: TimeSale) => void | Promise<void>) {
    this.emitter.on(TimeSaleEvent.EquityTimeSales, fn);
  }

  onOptionTimeSale(fn: (timesale: TimeSale) => void | Promise<void>) {
    this.emitter.on(TimeSaleEvent.OptionTimeSales, fn);
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
        const result = this.adaptTimeSale(response);
        await this.emitter.emitAsync(TimeSaleEvent.EquityTimeSales, result);
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
        const result = this.adaptTimeSale(response);
        await this.emitter.emitAsync(TimeSaleEvent.OptionTimeSales, result);
      }
    );
  }

  private adaptTimeSale(content: TimeSaleResponse): TimeSale {
    return {
      symbol: content.key,
      tradeTime: content[TimeSaleFields.TradeTime],
      lastPrice: content[TimeSaleFields.LastPrice],
      lastSize: content[TimeSaleFields.LastSize],
      lastSequence: content[TimeSaleFields.LastSequence],
    };
  }
}
