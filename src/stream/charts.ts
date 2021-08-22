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

interface ChartEquityResponse {
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

interface ChartOptionResponse {
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

  constructor(private client: Client) {}

  onChartEquity(fn: (chartEquity: ChartEquity) => void | Promise<void>) {
    this.emitter.on(ChartEvent.ChartEquity, fn);
  }

  onChartOption(fn: (chartOption: ChartOption) => void | Promise<void>) {
    this.emitter.on(ChartEvent.ChartOption, fn);
  }

  subscribeToChartEquities(options: ChartEquityOptions) {
    const fields = Object.values(ChartEquityFields).filter(
      (value) => typeof value === 'number'
    );

    this.client.send(
      {
        service: 'CHART_EQUITY',
        command: 'SUBS',
        parameters: {
          keys: options.symbols.map((symbol) => symbol.toUpperCase()).join(','),
          fields: fields.join(','),
        },
      },
      async (response: ChartEquityResponse) => {
        const result = this.adaptChartEquity(response);
        await this.emitter.emitAsync(ChartEvent.ChartEquity, result);
      }
    );
  }

  subscribeToChartOptions(options: ChartOptionOptions) {
    const fields = Object.values(ChartOptionFields).filter(
      (value) => typeof value === 'number'
    );

    this.client.send(
      {
        service: 'CHART_OPTIONS',
        command: 'SUBS',
        parameters: {
          keys: options.symbols.map((symbol) => symbol.toUpperCase()).join(','),
          fields: fields.join(','),
        },
      },
      async (response: ChartOptionResponse) => {
        const result = this.adaptChartOption(response);
        await this.emitter.emitAsync(ChartEvent.ChartOption, result);
      }
    );
  }

  private adaptChartEquity(content: ChartEquityResponse): ChartEquity {
    return {
      symbol: content.key,
      openPrice: content[ChartEquityFields.OpenPrice],
      highPrice: content[ChartEquityFields.HighPrice],
      lowPrice: content[ChartEquityFields.LowPrice],
      closePrice: content[ChartEquityFields.ClosePrice],
      volume: content[ChartEquityFields.Volume],
      sequence: content[ChartEquityFields.Sequence],
      chartTime: content[ChartEquityFields.ChartTime],
    };
  }

  private adaptChartOption(content: ChartOptionResponse): ChartOption {
    return {
      symbol: content.key,
      openPrice: content[ChartOptionFields.OpenPrice],
      highPrice: content[ChartOptionFields.HighPrice],
      lowPrice: content[ChartOptionFields.LowPrice],
      closePrice: content[ChartOptionFields.ClosePrice],
      volume: content[ChartOptionFields.Volume],
      chartTime: content[ChartOptionFields.ChartTime],
    };
  }
}
