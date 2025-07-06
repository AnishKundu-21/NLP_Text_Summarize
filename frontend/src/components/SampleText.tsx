"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { View } from "@/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Settings, { SettingsState } from "./Settings";
import { getSampleText, summarizeText } from "@/lib/api";

export default function SampleText({
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
	const [sampleTexts, setSampleTexts] = useState<{ id: string; title: string; text: string }[]>([]);
	const [selectedText, setSelectedText] = useState("");
	const [summary, setSummary] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchSampleTexts = async () => {
			try {
				const response = await getSampleText();
				// The backend returns a single string, so we'll create a single sample text object
				setSampleTexts([
					{
						id: "1",
						title: "Sample Article",
						text: response.sample_text,
					},
				]);
			} catch (err: any) {
				setError(err.message || "Failed to fetch sample texts.");
			}
		};
		fetchSampleTexts();
	}, []);

	const handleSummarize = async () => {
		if (!selectedText) return;
		setIsLoading(true);
		setError(null);
		setSummary("");
		try {
			const response = await summarizeText({
				text: selectedText,
				...settings,
			});
			setSummary(response.summary);
      onNewSummary(response.summary);
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
					<CardTitle>Sample Text</CardTitle>
					<Button variant="ghost" onClick={() => setView("main")}>
						Back
					</Button>
				</div>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					<Select onValueChange={setSelectedText} disabled={sampleTexts.length === 0}>
						<SelectTrigger className="w-full bg-gray-800 border-gray-700">
							<SelectValue placeholder="Select a sample text" />
						</SelectTrigger>
						<SelectContent>
							{sampleTexts.map((sample) => (
								<SelectItem key={sample.id} value={sample.text}>
									{sample.title}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<Button onClick={handleSummarize} className="w-full" disabled={!selectedText || isLoading}>
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