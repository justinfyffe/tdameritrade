import { TDAmeritrade } from '../tdameritrade';
import { createStreamRequest, StreamCommand, StreamService } from './client';

enum ActivesField {
  Key = 0,
  Data = 1,
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
  callback?: () => void | Promise<void>;
}

export function subscribeActives(td: TDAmeritrade, options: ActivesOptions) {
  return createStreamRequest(td, {
    service: getService(options.venue),
    command: StreamCommand.Subscribe,
    parameters: {
      keys: getKey(options.venue, options.duration),
      fields: [ActivesField.Key, ActivesField.Data].join(','),
    },
    adapter: adaptActives,
    callback: options.callback,
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

function adaptActives() {}

function getKey(venue: ActivesVenue, duration?: Duration) {
  return `${venue}-${duration ?? 'ALL'}`;
}
