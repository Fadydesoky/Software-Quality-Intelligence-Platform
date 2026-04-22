"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, Sparkles, AlertTriangle, TrendingUp, Target, Zap } from "lucide-react"
import { cn } from "@/lib/utils"
import type { PredictionResult, ScoreBreakdown } from "@/lib/prediction"

interface AIInsightsPanelProps {
  result: PredictionResult
  inputValues: {
    commits: number
    bugs: number
    complexity: number
    developers: number
    coverage: number
  }
}

// Generate human-readable AI insight based on the prediction
function generateAIInsight(
  result: PredictionResult,
  inputValues: AIInsightsPanelProps["inputValues"]
): string {
  const { risk, score, breakdown, metrics } = result
  
  // Find the dominant factor (worst performing metric)
  const factors = [
    { name: "bug density", contribution: breakdown.bugDensity.contribution, max: breakdown.bugDensity.maxContribution, status: breakdown.bugDensity.status, percentage: Math.round((breakdown.bugDensity.contribution / breakdown.bugDensity.maxContribution) * 100) },
    { name: "code complexity", contribution: breakdown.complexity.contribution, max: breakdown.complexity.maxContribution, status: breakdown.complexity.status, percentage: Math.round((breakdown.complexity.contribution / breakdown.complexity.maxContribution) * 100) },
    { name: "test coverage", contribution: breakdown.coverage.contribution, max: breakdown.coverage.maxContribution, status: breakdown.coverage.status, percentage: Math.round((breakdown.coverage.contribution / breakdown.coverage.maxContribution) * 100) },
  ]
  
  // Sort to find primary driver (lowest percentage = worst performing)
  const sortedFactors = [...factors].sort((a, b) => a.percentage - b.percentage)
  const primaryDriver = sortedFactors[0]
  const secondaryDriver = sortedFactors[1]
  
  // Calculate contribution percentages for the insight text
  const totalContribution = factors.reduce((sum, f) => sum + f.contribution, 0)
  const primaryContribPercentage = Math.round((primaryDriver.contribution / totalContribution) * 100)
  const secondaryContribPercentage = Math.round((secondaryDriver.contribution / totalContribution) * 100)
  
  // Build the insight message
  let insight = `Your system is currently at **${risk} risk** with a quality score of **${score}/100**. `
  
  if (primaryDriver.status === "bad") {
    insight += `The main contributing factor is **${primaryDriver.name}** (${primaryContribPercentage}% of score impact), which is performing below optimal levels. `
  } else if (primaryDriver.status === "warning") {
    insight += `The primary area requiring attention is **${primaryDriver.name}** (${primaryContribPercentage}% of score impact), followed by ${secondaryDriver.name}. `
  } else {
    insight += `All metrics are performing well. `
  }
  
  // Add specific improvement suggestion
  if (inputValues.coverage < 80 && breakdown.coverage.status !== "good") {
    const targetCoverage = Math.min(inputValues.coverage + 15, 85)
    insight += `Improving test coverage from ${inputValues.coverage}% to ${targetCoverage}% will likely reduce risk significantly.`
  } else if (metrics.bugDensity > 0.25) {
    const targetBugs = Math.round(inputValues.bugs * 0.7)
    insight += `Reducing bugs from ${inputValues.bugs} to ${targetBugs} could move you to a lower risk category.`
  } else if (inputValues.complexity > 6) {
    insight += `Reducing code complexity through refactoring will improve maintainability and score.`
  } else {
    insight += `Continue maintaining these healthy metrics to sustain low risk.`
  }
  
  return insight
}

// Find the dominant risk factor
function findDominantFactor(breakdown: ScoreBreakdown): {
  name: string
  percentage: number
  status: "good" | "warning" | "bad"
  icon: React.ElementType
  improvement: string
} {
  const factors = [
    { 
      name: "Bug Density", 
      contribution: breakdown.bugDensity.contribution, 
      max: breakdown.bugDensity.maxContribution, 
      status: breakdown.bugDensity.status,
      icon: AlertTriangle,
      improvement: "Reduce bug count or increase commits"
    },
    { 
      name: "Complexity", 
      contribution: breakdown.complexity.contribution, 
      max: breakdown.complexity.maxContribution, 
      status: breakdown.complexity.status,
      icon: Zap,
      improvement: "Refactor complex code modules"
    },
    { 
      name: "Coverage", 
      contribution: breakdown.coverage.contribution, 
      max: breakdown.coverage.maxContribution, 
      status: breakdown.coverage.status,
      icon: Target,
      improvement: "Add more test coverage"
    },
  ]
  
  // Sort to find worst performing (lowest contribution percentage)
  const sorted = [...factors].sort((a, b) => 
    (a.contribution / a.max) - (b.contribution / b.max)
  )
  
  const worst = sorted[0]
  const totalContribution = factors.reduce((sum, f) => sum + f.contribution, 0)
  
  return {
    name: worst.name,
    percentage: Math.round((worst.contribution / totalContribution) * 100),
    status: worst.status,
    icon: worst.icon,
    improvement: worst.improvement,
  }
}

