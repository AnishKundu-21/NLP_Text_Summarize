import { SummarizeTextRequest, SummarizeURLRequest, SummarizeResponse, SampleTextResponse } from "@/types";

const API_BASE_URL = "http://localhost:8000";

export const summarizeText = async (data: SummarizeTextRequest): Promise<SummarizeResponse> => {
  const response = await fetch(`${API_BASE_URL}/summarize-text`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to summarize text");
  }

  return response.json();
};

export const summarizeUrl = async (data: SummarizeURLRequest): Promise<SummarizeResponse> => {
  const response = await fetch(`${API_BASE_URL}/summarize-url`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to summarize URL");
  }

  return response.json();
};

export const getSampleText = async (): Promise<SampleTextResponse> => {
  const response = await fetch(`${API_BASE_URL}/sample-text`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to fetch sample text");
  }

  return response.json();
};