export interface PredictionInput {
  commits: number
  bugs: number
  complexity: number
  developers: number
  coverage: number
}

export interface PredictionResult {
  risk: "High" | "Medium" | "Low"
  score: number
  reasons: string[]
  metrics: {
    bugDensity: number
    productivity: number
    bugs: number
    coverage: number
    complexity: number
  }
  confidence: number
}

export interface HistoryEntry extends PredictionInput {
  id: string
  timestamp: number
  risk: "High" | "Medium" | "Low"
  score: number
}

export function predictQuality(input: PredictionInput): PredictionResult {
  const { commits, bugs, complexity, developers, coverage } = input

  // Calculate derived metrics
  const bugDensity = commits > 0 ? bugs / commits : 1
  const productivity = developers > 0 ? commits / developers : 0

  // Calculate score components
  const bugDensityScore = (1 - Math.min(bugDensity, 1)) * 40
  const complexityScore = (10 - complexity) * 3
  const coverageScore = coverage * 0.33

  // Calculate total score (clamped 0-100)
  let score = bugDensityScore + complexityScore + coverageScore
  score = Math.max(0, Math.min(100, Math.round(score)))

  // Determine risk level
  let risk: "High" | "Medium" | "Low"
  if (score < 50) {
    risk = "High"
  } else if (score < 75) {
    risk = "Medium"
  } else {
    risk = "Low"
  }

  // Generate reasons
  const reasons: string[] = []
  if (coverage < 50) {
    reasons.push("Low test coverage (below 50%)")
  }
  if (bugDensity > 0.3) {
    reasons.push("High bug density (above 0.3 bugs/commit)")
  }
  if (complexity > 7) {
    reasons.push("High code complexity (above 7)")
  }
  if (productivity < 20) {
    reasons.push("Low developer productivity (below 20 commits/dev)")
  }

  // Calculate confidence score based on distance from thresholds
  const distanceFrom50 = Math.abs(score - 50)
  const distanceFrom75 = Math.abs(score - 75)
  const minDistance = Math.min(distanceFrom50, distanceFrom75)
  const confidence = Math.min(100, Math.round(50 + minDistance * 2))

  return {
    risk,
    score,
    reasons,
    metrics: {
      bugDensity: Math.round(bugDensity * 100) / 100,
      productivity: Math.round(productivity * 10) / 10,
      bugs,
      coverage,
      complexity,
    },
    confidence,
  }
}

export function getRiskColor(risk: "High" | "Medium" | "Low"): string {
  switch (risk) {
    case "High":
      return "text-red-500"
    case "Medium":
      return "text-amber-500"
    case "Low":
      return "text-emerald-500"
  }
}

export function getRiskBorderColor(risk: "High" | "Medium" | "Low"): string {
  switch (risk) {
    case "High":
      return "border-red-500"
    case "Medium":
      return "border-amber-500"
    case "Low":
      return "border-emerald-500"
  }
}

export function getRiskBgColor(risk: "High" | "Medium" | "Low"): string {
  switch (risk) {
    case "High":
      return "bg-red-500/10"
    case "Medium":
      return "bg-amber-500/10"
    case "Low":
      return "bg-emerald-500/10"
  }
}

export function getBadgeVariant(score: number): { label: string; variant: "default" | "secondary" | "destructive" | "outline" } {
  if (score >= 75) {
    return { label: "Healthy", variant: "default" }
  } else if (score >= 50) {
    return { label: "Needs Attention", variant: "secondary" }
  } else {
    return { label: "Critical", variant: "destructive" }
  }
}
