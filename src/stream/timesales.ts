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
  EquityTimeSale = 'equity-time-sale',
  OptionTimeSale = 'option-time-sale',
}

interface TimeSaleData {
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

  constructor(private client: Client) {
    this.setupEmitter();
  }

  // Events

  onEquityTimeSale(fn: (timesale: TimeSale) => void | Promise<void>) {
    this.emitter.on(TimeSaleEvent.EquityTimeSale, fn);
  }

  onOptionTimeSale(fn: (timesale: TimeSale) => void | Promise<void>) {
    this.emitter.on(TimeSaleEvent.OptionTimeSale, fn);
  }

  // Stream Operations

  subscribeToEquityTimeSales(options: TimeSaleOptions) {
    const fields = Object.values(TimeSaleFields).filter(
      (value) => typeof value === 'number'
    );

    this.client.send({
      service: 'TIMESALE_EQUITY',
      command: 'SUBS',
      parameters: {
        keys: options.symbols.map((symbol) => symbol.toUpperCase()).join(','),
        fields: fields.join(','),
      },
    });
  }

  subscribeToOptionTimeSales(options: TimeSaleOptions) {
    const fields = Object.values(TimeSaleFields).filter(
      (value) => typeof value === 'number'
    );

    this.client.send({
      service: 'TIMESALE_OPTIONS',
      command: 'SUBS',
      parameters: {
        keys: options.symbols.map((symbol) => symbol.toUpperCase()).join(','),
        fields: fields.join(','),
      },
    });
  }

  // Adapters

  private adaptTimeSale(content: TimeSaleData): TimeSale {
    return {
      symbol: content.key,
      tradeTime: content[TimeSaleFields.TradeTime],
      lastPrice: content[TimeSaleFields.LastPrice],
      lastSize: content[TimeSaleFields.LastSize],
      lastSequence: content[TimeSaleFields.LastSequence],
    };
  }

  // Utilities

  private setupEmitter() {
    this.client.onData(
      'TIMESALE_EQUITY',
      'SUBS',
      async (data: TimeSaleData[]) => {
        data.forEach(async (raw) => {
          const result = this.adaptTimeSale(raw);
          await this.emitter.emitAsync(TimeSaleEvent.EquityTimeSale, result);
        });
      }
    );

    this.client.onData(
      'TIMESALE_OPTIONS',
      'SUBS',
      async (data: TimeSaleData[]) => {
        data.forEach(async (raw) => {
          const result = this.adaptTimeSale(raw);
          await this.emitter.emitAsync(TimeSaleEvent.OptionTimeSale, result);
        });
      }
    );
  }
}
