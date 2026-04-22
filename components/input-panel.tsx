"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { HelpCircle, Play } from "lucide-react"
import type { PredictionInput } from "@/lib/prediction"

interface InputPanelProps {
  values: PredictionInput
  onChange: (values: PredictionInput) => void
  onPredict: () => void
  isLoading?: boolean
}

const tooltips = {
  commits: "Total number of commits in the analyzed period. Higher commit counts with fewer bugs indicate healthier development.",
  bugs: "Number of bugs or defects found. Directly impacts the bug density metric.",
  complexity: "Code complexity score from 1 (simple) to 10 (very complex). Higher complexity often correlates with more bugs.",
  developers: "Number of developers working on the project. Used to calculate productivity metrics.",
  coverage: "Percentage of code covered by tests. Higher coverage generally means fewer production bugs.",
}

export function InputPanel({ values, onChange, onPredict, isLoading }: InputPanelProps) {
  const handleNumberChange = (field: keyof PredictionInput) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0
    onChange({ ...values, [field]: value })
  }

  const handleSliderChange = (field: keyof PredictionInput) => (value: number[]) => {
    onChange({ ...values, [field]: value[0] })
  }

  return (
    <Card className="h-fit">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Input Metrics</CardTitle>
        <CardDescription>
          Enter your software metrics to predict quality risk
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          {/* Commits */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="commits">Commits</Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>{tooltips.commits}</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Input
              id="commits"
              type="number"
              min={1}
              max={10000}
              value={values.commits}
              onChange={handleNumberChange("commits")}
              className="h-9"
            />
          </div>

          {/* Bugs */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="bugs">Bugs</Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>{tooltips.bugs}</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Input
              id="bugs"
              type="number"
              min={0}
              max={1000}
              value={values.bugs}
              onChange={handleNumberChange("bugs")}
              className="h-9"
            />
          </div>

          {/* Developers */}
          <div className="space-y-2 sm:col-span-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="developers">Developers</Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>{tooltips.developers}</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Input
              id="developers"
              type="number"
              min={1}
              max={100}
              value={values.developers}
              onChange={handleNumberChange("developers")}
              className="h-9"
            />
          </div>
        </div>

        {/* Complexity Slider */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Label>Complexity</Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>{tooltips.complexity}</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <span className="text-sm font-medium tabular-nums">{values.complexity}</span>
          </div>
          <Slider
            value={[values.complexity]}
            onValueChange={handleSliderChange("complexity")}
            min={1}
            max={10}
            step={1}
            className="py-1"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Simple</span>
            <span>Complex</span>
          </div>
        </div>

        {/* Coverage Slider */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Label>Test Coverage</Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>{tooltips.coverage}</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <span className="text-sm font-medium tabular-nums">{values.coverage}%</span>
          </div>
          <Slider
            value={[values.coverage]}
            onValueChange={handleSliderChange("coverage")}
            min={0}
            max={100}
            step={1}
            className="py-1"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0%</span>
            <span>100%</span>
          </div>
        </div>

        <Button 
          onClick={onPredict} 
          className="w-full mt-4" 
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Analyzing...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Play className="h-4 w-4" />
              Predict Quality
            </span>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