// Calculate sensitivity of each metric
function calculateSensitivity(breakdown: ScoreBreakdown): Array<{
  name: string
  sensitivity: "High" | "Medium" | "Low"
  impact: number
  description: string
}> {
  // Higher max contribution = more sensitive
  // Status also affects perceived sensitivity
  return [
    {
      name: "Bug Density",
      sensitivity: breakdown.bugDensity.maxContribution >= 35 ? "High" : breakdown.bugDensity.maxContribution >= 20 ? "Medium" : "Low",
      impact: breakdown.bugDensity.maxContribution,
      description: "40 pts max impact",
    },
    {
      name: "Coverage",
      sensitivity: breakdown.coverage.status === "bad" ? "High" : breakdown.coverage.status === "warning" ? "Medium" : "Low",
      impact: breakdown.coverage.maxContribution,
      description: "33 pts max impact",
    },
    {
      name: "Complexity",
      sensitivity: breakdown.complexity.status === "bad" ? "High" : "Medium",
      impact: breakdown.complexity.maxContribution,
      description: "30 pts max impact",
    },
  ]
}

export function AIInsightsPanel({ result, inputValues }: AIInsightsPanelProps) {
  const [isVisible, setIsVisible] = React.useState(false)
  const insight = generateAIInsight(result, inputValues)
  const dominantFactor = findDominantFactor(result.breakdown)
  const sensitivities = calculateSensitivity(result.breakdown)
  
  React.useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const DominantIcon = dominantFactor.icon

  return (
    <Card className={cn(
      "border-border/50 overflow-hidden transition-all duration-500",
      isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
    )}>
      <CardHeader className="pb-4 border-b border-border/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5">
                <Brain className="h-5 w-5 text-primary" />
              </div>
              <div className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary">
                <Sparkles className="h-2.5 w-2.5 text-primary-foreground" />
              </div>
            </div>
            <div>
              <CardTitle className="text-sm font-semibold">AI Insight Analysis</CardTitle>
              <p className="text-xs text-muted-foreground">Intelligent system assessment</p>
            </div>
          </div>
          <Badge variant="outline" className="text-[10px] font-medium bg-primary/5 text-primary border-primary/20">
            AI-Powered
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-5 space-y-6">
        {/* Main AI Insight Paragraph */}
        <div className="relative rounded-lg bg-gradient-to-br from-muted/50 to-muted/20 p-4 border border-border/50">
          <div className="absolute -left-px top-4 h-12 w-1 rounded-full bg-primary" />
          <p className="text-sm leading-relaxed text-foreground/90 pl-3">
            {insight.split("**").map((part, index) => 
              index % 2 === 1 ? (
                <span key={index} className="font-semibold text-foreground">{part}</span>
              ) : (
                <span key={index}>{part}</span>
              )
            )}
          </p>
        </div>

        {/* Primary Risk Driver */}
        {dominantFactor.status !== "good" && (
          <div className={cn(
            "rounded-lg p-4 border-l-4 transition-all duration-300",
            dominantFactor.status === "bad" 
              ? "bg-red-500/5 border-l-red-500" 
              : "bg-amber-500/5 border-l-amber-500"
          )}>
            <div className="flex items-start gap-3">
              <div className={cn(
                "flex h-8 w-8 items-center justify-center rounded-lg shrink-0",
                dominantFactor.status === "bad" 
                  ? "bg-red-500/10 text-red-600 dark:text-red-400" 
                  : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
              )}>
                <DominantIcon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Primary Risk Driver
                  </span>
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "text-[10px] font-medium",
                      dominantFactor.status === "bad" 
                        ? "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30" 
                        : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30"
                    )}
                  >
                    {dominantFactor.status === "bad" ? "Critical" : "Warning"}
                  </Badge>
                </div>
                <p className="mt-1 text-sm font-semibold">{dominantFactor.name}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{dominantFactor.improvement}</p>
              </div>
              <div className="text-right shrink-0">
                <div className="text-lg font-bold tabular-nums">{dominantFactor.percentage}%</div>
                <div className="text-[10px] text-muted-foreground">of impact</div>
              </div>
            </div>
          </div>
        )}

        {/* Score Sensitivity Indicators */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Score Sensitivity
            </span>
            <span className="text-[10px] text-muted-foreground">Impact on total score</span>
          </div>
          <div className="grid gap-2">
            {sensitivities.map((item, index) => (
              <div 
                key={item.name}
                className={cn(
                  "flex items-center justify-between rounded-lg border border-border/50 px-3 py-2.5 transition-all duration-300",
                  "hover:bg-muted/50 hover:border-border"
                )}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">{item.name}</span>
                  <span className="text-[10px] text-muted-foreground">{item.description}</span>
                </div>
                <Badge 
                  variant="outline" 
                  className={cn(
                    "text-[10px] font-semibold",
                    item.sensitivity === "High" 
                      ? "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30" 
                      : item.sensitivity === "Medium"
                      ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30"
                      : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                  )}
                >
                  {item.sensitivity} Impact
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
