"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Define the shape of a history item
interface HistoryItem {
  id: string;
  text: string;
  timestamp: Date;
}

// Update the component to accept a 'history' prop
export default function SummaryHistory({ history }: { history: HistoryItem[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Summary History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {history.length > 0 ? (
            history.map((item) => (
              <div key={item.id} className="p-4 rounded-lg bg-gray-800">
                <p className="text-sm text-gray-400">
                  {item.timestamp.toLocaleString()}
                </p>
                <p>{item.text}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No summaries generated yet.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}