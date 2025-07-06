export type View = 'main' | 'direct' | 'url' | 'sample';

export interface Entity {
  text: string;
  label: string;
}

export interface SummarizeTextRequest {
  text: string;
  algorithm: string;
  summary_length: string;
  compression_ratio: number;
  recognize_entities?: boolean;
}

export interface SummarizeURLRequest {
  url: string;
  algorithm: string;
  summary_length: string;
  compression_ratio: number;
  recognize_entities?: boolean;
}

export interface SummarizeResponse {
  summary: string;
  entities?: Entity[];
}

export interface SampleTextResponse {
  sample_text: string;
}