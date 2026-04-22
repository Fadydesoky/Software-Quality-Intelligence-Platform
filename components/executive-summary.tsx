"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, CheckCircle2, TrendingUp, Target, ArrowRight, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import type { PredictionResult } from "@/lib/prediction"

interface ExecutiveSummaryProps {
  result: PredictionResult
  inputValues: {
    commits: number
    bugs: number
    complexity: number
    developers: number
    coverage: number
  }
}

// Generate the main issue and suggested fix
function generateSummaryContent(
  result: PredictionResult,
  inputValues: ExecutiveSummaryProps["inputValues"]
): {
  mainIssue: string | null
  suggestedFix: string | null
  improvementTarget: string | null
} {
  const { breakdown, metrics } = result
  
  // Find worst performing metric
  const factors = [
    { name: "bug density", status: breakdown.bugDensity.status, value: breakdown.bugDensity.value, contribution: breakdown.bugDensity.contribution, max: breakdown.bugDensity.maxContribution },
    { name: "complexity", status: breakdown.complexity.status, value: breakdown.complexity.value, contribution: breakdown.complexity.contribution, max: breakdown.complexity.maxContribution },
    { name: "coverage", status: breakdown.coverage.status, value: breakdown.coverage.value, contribution: breakdown.coverage.contribution, max: breakdown.coverage.maxContribution },
  ]
  
  const worstFactor = factors.sort((a, b) => (a.contribution / a.max) - (b.contribution / b.max))[0]
  
  if (worstFactor.status === "good") {
    return {
      mainIssue: null,
      suggestedFix: null,
      improvementTarget: null,
    }
  }
  
  let mainIssue = ""
  let suggestedFix = ""
  let improvementTarget = ""
  
  if (worstFactor.name === "bug density" && metrics.bugDensity > 0.25) {
    mainIssue = `High bug density (${metrics.bugDensity.toFixed(2)} bugs/commit)`
    const targetBugs = Math.round(inputValues.bugs * 0.6)
    suggestedFix = `Reduce bugs from ${inputValues.bugs} to ${targetBugs}`
    improvementTarget = "+12-15 points"
  } else if (worstFactor.name === "coverage" && inputValues.coverage < 70) {
    mainIssue = `Low test coverage (${inputValues.coverage}%)`
    const targetCoverage = Math.min(inputValues.coverage + 20, 80)
    suggestedFix = `Increase coverage to ${targetCoverage}%`
    improvementTarget = `+${Math.round((targetCoverage - inputValues.coverage) * 0.33)} points`
  } else if (worstFactor.name === "complexity" && inputValues.complexity > 7) {
    mainIssue = `High code complexity (${inputValues.complexity}/10)`
    const targetComplexity = Math.max(inputValues.complexity - 2, 5)
    suggestedFix = `Refactor to reduce complexity to ${targetComplexity}/10`
    improvementTarget = `+${(inputValues.complexity - targetComplexity) * 3} points`
  } else if (worstFactor.status === "warning") {
    mainIssue = `${worstFactor.name.charAt(0).toUpperCase() + worstFactor.name.slice(1)} needs attention`
    suggestedFix = "Monitor and improve this metric"
    improvementTarget = "+5-10 points"
  }
  
  return { mainIssue, suggestedFix, improvementTarget }
}

export function ExecutiveSummary({ result, inputValues }: ExecutiveSummaryProps) {
  const [isVisible, setIsVisible] = React.useState(false)
  const { mainIssue, suggestedFix, improvementTarget } = generateSummaryContent(result, inputValues)
  
  React.useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50)
    return () => clearTimeout(timer)
  }, [])

  const isHealthy = result.risk === "Low" && !mainIssue
  const StatusIcon = isHealthy ? CheckCircle2 : AlertTriangle

  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-500 border-2",
      isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
      isHealthy 
        ? "border-emerald-500/30 bg-gradient-to-br from-emerald-500/5 to-transparent" 
        : result.risk === "High"
        ? "border-red-500/30 bg-gradient-to-br from-red-500/5 to-transparent"
        : "border-amber-500/30 bg-gradient-to-br from-amber-500/5 to-transparent"
    )}>
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          {/* Status Icon */}
          <div className={cn(
            "flex h-12 w-12 items-center justify-center rounded-xl shrink-0 transition-transform duration-300",
            isHealthy 
              ? "bg-emerald-500/10" 
              : result.risk === "High"
              ? "bg-red-500/10"
              : "bg-amber-500/10"
          )}>
            <StatusIcon className={cn(
              "h-6 w-6",
              isHealthy 
                ? "text-emerald-600 dark:text-emerald-400" 
                : result.risk === "High"
                ? "text-red-600 dark:text-red-400"
                : "text-amber-600 dark:text-amber-400"
            )} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Header with badges */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                Executive Summary
              </span>
              <Badge 
                variant="outline" 
                className={cn(
                  "text-[10px] font-semibold",
                  isHealthy 
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30" 
                    : result.risk === "High"
                    ? "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30"
                    : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30"
                )}
              >
                {result.risk} Risk
              </Badge>
            </div>

            {/* Score and Risk Row */}
            <div className="mt-3 flex items-center gap-6">
              <div>
                <div className="text-3xl font-bold tabular-nums">{result.score}</div>
                <div className="text-xs text-muted-foreground">Quality Score</div>
              </div>
              
              {mainIssue && (
                <div className="h-10 w-px bg-border/50" />
              )}
              
              {mainIssue && (
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <AlertTriangle className={cn(
                      "h-3.5 w-3.5 shrink-0",
                      result.risk === "High" 
                        ? "text-red-500" 
                        : "text-amber-500"
                    )} />
                    <span className="text-sm font-medium truncate">{mainIssue}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Suggested Fix */}
            {suggestedFix && (
              <div className="mt-4 flex items-center gap-3 rounded-lg bg-muted/50 px-3 py-2.5 border border-border/50">
                <Target className="h-4 w-4 text-primary shrink-0" />
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium">{suggestedFix}</span>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                <div className="flex items-center gap-1 shrink-0">
                  <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                  <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                    {improvementTarget}
                  </span>
                </div>
              </div>
            )}

            {/* Healthy state message */}
            {isHealthy && (
              <div className="mt-4 flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
                <span className="font-medium">All systems healthy. Continue maintaining these metrics.</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
