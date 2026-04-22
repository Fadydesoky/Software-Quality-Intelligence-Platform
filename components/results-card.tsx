"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, CheckCircle2, AlertCircle, Shield, TrendingUp, Bug, Code2, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import type { PredictionResult } from "@/lib/prediction"
import { getRiskColor, getBadgeVariant } from "@/lib/prediction"
import { ScoreGauge } from "./score-gauge"

interface ResultsCardProps {
  result: PredictionResult | null
  previousScore?: number
}

export function ResultsCard({ result, previousScore }: ResultsCardProps) {
  if (!result) {
    return (
      <Card className="border-border/50 border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-20 text-center">
          <div className="relative">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-muted/80 to-muted/30">
              <Shield className="h-10 w-10 text-muted-foreground/30" />
            </div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-muted/0 to-muted/0 animate-pulse" />
          </div>
          <p className="mt-6 text-sm font-medium text-muted-foreground">
            Enter metrics and click Predict
          </p>
          <p className="mt-1 text-xs text-muted-foreground/60">
            Results will appear here
          </p>
        </CardContent>
      </Card>
    )
  }

  const { label: badgeLabel, variant: badgeVariant } = getBadgeVariant(result.score)
  const RiskIcon = result.risk === "High" ? AlertTriangle : result.risk === "Medium" ? AlertCircle : CheckCircle2

  return (
    <div className="space-y-5">
      {/* Main Score Card with Gauge */}
      <Card className={cn(
        "overflow-hidden border-border/50",
        "bg-gradient-to-br from-card via-card to-muted/20"
      )}>
        <CardContent className="py-8">
          <ScoreGauge
            score={result.score}
            previousScore={previousScore}
            risk={result.risk}
            confidence={result.confidence}
            confidenceLevel={result.confidenceLevel}
            size="md"
          />
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { 
            icon: Bug, 
            label: "Bug Density", 
            value: result.metrics.bugDensity,
            status: result.breakdown.bugDensity.status,
          },
          { 
            icon: TrendingUp, 
            label: "Productivity", 
            value: result.metrics.productivity,
            suffix: "c/dev",
            status: "good" as const,
          },
          { 
            icon: Code2, 
            label: "Complexity", 
            value: `${result.metrics.complexity}`,
            suffix: "/10",
            status: result.breakdown.complexity.status,
          },
          { 
            icon: Users, 
            label: "Coverage", 
            value: `${result.metrics.coverage}`,
            suffix: "%",
            status: result.breakdown.coverage.status,
          },
        ].map(({ icon: Icon, label, value, suffix, status }) => (
          <Card 
            key={label} 
            className={cn(
              "border-border/50 transition-all hover:border-border hover:shadow-sm",
              "group"
            )}
          >
            <CardContent className="flex items-center gap-3 py-4">
              <div className={cn(
                "flex h-9 w-9 items-center justify-center rounded-lg transition-colors",
                status === "good" && "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
                status === "warning" && "bg-amber-500/10 text-amber-600 dark:text-amber-400",
                status === "bad" && "bg-red-500/10 text-red-600 dark:text-red-400"
              )}>
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
                <p className="text-base font-bold tabular-nums">
                  {value}
                  {suffix && <span className="text-xs font-normal text-muted-foreground">{suffix}</span>}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Areas for Improvement */}
      {result.reasons.length > 0 && (
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Areas for Improvement</CardTitle>
              <Badge variant="outline" className="text-[10px] font-medium">
                {result.reasons.length} {result.reasons.length === 1 ? "issue" : "issues"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <ul className="space-y-3">
              {result.reasons.map((reason, index) => (
                <li 
                  key={index} 
                  className={cn(
                    "flex items-start gap-3 rounded-lg p-3 transition-colors",
                    "bg-amber-500/5 border border-amber-500/10"
                  )}
                >
                  <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                  <span className="text-sm text-foreground/80">{reason}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {result.reasons.length === 0 && (
        <Card className="border-emerald-500/20 bg-emerald-500/5">
          <CardContent className="flex items-center gap-4 py-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                All metrics are healthy
              </p>
              <p className="text-xs text-emerald-600/70 dark:text-emerald-400/70">
                No immediate actions required
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
