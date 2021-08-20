import { EventEmitter2 } from 'eventemitter2';
import { Client } from './client';

enum ChartEquityFields {
  Key = 0,
  OpenPrice = 1,
  HighPrice = 2,
  LowPrice = 3,
  ClosePrice = 4,
  Volume = 5,
  Sequence = 6,
  ChartTime = 7,
  ChartDay = 8,
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

export enum ChartsEvent {
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
  [ChartEquityFields.ChartDay]: number;
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

export class Charts {
  private emitter = new EventEmitter2();

  constructor(private client: Client) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  on(event: ChartsEvent, fn: (...args: any[]) => void | Promise<void>) {
    this.emitter.on(event, fn);
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
        const result = await this.adaptChartEquity(response);
        await this.emitter.emitAsync(ChartsEvent.ChartEquity, result);
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
        const result = await this.adaptChartOption(response);
        await this.emitter.emitAsync(ChartsEvent.ChartOption, result);
      }
    );
  }

  private async adaptChartEquity(content: ChartEquityResponse) {
    return content;
  }

  private async adaptChartOption(content: ChartOptionResponse) {
    return content;
  }
}
