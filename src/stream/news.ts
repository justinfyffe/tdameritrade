import { EventEmitter2 } from 'eventemitter2';
import { Client } from './client';

export interface NewsHeadline {
  symbol: string;
  error?: number;
  datetime: number;
  headlineId: string;
  status: string;
  headline: string;
  storyId: string;
  keywords: string[];
  hot: boolean;
  source: string;
}

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

enum NewsEvent {
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

export class NewsService {
  private emitter = new EventEmitter2();

  constructor(private client: Client) {}

  onNewsHeadline(fn: (newsHeadline: NewsHeadline) => void | Promise<void>) {
    this.emitter.on(NewsEvent.NewsHeadline, fn);
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
        const result = this.adaptNewsHeadline(response);
        await this.emitter.emitAsync(NewsEvent.NewsHeadline, result);
      }
    );
  }

  private adaptNewsHeadline(content: NewsHeadlineResponse): NewsHeadline {
    const error = content[NewsHeadlineFields.ErrorCode];

    return {
      symbol: content.key,
      error: error !== 0 ? error : undefined,
      datetime: content[NewsHeadlineFields.StoryDatetime],
      headlineId: content[NewsHeadlineFields.HeadlineId],
      status: content[NewsHeadlineFields.Status],
      headline: content[NewsHeadlineFields.Headline],
      storyId: content[NewsHeadlineFields.StoryId],
      keywords: content[NewsHeadlineFields.KeywordArray].split(','),
      hot: content[NewsHeadlineFields.IsHot],
      source: content[NewsHeadlineFields.StorySource],
    };
  }
}
