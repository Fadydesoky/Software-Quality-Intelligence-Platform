"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { X } from "lucide-react"
import type { HistoryEntry } from "@/lib/prediction"

interface ComparisonChartProps {
  entries: [HistoryEntry, HistoryEntry]
  onClose: () => void
}

export function ComparisonChart({ entries, onClose }: ComparisonChartProps) {
  const [entryA, entryB] = entries

  const data = [
    {
      name: "Bugs",
      "Scenario A": entryA.bugs,
      "Scenario B": entryB.bugs,
    },
    {
      name: "Coverage",
      "Scenario A": entryA.coverage,
      "Scenario B": entryB.coverage,
    },
    {
      name: "Complexity",
      "Scenario A": entryA.complexity * 10,
      "Scenario B": entryB.complexity * 10,
    },
    {
      name: "Score",
      "Scenario A": entryA.score,
      "Scenario B": entryB.score,
    },
  ]

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-lg">Scenario Comparison</CardTitle>
          <CardDescription>
            Comparing {new Date(entryA.timestamp).toLocaleTimeString()} vs {new Date(entryB.timestamp).toLocaleTimeString()}
          </CardDescription>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                  fontSize: 12,
                }}
              />
              <Legend />
              <Bar dataKey="Scenario A" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Scenario B" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div className="rounded-lg border p-3">
            <p className="font-medium mb-1">Scenario A</p>
            <p className="text-muted-foreground">
              Risk: <span className="font-medium">{entryA.risk}</span> | Score: <span className="font-medium">{entryA.score}</span>
            </p>
          </div>
          <div className="rounded-lg border p-3">
            <p className="font-medium mb-1">Scenario B</p>
            <p className="text-muted-foreground">
              Risk: <span className="font-medium">{entryB.risk}</span> | Score: <span className="font-medium">{entryB.score}</span>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
