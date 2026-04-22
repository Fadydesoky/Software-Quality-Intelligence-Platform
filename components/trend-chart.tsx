"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts"
import type { HistoryEntry } from "@/lib/prediction"

interface TrendChartProps {
  history: HistoryEntry[]
}

export function TrendChart({ history }: TrendChartProps) {
  if (history.length < 2) {
    return null
  }

  const data = history.map((entry, index) => ({
    index: index + 1,
    score: entry.score,
    time: new Date(entry.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  }))

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Risk Trend Over Time</CardTitle>
        <CardDescription>Quality score progression across predictions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="time" 
                tick={{ fontSize: 11 }}
                interval="preserveStartEnd"
              />
              <YAxis 
                tick={{ fontSize: 12 }} 
                domain={[0, 100]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                  fontSize: 12,
                }}
                formatter={(value: number) => [`${value}`, "Score"]}
              />
              <ReferenceLine y={75} stroke="hsl(142.1 76.2% 36.3%)" strokeDasharray="3 3" label={{ value: "Low Risk", position: "right", fontSize: 10 }} />
              <ReferenceLine y={50} stroke="hsl(45.4 93.4% 47.5%)" strokeDasharray="3 3" label={{ value: "Medium", position: "right", fontSize: 10 }} />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
