import { TDAmeritrade } from '../tdameritrade';
import { createStreamRequest, StreamCommand, StreamService } from './client';

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
  onSuccess?: (message: string) => void | Promise<void>;
  onError?: (message: string) => void | Promise<void>;
  onData?: () => void | Promise<void>;
}

export function subscribeToNewsHeadlines(
  td: TDAmeritrade,
  options: NewsHeadlineOptions
) {
  const fields = Object.values(NewsHeadlineFields).filter(
    (value) => typeof value === 'number'
  );

  return createStreamRequest(td, {
    service: StreamService.NewsHeadline,
    command: StreamCommand.Subscribe,
    parameters: {
      keys: options.symbols.map((symbol) => symbol.toUpperCase()).join(','),
      fields: fields.join(','),
    },
    adapter: adaptNewsHeadline,
    onSuccess: options?.onSuccess,
    onError: options?.onError,
    onData: options?.onData,
  });
}

function adaptNewsHeadline(content: NewsHeadlineResponse) {
  return content;
}
