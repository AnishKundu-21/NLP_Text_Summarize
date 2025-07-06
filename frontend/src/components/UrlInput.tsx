"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { View, Entity, Sentiment } from "@/types";
import { Dispatch, SetStateAction } from "react";
import Settings, { SettingsState } from "./Settings";
import { summarizeUrl } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Smile, Frown, Meh } from "lucide-react";

export default function UrlInput({
  setView,
  settings,
  onSettingsChange,
  onNewSummary,
}: {
  setView: Dispatch<SetStateAction<View>>;
  settings: SettingsState;
  onSettingsChange: (settings: SettingsState) => void;
  onNewSummary: (summary: string) => void;
}) {
  const [url, setUrl] = useState("");
  const [summary, setSummary] = useState("");
  const [entities, setEntities] = useState<Entity[]>([]);
  const [sentiment, setSentiment] = useState<Sentiment | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSummarize = async () => {
    if (!url) return;
    setIsLoading(true);
    setError(null);
    setSummary("");
    setEntities([]);
    setSentiment(null);
    try {
      const response = await summarizeUrl({
        url,
        ...settings,
      });
      setSummary(response.summary);
      if (response.entities) {
        setEntities(response.entities);
      }
      if (response.sentiment) {
        setSentiment(response.sentiment);
      }
      onNewSummary(response.summary);
    } catch (err: any) {
      setError(err.message || "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const getBadgeVariant = (label: string) => {
    switch (label) {
      case 'PERSON':
        return 'default';
      case 'ORG':
        return 'secondary';
      case 'GPE':
      case 'LOC':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const renderSentiment = () => {
    if (!sentiment) return null;

    const sentimentIcon =
      sentiment.label === 'Positive' ? (
        <Smile className="w-5 h-5 text-green-500" />
      ) : sentiment.label === 'Negative' ? (
        <Frown className="w-5 h-5 text-red-500" />
      ) : (
        <Meh className="w-5 h-5 text-yellow-500" />
      );

    return (
      <div className="mt-4">
        <h4 className="text-md font-semibold">Sentiment</h4>
        <div className="flex items-center gap-2 mt-2">
          {sentimentIcon}
          <span className="font-medium">{sentiment.label}</span>
          <span className="text-sm text-gray-400">(Score: {sentiment.score.toFixed(2)})</span>
        </div>
      </div>
    );
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
          {renderSentiment()}
          {entities.length > 0 && (
            <div className="mt-4">
              <h4 className="text-md font-semibold">Named Entities</h4>
              <div className="flex flex-wrap gap-2 mt-2">
                {entities.map((entity, index) => (
                  <Badge key={index} variant={getBadgeVariant(entity.label)}>
                    {entity.text} <span className="text-xs opacity-75 ml-2">{entity.label}</span>
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}