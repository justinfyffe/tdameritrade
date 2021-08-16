import { TDAmeritrade } from '../tdameritrade';
import { createStreamRequest, StreamCommand, StreamService } from './client';

export interface Actives {}

enum ActivesField {
  Key = 0,
  Data = 1,
}

interface ActivesResponse {
  key: string;
  [ActivesField.Data]: string;
}

export enum ActivesVenue {
  Nasdaq = 'NASDAQ',
  Nyse = 'NYSE',
  Otcbb = 'OTCBB',
  Options = 'OPTS',
  Calls = 'CALLS',
  Puts = 'PUTS',
  CallsDesc = 'CALLS-DESC',
}

type Duration = 3600 | 1800 | 600 | 300 | 60;

interface ActivesOptions {
  venue: ActivesVenue;
  duration?: Duration;
  onSuccess?: (message: string) => void | Promise<void>;
  onError?: (message: string) => void | Promise<void>;
  onData?: () => void | Promise<void>;
}

export function subscribeToActives(td: TDAmeritrade, options: ActivesOptions) {
  return createStreamRequest(td, {
    service: getService(options.venue),
    command: StreamCommand.Subscribe,
    parameters: {
      keys: getKey(options.venue, options.duration),
      fields: [ActivesField.Key, ActivesField.Data].join(','),
    },
    adapter: adaptActives,
    onSuccess: options?.onSuccess,
    onError: options?.onError,
    onData: options?.onData,
  });
}

function getService(venue: ActivesVenue) {
  switch (venue) {
    case ActivesVenue.Nasdaq:
      return StreamService.ActivesNasdaq;
    case ActivesVenue.Nyse:
      return StreamService.ActivesNyse;
    case ActivesVenue.Otcbb:
      return StreamService.ActivesOtcbb;
    default:
      return StreamService.ActivesOptions;
  }
}

function getKey(venue: ActivesVenue, duration?: Duration) {
  return `${venue}-${duration ?? 'ALL'}`;
}

function adaptActives(content: ActivesResponse) {
  const data = content[ActivesField.Data];

  const groups = data.split(';');
  const id = Number(groups[0]);
  const sampleDuration = Number(groups[1]);
  const startTime = groups[2];
  const displayTime = groups[3];
  const totalGroups = Number(groups[4]);

  for (let i = 0; i < totalGroups; ++i) {
    const group = groups[5 + i];
    const entries = group.split(':');

    const groupNumber = Number(entries[0]);
    const totalEntries = Number(entries[1]);
    const totalVolume = Number(entries[2]);
  }

  return content;
}
