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
      const duration = 600
      const steps = 30
      const increment = result.score / steps
      let current = 0
      
      const timer = setInterval(() => {
        current += increment
        if (current >= result.score) {
          setAnimatedScore(result.score)
          clearInterval(timer)
        } else {
          setAnimatedScore(Math.round(current))
        }
      }, duration / steps)
      
      return () => clearInterval(timer)
    }
  }, [result])

  if (!result) {
    return (
      <Card className="border-border/50 border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-20 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted/50">
            <Shield className="h-8 w-8 text-muted-foreground/40" />
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Enter metrics and click Predict to see results
          </p>
        </CardContent>
      </Card>
    )
  }

  const { label: badgeLabel, variant: badgeVariant } = getBadgeVariant(result.score)
  const RiskIcon = result.risk === "High" ? AlertTriangle : result.risk === "Medium" ? AlertCircle : CheckCircle2

  return (
    <div className="space-y-5">
      {/* Main Score Card */}
      <Card className={cn(
        "border-l-4 transition-all duration-500",
        getRiskBorderColor(result.risk),
        getRiskBgColor(result.risk)
      )}>
        <CardContent className="py-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className={cn(
                "flex h-12 w-12 items-center justify-center rounded-xl",
                result.risk === "High" ? "bg-red-500/10" :
                result.risk === "Medium" ? "bg-amber-500/10" : "bg-emerald-500/10"
              )}>
                <RiskIcon className={cn("h-6 w-6", getRiskColor(result.risk))} />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Risk Level</p>
                <p className={cn("text-2xl font-bold tracking-tight", getRiskColor(result.risk))}>
                  {result.risk}
                </p>
              </div>
            </div>
            <Badge variant={badgeVariant} className="text-xs">{badgeLabel}</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Score Display */}
      <Card className="border-border/50">
        <CardContent className="py-8">
          <div className="text-center">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Quality Score</p>
            <div className="mt-3 flex items-baseline justify-center gap-1">
              <span className="text-6xl font-bold tabular-nums tracking-tighter animate-number">
                {animatedScore}
              </span>
              <span className="text-2xl text-muted-foreground/60">/100</span>
            </div>
          </div>
          <div className="mt-6">
            <Progress 
              value={animatedScore} 
              className="h-2"
            />
          </div>
          <div className="mt-4 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Confidence</span>
            <span className="font-medium">{result.confidence}%</span>
          </div>
        </CardContent>
      </Card>

      {/* Metrics Grid */}
      <div className="grid gap-3 sm:grid-cols-2">
        {[
          { icon: Bug, label: "Bug Density", value: result.metrics.bugDensity },
          { icon: TrendingUp, label: "Productivity", value: result.metrics.productivity },
          { icon: Code2, label: "Complexity", value: `${result.metrics.complexity}/10` },
          { icon: Users, label: "Coverage", value: `${result.metrics.coverage}%` },
        ].map(({ icon: Icon, label, value }) => (
          <Card key={label} className="border-border/50">
            <CardContent className="flex items-center gap-4 py-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted/50">
                <Icon className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
                <p className="text-lg font-semibold tabular-nums">{value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Reasons */}
      {result.reasons.length > 0 && (
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Areas for Improvement</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ul className="space-y-2.5">
              {result.reasons.map((reason, index) => (
                <li key={index} className="flex items-start gap-3 text-sm">
                  <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                  <span className="text-muted-foreground">{reason}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {result.reasons.length === 0 && (
        <Card className="border-emerald-500/20 bg-emerald-500/5">
          <CardContent className="flex items-center gap-3 py-4">
            <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
            <p className="text-sm text-emerald-600 dark:text-emerald-400">All metrics are within healthy ranges</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
