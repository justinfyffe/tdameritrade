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

enum ChartFuturesFields {
  Key = 0,
  ChartTime = 1,
  OpenPrice = 2,
  HighPrice = 3,
  LowPrice = 4,
  ClosePrice = 5,
  Volume = 6,
}

enum ChartOptionsFields {
  Key = 0,
  ChartTime = 1,
  OpenPrice = 2,
  HighPrice = 3,
  LowPrice = 4,
  ClosePrice = 5,
  Volume = 6,
}

interface ChartEquityOptions {
  symbols: string[];
  callback?: () => void | Promise<void>;
}

interface ChartFuturesOptions {
  symbols: string[];
  callback?: () => void | Promise<void>;
}

interface ChartOptionsptions {
  symbols: string[];
  callback?: () => void | Promise<void>;
}

export function subscribeChartEquity(
  td: TDAmeritrade,
  options: ChartEquityOptions
) {
  return createStreamRequest(td, {
    service: StreamService.ChartEquity,
    command: StreamCommand.Subscribe,
    parameters: {
      keys: options.symbols.map((symbol) => symbol.toUpperCase()).join(','),
      fields: [
        ChartEquityFields.Key,
        ChartEquityFields.OpenPrice,
        ChartEquityFields.HighPrice,
        ChartEquityFields.LowPrice,
        ChartEquityFields.ClosePrice,
        ChartEquityFields.Volume,
        ChartEquityFields.ChartTime,
        ChartEquityFields.ChartDay,
      ].join(','),
    },
    adapter: adaptChartEquity,
    callback: options.callback,
  });
}

export function subscribeChartFutures(
  td: TDAmeritrade,
  options: ChartFuturesOptions
) {
  return createStreamRequest(td, {
    service: StreamService.ChartFutures,
    command: StreamCommand.Subscribe,
    parameters: {
      keys: options.symbols.map((symbol) => symbol.toUpperCase()).join(','),
      fields: [
        ChartFuturesFields.Key,
        ChartFuturesFields.ChartTime,
        ChartFuturesFields.OpenPrice,
        ChartFuturesFields.HighPrice,
        ChartFuturesFields.LowPrice,
        ChartFuturesFields.ClosePrice,
        ChartFuturesFields.Volume,
      ].join(','),
    },
    adapter: adaptChartFutures,
    callback: options.callback,
  });
}

export function subscribeChartOptions(
  td: TDAmeritrade,
  options: ChartOptionsptions
) {
  return createStreamRequest(td, {
    service: StreamService.ChartOptions,
    command: StreamCommand.Subscribe,
    parameters: {
      keys: options.symbols.map((symbol) => symbol.toUpperCase()).join(','),
      fields: [
        ChartOptionsFields.Key,
        ChartOptionsFields.ChartTime,
        ChartOptionsFields.OpenPrice,
        ChartOptionsFields.HighPrice,
        ChartOptionsFields.LowPrice,
        ChartOptionsFields.ClosePrice,
        ChartOptionsFields.Volume,
      ].join(','),
    },
    adapter: adaptChartOptions,
    callback: options.callback,
  });
}

function adaptChartEquity() {}

function adaptChartFutures() {}

function adaptChartOptions() {}
