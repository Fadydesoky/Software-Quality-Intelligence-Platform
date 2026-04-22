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
    
    // Simulate slight delay for better UX
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
    }, 300)
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
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            <span className="font-semibold">Software Quality Predictor</span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* KPI Summary */}
        <KPICards history={history} />

        {/* Main Grid */}
        <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
          {/* Input Panel */}
          <div className="space-y-4">
            <InputPanel
              values={inputValues}
              onChange={setInputValues}
              onPredict={handlePredict}
              isLoading={isLoading}
            />
            
            {/* Live Preview */}
            <div className="rounded-lg border bg-muted/50 p-4">
              <p className="text-xs font-medium text-muted-foreground mb-2">Live Preview</p>
              <div className="flex items-center justify-between">
                <span className="text-sm">Predicted Score</span>
                <span className="text-2xl font-bold tabular-nums">{liveResult.score}</span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-sm">Risk Level</span>
                <span className={`text-sm font-medium ${
                  liveResult.risk === "High" ? "text-red-500" : 
                  liveResult.risk === "Medium" ? "text-amber-500" : "text-emerald-500"
                }`}>
                  {liveResult.risk}
                </span>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-4">
            <ResultsCard result={result} />
            <MetricsChart result={result} />
          </div>
        </div>

        {/* Comparison Chart */}
        {comparisonEntries && (
          <ComparisonChart 
            entries={comparisonEntries} 
            onClose={() => {
              setComparisonEntries(null)
              setSelectedIds([])
            }} 
          />
        )}

        {/* Charts Grid */}
        {history.length >= 2 && (
          <div className="grid gap-6 md:grid-cols-2">
            <TrendChart history={history} />
            <ScoreHistogram history={history} />
          </div>
        )}

        {/* History Table */}
        <HistoryTable
          history={history}
          onClear={handleClearHistory}
          onCompare={handleCompare}
          selectedIds={selectedIds}
          onSelect={handleSelect}
        />
      </main>

      {/* Footer */}
      <footer className="border-t py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          Software Quality Predictor - Built for engineering teams
        </div>
      </footer>
    </div>
  )
}
