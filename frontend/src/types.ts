export type View = 'main' | 'direct' | 'url' | 'sample';

export interface Entity {
  text: string;
  label: string;
}

export interface Sentiment {
  label: string;
  score: number;
}

export interface SummarizeTextRequest {
  text: string;
  algorithm: string;
  summary_length: string;
  compression_ratio: number;
  recognize_entities?: boolean;
  analyze_sentiment?: boolean;
}

export interface SummarizeURLRequest {
  url: string;
  algorithm: string;
  summary_length: string;
  compression_ratio: number;
  recognize_entities?: boolean;
  analyze_sentiment?: boolean;
}

export interface SummarizeResponse {
  summary: string;
  entities?: Entity[];
  sentiment?: Sentiment;
}

export interface SampleTextResponse {
  sample_text: string;
}