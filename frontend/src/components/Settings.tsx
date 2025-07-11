"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { Switch } from "@/components/ui/switch";

export interface SettingsState {
  algorithm: string;
  summary_length: string;
  compression_ratio: number;
  recognize_entities: boolean;
  analyze_sentiment: boolean;
}

interface SettingsProps {
  settings: SettingsState;
  onSettingsChange: (settings: SettingsState) => void;
}

const algorithmInfo: { [key: string]: string } = {
  "Frequency-Based": "Ranks sentences based on the frequency of words they contain.",
  "TF-IDF": "Scores sentences based on how important words are to the document.",
  "TextRank": "A graph-based algorithm that ranks sentences by importance, similar to Google's PageRank.",
  "Position-Based": "Selects the first few sentences of the text, assuming the most important information is at the beginning.",
  "Hugging Face (Default)": "Uses a pre-trained AI model (DistilBART) to generate a new, abstractive summary.",
  "Hugging Face (BART)": "Uses the BART (large-cnn) model for more detailed abstractive summarization.",
  "Hugging Face (T5)": "Uses the T5 model, which is excellent for a wide range of NLP tasks including summarization.",
};

export default function Settings({ settings, onSettingsChange }: SettingsProps) {
  return (
    <TooltipProvider>
      <div className="space-y-6 p-4 border-t border-gray-700">
        <h3 className="text-lg font-semibold">Summarization Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="algorithm">Algorithm</Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="w-4 h-4 text-gray-400 cursor-pointer" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{algorithmInfo[settings.algorithm] || "Select an algorithm to see its description."}</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Select
              value={settings.algorithm}
              onValueChange={(value) => onSettingsChange({ ...settings, algorithm: value })}
            >
              <SelectTrigger id="algorithm" className="bg-gray-800 border-gray-700">
                <SelectValue placeholder="Select algorithm" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Frequency-Based">Frequency-Based</SelectItem>
                <SelectItem value="TF-IDF">TF-IDF</SelectItem>
                <SelectItem value="TextRank">TextRank</SelectItem>
                <SelectItem value="Position-Based">Position-Based</SelectItem>
                <SelectItem value="Hugging Face (Default)">Hugging Face (Default)</SelectItem>
                <SelectItem value="Hugging Face (BART)">Hugging Face (BART)</SelectItem>
                <SelectItem value="Hugging Face (T5)">Hugging Face (T5)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {settings.algorithm.includes('Hugging Face') ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="summary-length">Summary Length</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-4 h-4 text-gray-400 cursor-pointer" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Select the desired length of the abstractive summary.</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Select
                value={settings.summary_length}
                onValueChange={(value) => onSettingsChange({ ...settings, summary_length: value })}
              >
                <SelectTrigger id="summary-length" className="bg-gray-800 border-gray-700">
                  <SelectValue placeholder="Select length" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Short">Short</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Long">Long</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex justify-between">
                <div className="flex items-center gap-2">
                  <Label htmlFor="compression-ratio">Compression Ratio</Label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="w-4 h-4 text-gray-400 cursor-pointer" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Percentage of the original text to keep in the summary.</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <span className="text-sm text-gray-400">{settings.compression_ratio}%</span>
              </div>
              <Slider
                id="compression-ratio"
                min={10}
                max={80}
                step={5}
                value={[settings.compression_ratio]}
                onValueChange={(value) => onSettingsChange({ ...settings, compression_ratio: value[0] })}
              />
            </div>
          )}
        </div>
        <div className="space-y-4 pt-4">
            <h4 className="text-md font-semibold">Additional Analysis</h4>
            <div className="flex items-center space-x-2">
              <Switch
                id="recognize-entities"
                checked={settings.recognize_entities}
                onCheckedChange={(checked: boolean) => onSettingsChange({ ...settings, recognize_entities: checked })}
              />
              <Label htmlFor="recognize-entities">Recognize Named Entities</Label>
            </div>
            <div className="flex items-center space-x-2">
                <Switch
                    id="analyze-sentiment"
                    checked={settings.analyze_sentiment}
                    onCheckedChange={(checked: boolean) => onSettingsChange({ ...settings, analyze_sentiment: checked })}
                />
                <Label htmlFor="analyze-sentiment">Analyze Sentiment</Label>
            </div>
        </div>
      </div>
    </TooltipProvider>
  );
}