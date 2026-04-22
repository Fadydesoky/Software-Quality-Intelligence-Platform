"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Info, Sparkles } from "lucide-react"
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
    <Card className="border-border/50 shadow-sm">
      <CardHeader className="pb-6">
        <CardTitle className="text-base font-semibold">Input Metrics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Number Inputs Grid */}
        <div className="grid gap-5 sm:grid-cols-3">
          {/* Commits */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <Label htmlFor="commits" className="text-sm font-medium">Commits</Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-3.5 w-3.5 text-muted-foreground/60 cursor-help transition-colors hover:text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-[200px] text-xs">
                  {tooltips.commits}
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
              className="h-10 bg-background transition-shadow focus:shadow-sm"
            />
          </div>

          {/* Bugs */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <Label htmlFor="bugs" className="text-sm font-medium">Bugs</Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-3.5 w-3.5 text-muted-foreground/60 cursor-help transition-colors hover:text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-[200px] text-xs">
                  {tooltips.bugs}
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
              className="h-10 bg-background transition-shadow focus:shadow-sm"
            />
          </div>

          {/* Developers */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <Label htmlFor="developers" className="text-sm font-medium">Developers</Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-3.5 w-3.5 text-muted-foreground/60 cursor-help transition-colors hover:text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-[200px] text-xs">
                  {tooltips.developers}
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
              className="h-10 bg-background transition-shadow focus:shadow-sm"
            />
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border/50" />

        {/* Complexity Slider */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Label className="text-sm font-medium">Complexity</Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-3.5 w-3.5 text-muted-foreground/60 cursor-help transition-colors hover:text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-[200px] text-xs">
                  {tooltips.complexity}
                </TooltipContent>
              </Tooltip>
            </div>
            <span className="rounded-md bg-muted px-2 py-0.5 text-sm font-semibold tabular-nums">
              {values.complexity}
            </span>
          </div>
          <Slider
            value={[values.complexity]}
            onValueChange={handleSliderChange("complexity")}
            min={1}
            max={10}
            step={1}
            className="py-1"
          />
          <div className="flex justify-between text-[11px] text-muted-foreground">
            <span>Simple</span>
            <span>Complex</span>
          </div>
        </div>

        {/* Coverage Slider */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Label className="text-sm font-medium">Test Coverage</Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-3.5 w-3.5 text-muted-foreground/60 cursor-help transition-colors hover:text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-[200px] text-xs">
                  {tooltips.coverage}
                </TooltipContent>
              </Tooltip>
            </div>
            <span className="rounded-md bg-muted px-2 py-0.5 text-sm font-semibold tabular-nums">
              {values.coverage}%
            </span>
          </div>
          <Slider
            value={[values.coverage]}
            onValueChange={handleSliderChange("coverage")}
            min={0}
            max={100}
            step={1}
            className="py-1"
          />
          <div className="flex justify-between text-[11px] text-muted-foreground">
            <span>0%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border/50" />

        <Button 
          onClick={onPredict} 
          className="w-full h-11 font-medium transition-all hover:shadow-md" 
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Analyzing...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Predict Quality
            </span>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
