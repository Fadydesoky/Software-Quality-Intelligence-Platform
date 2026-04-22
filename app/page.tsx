"use client"

import * as React from "react"
import { InputPanel } from "@/components/input-panel"
import { ResultsCard } from "@/components/results-card"
import { MetricsChart } from "@/components/metrics-chart"
import { HistoryTable } from "@/components/history-table"
import { ComparisonChart } from "@/components/comparison-chart"
import { ScoreHistogram } from "@/components/score-histogram"
import { KPICards } from "@/components/kpi-cards"
import { TrendChart } from "@/components/trend-chart"
import { ThemeToggle } from "@/components/theme-toggle"
import { predictQuality, type PredictionInput, type PredictionResult, type HistoryEntry } from "@/lib/prediction"
import { Activity } from "lucide-react"

export default function Dashboard() {
  const [inputValues, setInputValues] = React.useState<PredictionInput>({
    commits: 200,
    bugs: 50,
    complexity: 5,
    developers: 5,
    coverage: 70,
  })

  const [result, setResult] = React.useState<PredictionResult | null>(null)
  const [history, setHistory] = React.useState<HistoryEntry[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [selectedIds, setSelectedIds] = React.useState<string[]>([])
  const [comparisonEntries, setComparisonEntries] = React.useState<[HistoryEntry, HistoryEntry] | null>(null)

  // Live "what-if" analysis - update score as inputs change
  const liveResult = React.useMemo(() => {
    return predictQuality(inputValues)
  }, [inputValues])

  const handlePredict = () => {
    setIsLoading(true)
    
    setTimeout(() => {
      const prediction = predictQuality(inputValues)
      setResult(prediction)
      
      const entry: HistoryEntry = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        ...inputValues,
        risk: prediction.risk,
        score: prediction.score,
      }
      
      setHistory(prev => [...prev, entry])
      setIsLoading(false)
    }, 400)
  }

  const handleClearHistory = () => {
    setHistory([])
    setSelectedIds([])
    setComparisonEntries(null)
  }

  const handleSelect = (id: string) => {
    setSelectedIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(i => i !== id)
      }
      if (prev.length >= 2) {
        return [prev[1], id]
      }
      return [...prev, id]
    })
  }

  const handleCompare = (ids: [string, string]) => {
    const [a, b] = ids.map(id => history.find(h => h.id === id)!)
    if (a && b) {
      setComparisonEntries([a, b])
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-foreground">
              <Activity className="h-5 w-5 text-background" />
            </div>
            <span className="text-lg font-semibold tracking-tight">Quality Predictor</span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        {/* KPI Summary */}
        <div className="animate-fade-in">
          <KPICards history={history} />
        </div>

        {/* Main Grid */}
        <div className="mt-8 grid gap-8 lg:grid-cols-[360px_1fr]">
          {/* Left Column - Input */}
          <div className="space-y-6">
            <div className="animate-slide-up" style={{ animationDelay: "50ms" }}>
              <InputPanel
                values={inputValues}
                onChange={setInputValues}
                onPredict={handlePredict}
                isLoading={isLoading}
              />
            </div>
            
            {/* Live Preview */}
            <div 
              className="animate-slide-up rounded-xl border border-border/50 bg-muted/30 p-5"
              style={{ animationDelay: "100ms" }}
            >
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Live Preview</p>
              <div className="mt-4 flex items-end justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Predicted Score</p>
                  <p className="mt-1 text-4xl font-bold tabular-nums tracking-tight">{liveResult.score}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Risk Level</p>
                  <p className={`mt-1 text-lg font-semibold ${
                    liveResult.risk === "High" ? "text-red-500" : 
                    liveResult.risk === "Medium" ? "text-amber-500" : "text-emerald-500"
                  }`}>
                    {liveResult.risk}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Results */}
          <div className="space-y-6 animate-slide-up" style={{ animationDelay: "150ms" }}>
            <ResultsCard result={result} />
            {result && <MetricsChart result={result} />}
          </div>
        </div>

        {/* Comparison Chart */}
        {comparisonEntries && (
          <div className="mt-10 animate-scale-in">
            <ComparisonChart 
              entries={comparisonEntries} 
              onClose={() => {
                setComparisonEntries(null)
                setSelectedIds([])
              }} 
            />
          </div>
        )}

        {/* Charts Grid */}
        {history.length >= 2 && (
          <div className="mt-10 grid gap-6 md:grid-cols-2 animate-fade-in">
            <TrendChart history={history} />
            <ScoreHistogram history={history} />
          </div>
        )}

        {/* History Table */}
        <div className="mt-10 animate-fade-in">
          <HistoryTable
            history={history}
            onClear={handleClearHistory}
            onCompare={handleCompare}
            selectedIds={selectedIds}
            onSelect={handleSelect}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8 mt-16">
        <div className="mx-auto max-w-6xl px-6 text-center text-sm text-muted-foreground">
          Built for engineering teams
        </div>
      </footer>
    </div>
  )
}
