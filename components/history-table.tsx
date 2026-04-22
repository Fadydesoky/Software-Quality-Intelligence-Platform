"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Trash2, GitCompare, History } from "lucide-react"
import { cn } from "@/lib/utils"
import type { HistoryEntry } from "@/lib/prediction"

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
      <Card className="border-border/50 border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted/50">
            <History className="h-7 w-7 text-muted-foreground/40" />
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            No predictions yet
          </p>
          <p className="mt-1 text-xs text-muted-foreground/60">
            Run your first analysis to see results here
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border/50">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle className="text-base font-semibold">Prediction History</CardTitle>
          <p className="mt-1 text-xs text-muted-foreground">
            {history.length} prediction{history.length !== 1 ? "s" : ""} recorded
          </p>
        </div>
        <div className="flex items-center gap-2">
          {selectedIds.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => canCompare && onCompare(selectedIds as [string, string])}
              disabled={!canCompare}
              className="h-8 text-xs"
            >
              <GitCompare className="h-3.5 w-3.5 mr-1.5" />
              Compare ({selectedIds.length}/2)
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={exportCSV} className="h-8 text-xs">
            <Download className="h-3.5 w-3.5 mr-1.5" />
            Export
          </Button>
          <Button variant="outline" size="sm" onClick={onClear} className="h-8 text-xs text-muted-foreground hover:text-destructive">
            <Trash2 className="h-3.5 w-3.5 mr-1.5" />
            Clear
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="rounded-lg border border-border/50 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="w-10"></TableHead>
                <TableHead className="text-xs font-medium">Time</TableHead>
                <TableHead className="text-xs font-medium text-right">Commits</TableHead>
                <TableHead className="text-xs font-medium text-right">Bugs</TableHead>
                <TableHead className="text-xs font-medium text-right">Complexity</TableHead>
                <TableHead className="text-xs font-medium text-right">Devs</TableHead>
                <TableHead className="text-xs font-medium text-right">Coverage</TableHead>
                <TableHead className="text-xs font-medium">Risk</TableHead>
                <TableHead className="text-xs font-medium text-right">Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map((entry) => (
                <TableRow 
                  key={entry.id} 
                  className={cn(
                    "cursor-pointer transition-colors",
                    selectedIds.includes(entry.id) && "bg-muted/50"
                  )}
                  onClick={() => onSelect(entry.id)}
                >
                  <TableCell className="py-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(entry.id)}
                      onChange={() => onSelect(entry.id)}
                      className="h-4 w-4 rounded border-border accent-primary"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </TableCell>
                  <TableCell className="py-3 whitespace-nowrap text-xs text-muted-foreground">
                    {new Date(entry.timestamp).toLocaleString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </TableCell>
                  <TableCell className="py-3 text-right text-xs tabular-nums">{entry.commits}</TableCell>
                  <TableCell className="py-3 text-right text-xs tabular-nums">{entry.bugs}</TableCell>
                  <TableCell className="py-3 text-right text-xs tabular-nums">{entry.complexity}</TableCell>
                  <TableCell className="py-3 text-right text-xs tabular-nums">{entry.developers}</TableCell>
                  <TableCell className="py-3 text-right text-xs tabular-nums">{entry.coverage}%</TableCell>
                  <TableCell className="py-3">
                    <Badge 
                      variant={entry.risk === "High" ? "destructive" : "secondary"}
                      className={cn(
                        "text-[10px] font-medium px-1.5 py-0",
                        entry.risk === "Low" && "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20",
                        entry.risk === "Medium" && "bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20"
                      )}
                    >
                      {entry.risk}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-3 text-right text-xs tabular-nums font-semibold">{entry.score}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
