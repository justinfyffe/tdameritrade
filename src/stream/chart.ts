import { TDAmeritrade } from '../tdameritrade';
import { createStreamRequest, StreamCommand, StreamService } from './client';

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
  onSuccess?: (message: string) => void | Promise<void>;
  onError?: (message: string) => void | Promise<void>;
  onData?: () => void | Promise<void>;
}

interface ChartOptionOptions {
  symbols: string[];
  onSuccess?: (message: string) => void | Promise<void>;
  onError?: (message: string) => void | Promise<void>;
  onData?: () => void | Promise<void>;
}

export function subscribeToChartEquities(
  td: TDAmeritrade,
  options: ChartEquityOptions
) {
  const fields = Object.values(ChartEquityFields).filter(
    (value) => typeof value === 'number'
  );

  return createStreamRequest(td, {
    service: StreamService.ChartEquity,
    command: StreamCommand.Subscribe,
    parameters: {
      keys: options.symbols.map((symbol) => symbol.toUpperCase()).join(','),
      fields: fields.join(','),
    },
    adapter: adaptChartEquity,
    onSuccess: options?.onSuccess,
    onError: options?.onError,
    onData: options?.onData,
  });
}

export function subscribeToChartOptions(
  td: TDAmeritrade,
  options: ChartOptionOptions
) {
  const fields = Object.values(ChartOptionFields).filter(
    (value) => typeof value === 'number'
  );

  return createStreamRequest(td, {
    service: StreamService.ChartOptions,
    command: StreamCommand.Subscribe,
    parameters: {
      keys: options.symbols.map((symbol) => symbol.toUpperCase()).join(','),
      fields: fields.join(','),
    },
    adapter: adaptChartOption,
    onSuccess: options?.onSuccess,
    onError: options?.onError,
    onData: options?.onData,
  });
}

function adaptChartEquity(content: ChartEquityResponse) {
  return content;
}

function adaptChartOption(content: ChartOptionResponse) {
  return content;
}
