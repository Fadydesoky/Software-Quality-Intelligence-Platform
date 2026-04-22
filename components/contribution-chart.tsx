"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList } from "recharts"
import { Info } from "lucide-react"
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import type { ScoreBreakdown } from "@/lib/prediction"

interface ContributionChartProps {
  breakdown: ScoreBreakdown
}

const colors = {
  good: "hsl(142.1 76.2% 36.3%)",
  warning: "hsl(45.4 93.4% 47.5%)",
  bad: "hsl(0 84.2% 60.2%)",
}

export function ContributionChart({ breakdown }: ContributionChartProps) {
  const data = [
    {
      name: "Bug Density",
      contribution: breakdown.bugDensity.contribution,
      max: breakdown.bugDensity.maxContribution,
      percentage: Math.round((breakdown.bugDensity.contribution / breakdown.bugDensity.maxContribution) * 100),
      status: breakdown.bugDensity.status,
    },
    {
      name: "Complexity",
      contribution: breakdown.complexity.contribution,
      max: breakdown.complexity.maxContribution,
      percentage: Math.round((breakdown.complexity.contribution / breakdown.complexity.maxContribution) * 100),
      status: breakdown.complexity.status,
    },
    {
      name: "Coverage",
      contribution: breakdown.coverage.contribution,
      max: breakdown.coverage.maxContribution,
      percentage: Math.round((breakdown.coverage.contribution / breakdown.coverage.maxContribution) * 100),
      status: breakdown.coverage.status,
    },
  ]

  const totalContribution = data.reduce((sum, d) => sum + d.contribution, 0)
  const totalMax = data.reduce((sum, d) => sum + d.max, 0)

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-sm font-medium">Feature Contributions</CardTitle>
            <p className="mt-1 text-xs text-muted-foreground">
              How each metric impacts your score
            </p>
          </div>
          <UITooltip>
            <TooltipTrigger>
              <Info className="h-4 w-4 text-muted-foreground/60 cursor-help" />
            </TooltipTrigger>
            <TooltipContent side="left" className="max-w-[240px] text-xs">
              Each bar shows how much a metric contributes to the total score. 
              Longer bars mean better performance in that area.
            </TooltipContent>
          </UITooltip>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 0, right: 60, left: 0, bottom: 0 }}
            >
              <XAxis
                type="number"
                domain={[0, 45]}
                tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 11, fill: "hsl(var(--foreground))" }}
                axisLine={false}
                tickLine={false}
                width={80}
              />
              <Tooltip
                cursor={{ fill: "hsl(var(--muted))", opacity: 0.3 }}
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: 12,
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
                formatter={(value, _name, props) => {
                  const payload = props.payload as typeof data[number]
                  const numValue = typeof value === "number" ? value : 0
                  return [
                    `${numValue.toFixed(1)} / ${payload.max} points (${payload.percentage}%)`,
                    "Contribution"
                  ]
                }}
              />
              <Bar
                dataKey="contribution"
                radius={[0, 4, 4, 0]}
                barSize={24}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[entry.status]} />
                ))}
                <LabelList
                  dataKey="contribution"
                  position="right"
                  formatter={(value: number) => `+${value.toFixed(1)}`}
                  style={{ fontSize: 11, fontWeight: 600, fill: "hsl(var(--foreground))" }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Stacked Summary Bar */}
        <div className="mt-6 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Total Score Composition</span>
            <span className="font-semibold">{Math.round(totalContribution)} / {totalMax}</span>
          </div>
          <div className="flex h-3 w-full overflow-hidden rounded-full bg-muted/50">
            {data.map((item, index) => (
              <div
                key={index}
                className="h-full transition-all duration-500"
                style={{
                  width: `${(item.contribution / totalMax) * 100}%`,
                  backgroundColor: colors[item.status],
                }}
              />
            ))}
          </div>
          <div className="flex items-center justify-center gap-4 text-[10px] text-muted-foreground">
            {data.map((item, index) => (
              <div key={index} className="flex items-center gap-1">
                <div
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: colors[item.status] }}
                />
                <span>{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
