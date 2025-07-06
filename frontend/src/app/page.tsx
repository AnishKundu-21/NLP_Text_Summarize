'use client';

import { useState } from 'react';
import Image from "next/image";
import DirectText from '@/components/DirectText';
import UrlInput from '@/components/UrlInput';
import SampleText from '@/components/SampleText';
import SummaryHistory from '@/components/SummaryHistory';
import { FileText, Globe, BookText } from 'lucide-react';
import { Card } from '@/components/Card';
import Settings, { SettingsState } from '@/components/Settings';
import { View } from '@/types';

// Define the shape of a history item
interface HistoryItem {
  id: string;
  text: string;
  timestamp: Date;
}

export default function Home() {
  const [view, setView] = useState<View>('main');
  const [settings, setSettings] = useState<SettingsState>({
    algorithm: 'Frequency-Based',
    summary_length: 'Medium',
    compression_ratio: 40,
  });
  const [summaryHistory, setSummaryHistory] = useState<HistoryItem[]>([]);

  const handleNewSummary = (summaryText: string) => {
    const newSummary: HistoryItem = {
      id: new Date().toISOString(),
      text: summaryText,
      timestamp: new Date(),
    };
    setSummaryHistory([newSummary, ...summaryHistory]);
  };

  const renderView = () => {
    switch (view) {
      case 'direct':
        return <DirectText setView={setView} settings={settings} onSettingsChange={setSettings} onNewSummary={handleNewSummary} />;
      case 'url':
        return <UrlInput setView={setView} settings={settings} onSettingsChange={setSettings} onNewSummary={handleNewSummary} />;
      case 'sample':
        return <SampleText setView={setView} settings={settings} onSettingsChange={setSettings} onNewSummary={handleNewSummary} />;
      default:
        return renderMainPage();
    }
  };

  const renderMainPage = () => (
    <div className="space-y-12">
      <div className="text-center pt-12">
        <h2 className="text-4xl font-bold tracking-tight">Advanced Text Summarization</h2>
        <p className="text-lg text-gray-400 mt-2">
          Choose your preferred input method to get started with AI-powered text summarization.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        <Card
          title="Direct Text"
          description="Paste or type your text directly"
          icon={<FileText className="w-12 h-12 text-teal-400" />}
          onClick={() => setView('direct')}
        />
        <Card
          title="URL Input"
          description="Extract text from web pages"
          icon={<Globe className="w-12 h-12 text-teal-400" />}
          onClick={() => setView('url')}
        />
        <Card
          title="Sample Text"
          description="Try with pre-loaded examples"
          icon={<BookText className="w-12 h-12 text-teal-400" />}
          onClick={() => setView('sample')}
        />
      </div>
      <SummaryHistory history={summaryHistory} />
    </div>
  );

  return (
    <div className="min-h-screen">
      <header className="py-4 border-b border-gray-700">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">NLP Text Summarizer</h1>
          <div className="w-8 h-8 bg-orange-400 rounded-full"></div>
        </div>
      </header>
      <main className="py-8">
        {renderView()}
      </main>
      <footer className="text-center py-4 border-t border-gray-700 text-sm text-gray-500">
        <p>© 2025 NLP Text Summarizer. Built with advanced natural language processing techniques.</p>
      </footer>
    </div>
  );
}