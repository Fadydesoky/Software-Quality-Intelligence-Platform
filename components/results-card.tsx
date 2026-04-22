"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, CheckCircle2, AlertCircle, Shield, TrendingUp, Bug, Code2, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import type { PredictionResult } from "@/lib/prediction"
import { getRiskColor, getRiskBorderColor, getRiskBgColor, getBadgeVariant } from "@/lib/prediction"

interface ResultsCardProps {
  result: PredictionResult | null
}

export function ResultsCard({ result }: ResultsCardProps) {
  const [animatedScore, setAnimatedScore] = React.useState(0)

  React.useEffect(() => {
    if (result) {
      setAnimatedScore(0)
      const timer = setTimeout(() => {
        setAnimatedScore(result.score)
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [result])

  if (!result) {
    return (
      <Card className="h-fit">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <Shield className="h-12 w-12 text-muted-foreground/50 mb-4" />
          <p className="text-muted-foreground">
            Enter metrics and click Predict to see results
          </p>
        </CardContent>
      </Card>
    )
  }

  const { label: badgeLabel, variant: badgeVariant } = getBadgeVariant(result.score)

  const RiskIcon = result.risk === "High" ? AlertTriangle : result.risk === "Medium" ? AlertCircle : CheckCircle2

  return (
    <div className="space-y-4">
      {/* Risk Card */}
      <Card className={cn("border-l-4 transition-all duration-300", getRiskBorderColor(result.risk), getRiskBgColor(result.risk))}>
        <CardContent className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <RiskIcon className={cn("h-6 w-6", getRiskColor(result.risk))} />
            <div>
              <p className="text-sm text-muted-foreground">Risk Level</p>
              <p className={cn("text-2xl font-bold", getRiskColor(result.risk))}>
                {result.risk}
              </p>
            </div>
          </div>
          <Badge variant={badgeVariant}>{badgeLabel}</Badge>
        </CardContent>
      </Card>

      {/* Score Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Quality Score</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-bold tabular-nums">{animatedScore}</span>
            <span className="text-2xl text-muted-foreground">/100</span>
          </div>
          <Progress 
            value={animatedScore} 
            className="h-3 transition-all duration-700"
          />
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Confidence</span>
            <span className="font-medium">{result.confidence}%</span>
          </div>
        </CardContent>
      </Card>

      {/* Metrics Grid */}
      <div className="grid gap-3 sm:grid-cols-2">
        <Card>
          <CardContent className="flex items-center gap-3 py-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
              <Bug className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Bug Density</p>
              <p className="text-lg font-semibold tabular-nums">{result.metrics.bugDensity}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 py-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
              <TrendingUp className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Productivity</p>
              <p className="text-lg font-semibold tabular-nums">{result.metrics.productivity}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 py-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
              <Code2 className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Complexity</p>
              <p className="text-lg font-semibold tabular-nums">{result.metrics.complexity}/10</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 py-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
              <Users className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Coverage</p>
              <p className="text-lg font-semibold tabular-nums">{result.metrics.coverage}%</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reasons */}
      {result.reasons.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Areas for Improvement</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {result.reasons.map((reason, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {result.reasons.length === 0 && (
        <Card className="border-emerald-500/20 bg-emerald-500/5">
          <CardContent className="flex items-center gap-3 py-4">
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            <p className="text-sm">All metrics are within healthy ranges. Great job!</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
