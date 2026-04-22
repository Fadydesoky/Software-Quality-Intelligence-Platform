"use client"

import * as React from "react"
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

  let trend: "up" | "down" | "stable" = "stable"
  if (history.length >= 4) {
    const recentAvg = scores.slice(-3).reduce((a, b) => a + b, 0) / 3
    const previousAvg = scores.slice(-6, -3).reduce((a, b) => a + b, 0) / Math.min(3, scores.slice(-6, -3).length)
    if (recentAvg > previousAvg + 2) trend = "up"
    else if (recentAvg < previousAvg - 2) trend = "down"
  }

  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus

  const kpis = [
    {
      icon: BarChart3,
      label: "Average Score",
      value: avgScore,
      color: "text-foreground",
      bg: "bg-muted/50",
    },
    {
      icon: Target,
      label: "Best Score",
      value: bestScore,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    {
      icon: AlertTriangle,
      label: "Worst Score",
      value: worstScore,
      color: "text-red-600 dark:text-red-400",
      bg: "bg-red-500/10",
    },
    {
      icon: TrendIcon,
      label: "Trend",
      value: trend.charAt(0).toUpperCase() + trend.slice(1),
      color: trend === "up" ? "text-emerald-600 dark:text-emerald-400" : trend === "down" ? "text-red-600 dark:text-red-400" : "text-muted-foreground",
      bg: trend === "up" ? "bg-emerald-500/10" : trend === "down" ? "bg-red-500/10" : "bg-muted/50",
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {kpis.map(({ icon: Icon, label, value, color, bg }, index) => (
        <div
          key={label}
          className="group flex items-center gap-4 rounded-xl border border-border/50 bg-card p-4 transition-all hover:border-border hover:shadow-sm"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <div className={`flex h-11 w-11 items-center justify-center rounded-lg ${bg} transition-transform group-hover:scale-105`}>
            <Icon className={`h-5 w-5 ${color}`} />
          </div>
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
            <p className={`text-xl font-bold tabular-nums ${typeof value === 'number' ? '' : color}`}>{value}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
