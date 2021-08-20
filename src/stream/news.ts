import { EventEmitter2 } from 'eventemitter2';
import { Client } from './client';

enum NewsHeadlineFields {
  Symbol = 0,
  ErrorCode = 1,
  StoryDatetime = 2,
  HeadlineId = 3,
  Status = 4,
  Headline = 5,
  StoryId = 6,
  CountForKeyword = 7,
  KeywordArray = 8,
  IsHot = 9,
  StorySource = 10,
}

export enum NewsEvent {
  NewsHeadline = 'news-headline',
}

interface NewsHeadlineResponse {
  key: string;
  seq: number;
  [NewsHeadlineFields.ErrorCode]: number;
  [NewsHeadlineFields.StoryDatetime]: number;
  [NewsHeadlineFields.HeadlineId]: string;
  [NewsHeadlineFields.Status]: string;
  [NewsHeadlineFields.Headline]: string;
  [NewsHeadlineFields.StoryId]: string;
  [NewsHeadlineFields.CountForKeyword]: number;
  [NewsHeadlineFields.KeywordArray]: string;
  [NewsHeadlineFields.IsHot]: boolean;
  [NewsHeadlineFields.StorySource]: string;
}

interface NewsHeadlineOptions {
  symbols: string[];
}

export class News {
  private emitter = new EventEmitter2();

  constructor(private client: Client) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  on(event: NewsEvent, fn: (...args: any[]) => void | Promise<void>) {
    this.emitter.on(event, fn);
  }

  subscribeToNewsHeadlines(options: NewsHeadlineOptions) {
    const fields = Object.values(NewsHeadlineFields).filter(
      (value) => typeof value === 'number'
    );

    this.client.send(
      {
        service: 'NEWS_HEADLINE',
        command: 'SUBS',
        parameters: {
          keys: options.symbols.map((symbol) => symbol.toUpperCase()).join(','),
          fields: fields.join(','),
        },
      },
      async (response: NewsHeadlineResponse) => {
        const result = await this.adaptNewsHeadline(response);
        await this.emitter.emitAsync(NewsEvent.NewsHeadline, result);
      }
    );
  }

  private async adaptNewsHeadline(content: NewsHeadlineResponse) {
    return content;
  }
}
