import { EventEmitter2 } from 'eventemitter2';
import { Client } from './client';

export interface ChartEquity {
  symbol: string;
  openPrice: number;
  highPrice: number;
  lowPrice: number;
  closePrice: number;
  volume: number;
  sequence: number;
  chartTime: number;
}

export interface ChartOption {
  symbol: string;
  chartTime: number;
  openPrice: number;
  highPrice: number;
  lowPrice: number;
  closePrice: number;
  volume: number;
}

enum ChartEquityFields {
  Key = 0,
  OpenPrice = 1,
  HighPrice = 2,
  LowPrice = 3,
  ClosePrice = 4,
  Volume = 5,
  Sequence = 6,
  ChartTime = 7,
}

enum ChartOptionFields {
  Key = 0,
  ChartTime = 1,
  OpenPrice = 2,
  HighPrice = 3,
  LowPrice = 4,
  ClosePrice = 5,
  Volume = 6,
}

enum ChartEvent {
  ChartEquity = 'chart-equity',
  ChartOption = 'chart-option',
}

interface ChartEquityData {
  key: string;
  seq: number;
  [ChartEquityFields.OpenPrice]: number;
  [ChartEquityFields.HighPrice]: number;
  [ChartEquityFields.LowPrice]: number;
  [ChartEquityFields.ClosePrice]: number;
  [ChartEquityFields.Volume]: number;
  [ChartEquityFields.Sequence]: number;
  [ChartEquityFields.ChartTime]: number;
}

interface ChartOptionData {
  key: string;
  seq: number;
  [ChartOptionFields.ChartTime]: number;
  [ChartOptionFields.OpenPrice]: number;
  [ChartOptionFields.HighPrice]: number;
  [ChartOptionFields.LowPrice]: number;
  [ChartOptionFields.ClosePrice]: number;
  [ChartOptionFields.Volume]: number;
}

interface ChartEquityOptions {
  symbols: string[];
}

interface ChartOptionOptions {
  symbols: string[];
}

export class ChartService {
  private emitter = new EventEmitter2();

  constructor(private client: Client) {
    this.setupEmitter();
  }

  // Events

  onChartEquity(fn: (chartEquity: ChartEquity) => void | Promise<void>) {
    this.emitter.on(ChartEvent.ChartEquity, fn);
  }

  onChartOption(fn: (chartOption: ChartOption) => void | Promise<void>) {
    this.emitter.on(ChartEvent.ChartOption, fn);
  }

  // Stream Operations

  subscribeToChartEquities(options: ChartEquityOptions) {
    const fields = Object.values(ChartEquityFields).filter(
      (value) => typeof value === 'number'
    );

    this.client.send({
      service: 'CHART_EQUITY',
      command: 'SUBS',
      parameters: {
        keys: options.symbols.map((symbol) => symbol.toUpperCase()).join(','),
        fields: fields.join(','),
      },
    });
  }

  subscribeToChartOptions(options: ChartOptionOptions) {
    const fields = Object.values(ChartOptionFields).filter(
      (value) => typeof value === 'number'
    );

    this.client.send({
      service: 'CHART_OPTIONS',
      command: 'SUBS',
      parameters: {
        keys: options.symbols.map((symbol) => symbol.toUpperCase()).join(','),
        fields: fields.join(','),
      },
    });
  }

  // Adapters

  private adaptChartEquity(data: ChartEquityData): ChartEquity {
    return {
      symbol: data.key,
      openPrice: data[ChartEquityFields.OpenPrice],
      highPrice: data[ChartEquityFields.HighPrice],
      lowPrice: data[ChartEquityFields.LowPrice],
      closePrice: data[ChartEquityFields.ClosePrice],
      volume: data[ChartEquityFields.Volume],
      sequence: data[ChartEquityFields.Sequence],
      chartTime: data[ChartEquityFields.ChartTime],
    };
  }

  private adaptChartOption(data: ChartOptionData): ChartOption {
    return {
      symbol: data.key,
      openPrice: data[ChartOptionFields.OpenPrice],
      highPrice: data[ChartOptionFields.HighPrice],
      lowPrice: data[ChartOptionFields.LowPrice],
      closePrice: data[ChartOptionFields.ClosePrice],
      volume: data[ChartOptionFields.Volume],
      chartTime: data[ChartOptionFields.ChartTime],
    };
  }

  // Utilities

  private setupEmitter() {
    this.client.onData(
      'CHART_EQUITY',
      'SUBS',
      async (data: ChartEquityData[]) => {
        console.log('data is', data);
        data.forEach(async (raw) => {
          const result = this.adaptChartEquity(raw);
          await this.emitter.emitAsync(ChartEvent.ChartEquity, result);
        });
      }
    );

    this.client.onData(
      'CHART_OPTIONS',
      'SUBS',
      async (data: ChartOptionData[]) => {
        data.forEach(async (raw) => {
          const result = this.adaptChartOption(raw);
          await this.emitter.emitAsync(ChartEvent.ChartOption, result);
        });
      }
    );
  }
}
