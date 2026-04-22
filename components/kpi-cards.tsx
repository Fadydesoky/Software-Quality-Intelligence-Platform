"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Minus, BarChart3, Target, AlertTriangle } from "lucide-react"
import type { HistoryEntry } from "@/lib/prediction"

interface KPICardsProps {
  history: HistoryEntry[]
}

export function KPICards({ history }: KPICardsProps) {
  if (history.length === 0) {
    return null
  }

  const scores = history.map(h => h.score)
  const avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
  const bestScore = Math.max(...scores)
  const worstScore = Math.min(...scores)

  // Calculate trend (compare last 3 to previous 3)
  let trend: "up" | "down" | "stable" = "stable"
  if (history.length >= 4) {
    const recentAvg = scores.slice(-3).reduce((a, b) => a + b, 0) / 3
    const previousAvg = scores.slice(-6, -3).reduce((a, b) => a + b, 0) / Math.min(3, scores.slice(-6, -3).length)
    if (recentAvg > previousAvg + 2) trend = "up"
    else if (recentAvg < previousAvg - 2) trend = "down"
  }

  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardContent className="flex items-center gap-4 py-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            <BarChart3 className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Average Score</p>
            <p className="text-2xl font-bold tabular-nums">{avgScore}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center gap-4 py-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500/10">
            <Target className="h-6 w-6 text-emerald-500" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Best Score</p>
            <p className="text-2xl font-bold tabular-nums">{bestScore}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center gap-4 py-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-500/10">
            <AlertTriangle className="h-6 w-6 text-red-500" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Worst Score</p>
            <p className="text-2xl font-bold tabular-nums">{worstScore}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center gap-4 py-4">
          <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${
            trend === "up" ? "bg-emerald-500/10" : trend === "down" ? "bg-red-500/10" : "bg-muted"
          }`}>
            <TrendIcon className={`h-6 w-6 ${
              trend === "up" ? "text-emerald-500" : trend === "down" ? "text-red-500" : "text-muted-foreground"
            }`} />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Trend</p>
            <p className="text-2xl font-bold capitalize">{trend}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
