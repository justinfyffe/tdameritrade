import { TDAmeritrade } from '../tdameritrade';
import { createStreamRequest, StreamCommand, StreamService } from './client';

enum TimeSaleFields {
  Symbol = 0,
  TradeTime = 1,
  LastPrice = 2,
  LastSize = 3,
  LastSequence = 4,
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
  onSuccess?: (message: string) => void | Promise<void>;
  onError?: (message: string) => void | Promise<void>;
  onData?: () => void | Promise<void>;
}

export function subscribeToEquityTimeSales(
  td: TDAmeritrade,
  options: TimeSaleOptions
) {
  const fields = Object.values(TimeSaleFields).filter(
    (value) => typeof value === 'number'
  );

  return createStreamRequest(td, {
    service: StreamService.TimesaleEquity,
    command: StreamCommand.Subscribe,
    parameters: {
      keys: options.symbols.map((symbol) => symbol.toUpperCase()).join(','),
      fields: fields.join(','),
    },
    adapter: adaptTimeSale,
    onSuccess: options?.onSuccess,
    onError: options?.onError,
    onData: options?.onData,
  });
}

export function subscribeToOptionTimeSales(
  td: TDAmeritrade,
  options: TimeSaleOptions
) {
  const fields = Object.values(TimeSaleFields).filter(
    (value) => typeof value === 'number'
  );

  return createStreamRequest(td, {
    service: StreamService.TimesaleOptions,
    command: StreamCommand.Subscribe,
    parameters: {
      keys: options.symbols.map((symbol) => symbol.toUpperCase()).join(','),
      fields: fields.join(','),
    },
    adapter: adaptTimeSale,
    onSuccess: options?.onSuccess,
    onError: options?.onError,
    onData: options?.onData,
  });
}

function adaptTimeSale(content: TimeSaleResponse) {
  return content;
}
