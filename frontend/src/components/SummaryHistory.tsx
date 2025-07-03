"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const history = [
  {
    id: "1",
    text: "This is the first summary.",
    timestamp: new Date(),
  },
  {
    id: "2",
    text: "This is the second summary.",
    timestamp: new Date(),
  },
];

export default function SummaryHistory() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Summary History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {history.map((item) => (
            <div key={item.id} className="p-4 rounded-lg bg-gray-800">
              <p className="text-sm text-gray-400">
                {item.timestamp.toLocaleString()}
              </p>
              <p>{item.text}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}