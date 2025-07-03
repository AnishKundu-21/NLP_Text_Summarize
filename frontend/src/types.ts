export type View = 'main' | 'direct' | 'url' | 'sample';

export interface SummarizeTextRequest {
  text: string;
  algorithm: string;
  summary_length: string;
  compression_ratio: number;
}

export interface SummarizeURLRequest {
  url: string;
  algorithm: string;
  summary_length: string;
  compression_ratio: number;
}

export interface SummarizeResponse {
  summary: string;
}

export interface SampleTextResponse {
  sample_text: string;
}
