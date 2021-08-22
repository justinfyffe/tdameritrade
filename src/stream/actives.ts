import { EventEmitter2 } from 'eventemitter2';
import { Client } from './client';

export interface Actives {
  venue: ActivesVenue;
  duration?: Duration;

  id: number;
  sampleDuration: number;
  startTime: string;
  displayTime: string;
  groups: ActivesGroup[];
}

export interface ActivesGroup {
  groupNumber: number;
  totalVolume: number;
  entries: ActivesStockEntry[] | ActivesOptionEntry[];
}

export interface ActivesStockEntry {
  symbol: string;
  volume: number;
  percent: number;
}

export interface ActivesOptionEntry {
  symbol: string;
  description: string;
  volume: number;
  percent: number;
}

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

export class ActiveService {
  private emitter = new EventEmitter2();

  constructor(private client: Client) {}

  onActives(
    event: ActivesEvent,
    fn: (actives: Actives) => void | Promise<void>
  ) {
    this.emitter.on(event, fn);
  }

  subscribeToActives(options: ActivesOptions) {
    const service = this.getService(options.venue);
    this.client.send(
      {
        service,
        command: 'SUBS',
        parameters: {
          keys: this.getKey(options.venue, options.duration),
          fields: [ActivesField.Key, ActivesField.Data].join(','),
        },
      },
      async (response: ActivesResponse) => {
        const result = this.adaptActives(response, service);
        await this.emitter.emitAsync(ActivesEvent.Actives, result);
      }
    );
  }

  private adaptActives(content: ActivesResponse, service: string) {
    const key = content.key;
    const [venue, duration] = key.split('-');

    const data = content[ActivesField.Data];
    const groups = data.split(';');
    const id = Number(groups[0]);
    const sampleDuration = Number(groups[1]);
    const startTime = groups[2];
    const displayTime = groups[3];
    const totalGroups = Number(groups[4]);

    const actives: Actives = {
      venue: venue as ActivesVenue,
      duration: duration != 'ALL' ? (Number(duration) as Duration) : undefined,
      id,
      sampleDuration,
      startTime,
      displayTime,
      groups: [],
    };

    for (let i = 0; i < totalGroups; ++i) {
      const group = groups[5 + i];
      const entries = group.split(':');

      const groupNumber = Number(entries[0]);
      const totalEntries = Number(entries[1]);
      const totalVolume = Number(entries[2]);

      actives.groups.push({
        groupNumber,
        totalVolume,
        entries:
          service === 'ACTIVES_OPTIONS'
            ? this.adaptOptionEntries(entries, totalEntries)
            : this.adaptStockEntries(entries, totalEntries),
      });
    }

    return actives;
  }

  private adaptStockEntries(entries: string[], totalEntries: number) {
    const result: ActivesStockEntry[] = [];
    for (let j = 0; j < totalEntries; j += 3) {
      result.push({
        symbol: entries[3 + j],
        volume: Number(entries[4 + j]),
        percent: Number(entries[5 + j]),
      });
    }
    return result;
  }

  private adaptOptionEntries(entries: string[], totalEntries: number) {
    const result: ActivesOptionEntry[] = [];
    for (let j = 0; j < totalEntries; j += 3) {
      result.push({
        symbol: entries[3 + j],
        description: entries[4 + j],
        volume: Number(entries[5 + j]),
        percent: Number(entries[6 + j]),
      });
    }
    return result;
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
