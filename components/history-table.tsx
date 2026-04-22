"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Trash2, GitCompare } from "lucide-react"
import { cn } from "@/lib/utils"
import type { HistoryEntry } from "@/lib/prediction"
import { getRiskColor } from "@/lib/prediction"

interface HistoryTableProps {
  history: HistoryEntry[]
  onClear: () => void
  onCompare: (ids: [string, string]) => void
  selectedIds: string[]
  onSelect: (id: string) => void
}

export function HistoryTable({ history, onClear, onCompare, selectedIds, onSelect }: HistoryTableProps) {
  const exportCSV = () => {
    const headers = ["Timestamp", "Commits", "Bugs", "Complexity", "Developers", "Coverage", "Risk", "Score"]
    const rows = history.map(entry => [
      new Date(entry.timestamp).toISOString(),
      entry.commits,
      entry.bugs,
      entry.complexity,
      entry.developers,
      entry.coverage,
      entry.risk,
      entry.score,
    ])
    
    const csv = [headers.join(","), ...rows.map(row => row.join(","))].join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `quality-predictions-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const canCompare = selectedIds.length === 2

  if (history.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Prediction History</CardTitle>
          <CardDescription>
            Your prediction history will appear here
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            No predictions yet. Run your first analysis to see results here.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle className="text-lg">Prediction History</CardTitle>
          <CardDescription>
            {history.length} prediction{history.length !== 1 ? "s" : ""} recorded
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          {selectedIds.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => canCompare && onCompare(selectedIds as [string, string])}
              disabled={!canCompare}
            >
              <GitCompare className="h-4 w-4 mr-2" />
              Compare ({selectedIds.length}/2)
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={exportCSV}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="outline" size="sm" onClick={onClear}>
            <Trash2 className="h-4 w-4 mr-2" />
            Clear
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10"></TableHead>
                <TableHead>Time</TableHead>
                <TableHead className="text-right">Commits</TableHead>
                <TableHead className="text-right">Bugs</TableHead>
                <TableHead className="text-right">Complexity</TableHead>
                <TableHead className="text-right">Developers</TableHead>
                <TableHead className="text-right">Coverage</TableHead>
                <TableHead>Risk</TableHead>
                <TableHead className="text-right">Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map((entry) => (
                <TableRow 
                  key={entry.id} 
                  className={cn(
                    "cursor-pointer transition-colors",
                    selectedIds.includes(entry.id) && "bg-muted"
                  )}
                  onClick={() => onSelect(entry.id)}
                >
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(entry.id)}
                      onChange={() => onSelect(entry.id)}
                      className="h-4 w-4 rounded border-muted-foreground"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-sm">
                    {new Date(entry.timestamp).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">{entry.commits}</TableCell>
                  <TableCell className="text-right tabular-nums">{entry.bugs}</TableCell>
                  <TableCell className="text-right tabular-nums">{entry.complexity}</TableCell>
                  <TableCell className="text-right tabular-nums">{entry.developers}</TableCell>
                  <TableCell className="text-right tabular-nums">{entry.coverage}%</TableCell>
                  <TableCell>
                    <Badge 
                      variant={entry.risk === "High" ? "destructive" : entry.risk === "Medium" ? "secondary" : "default"}
                      className={cn("font-medium", getRiskColor(entry.risk))}
                    >
                      {entry.risk}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right tabular-nums font-medium">{entry.score}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
