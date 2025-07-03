"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { View } from "@/types";
import { Dispatch, SetStateAction } from "react";
import Settings, { SettingsState } from "./Settings";
import { summarizeUrl } from "@/lib/api";

export default function UrlInput({
  setView,
  settings,
  onSettingsChange,
}: {
  setView: Dispatch<SetStateAction<View>>;
  settings: SettingsState;
  onSettingsChange: (settings: SettingsState) => void;
}) {
  const [url, setUrl] = useState("");
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSummarize = async () => {
    if (!url) return;
    setIsLoading(true);
    setError(null);
    setSummary("");
    try {
      const response = await summarizeUrl({
        url,
        ...settings,
      });
      setSummary(response.summary);
    } catch (err: any) {
      setError(err.message || "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>URL Input</CardTitle>
          <Button variant="ghost" onClick={() => setView("main")}>
            Back
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Input
            placeholder="Enter URL..."
            value={url}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setUrl(e.target.value)
            }
            className="bg-gray-800 border-gray-700"
          />
          <Button
            onClick={handleSummarize}
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Summarizing..." : "Summarize"}
          </Button>
        </div>
      </CardContent>
      <Settings settings={settings} onSettingsChange={onSettingsChange} />
      {error && (
        <div className="p-4 border-t border-gray-700">
          <p className="text-red-500">{error}</p>
        </div>
      )}
      {summary && (
        <div className="p-4 border-t border-gray-700">
          <h3 className="text-lg font-semibold">Summary</h3>
          <p className="mt-2">{summary}</p>
        </div>
      )}
    </Card>
  );
}