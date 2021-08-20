import { EventEmitter2 } from 'eventemitter2';
import { Client } from './client';

export interface Actives {}

enum ActivesField {
  Key = 0,
  Data = 1,
}

export enum ActivesEvent {
  Actives = 'actives',
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
}

export class Actives {
  private emitter = new EventEmitter2();

  constructor(private client: Client) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  on(event: ActivesEvent, fn: (...args: any[]) => void | Promise<void>) {
    this.emitter.on(event, fn);
  }

  subscribeToActives(options: ActivesOptions) {
    this.client.send(
      {
        service: this.getService(options.venue),
        command: 'SUBS',
        parameters: {
          keys: this.getKey(options.venue, options.duration),
          fields: [ActivesField.Key, ActivesField.Data].join(','),
        },
      },
      async (response: ActivesResponse) => {
        const result = await this.adaptActives(response);
        await this.emitter.emitAsync(ActivesEvent.Actives, result);
      }
    );
  }

  private async adaptActives(content: ActivesResponse) {
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

  private getService(venue: ActivesVenue) {
    switch (venue) {
      case ActivesVenue.Nasdaq:
        return 'ACTIVES_NASDAQ';
      case ActivesVenue.Nyse:
        return 'ACTIVES_NYSE';
      case ActivesVenue.Otcbb:
        return 'ACTIVES_OTCBB';
      default:
        return 'ACTIVES_OPTIONS';
    }
  }

  private getKey(venue: ActivesVenue, duration?: Duration) {
    return `${venue}-${duration ?? 'ALL'}`;
  }
}
