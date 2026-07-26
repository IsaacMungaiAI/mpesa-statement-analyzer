"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  Area,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine,
} from "recharts"
import { mockMonthlyCashFlow, mockForecast } from "@/lib/mock-data"

const forecastData = [
  ...mockMonthlyCashFlow.map((m) => ({
    month: m.month,
    actual: m.expenses,
    predicted: undefined as number | undefined,
    lower_bound: undefined as number | undefined,
    upper_bound: undefined as number | undefined,
  })),
  ...mockForecast.map((f) => ({
    month: f.month,
    actual: undefined as number | undefined,
    predicted: f.predicted,
    lower_bound: f.lower_bound,
    upper_bound: f.upper_bound,
  })),
]

const forecastConfig = {
  actual: { label: "Actual", color: "hsl(var(--chart-1))" },
  predicted: { label: "Predicted", color: "hsl(var(--chart-3))" },
  upper_bound: { label: "Upper Bound", color: "hsl(var(--chart-2) / 0.2)" },
  lower_bound: { label: "Lower Bound", color: "hsl(var(--chart-2) / 0.2)" },
} satisfies ChartConfig

export function ForecastsPage() {
  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        AI-projected financial outlook for the next 3 months.
      </p>

      <Card>
        <CardHeader>
          <CardTitle>Spending Forecast</CardTitle>
          <CardDescription>Actual vs predicted with confidence band</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={forecastConfig} className="h-[400px] w-full">
            <AreaChart data={forecastData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ReferenceLine
                x="Jul"
                stroke="hsl(var(--muted-foreground) / 0.3)"
                strokeDasharray="3 3"
              />
              <Area
                type="monotone"
                dataKey="upper_bound"
                stroke="transparent"
                fill="hsl(var(--chart-2) / 0.1)"
              />
              <Area
                type="monotone"
                dataKey="lower_bound"
                stroke="transparent"
                fill="hsl(var(--chart-2) / 0.1)"
              />
              <Area
                type="monotone"
                dataKey="actual"
                stroke="var(--color-actual)"
                fill="var(--color-actual)"
                fillOpacity={0.2}
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="predicted"
                stroke="var(--color-predicted)"
                fill="var(--color-predicted)"
                fillOpacity={0.1}
                strokeWidth={2}
                strokeDasharray="5 5"
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>How this forecast works</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            This forecast uses your historical spending patterns to predict future expenses.
            The dashed line represents the AI-predicted spending, with a shaded confidence band
            showing the likely range. Predictions become less precise further into the future.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
