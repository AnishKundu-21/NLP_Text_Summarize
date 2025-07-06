"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";

export interface SettingsState {
  algorithm: string;
  summary_length: string;
  compression_ratio: number;
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
  "Hugging Face": "Uses a pre-trained AI model to generate a new, abstractive summary.",
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
                  <p>{algorithmInfo[settings.algorithm]}</p>
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
                <SelectItem value="Hugging Face">Hugging Face</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {settings.algorithm === 'Hugging Face' ? (
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
      </div>
    </TooltipProvider>
  );
}