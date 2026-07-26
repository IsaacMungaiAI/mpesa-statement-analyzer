"use client"

import { useMemo } from "react"
import { motion } from "framer-motion"
import {
  TrendingUp,
  Wallet,
  PiggyBank,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
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

function formatKES(amount: number): string {
  const abs = Math.abs(amount)
  if (abs >= 1000000) return `KES ${(abs / 1000000).toFixed(1)}M`
  return `KES ${abs.toLocaleString()}`
}

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
  upper_bound: { label: "Upper Bound", color: "hsl(var(--chart-2) / 0.15)" },
  lower_bound: { label: "Lower Bound", color: "hsl(var(--chart-2) / 0.15)" },
} satisfies ChartConfig

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function formatTooltipValue(value: any, name: any): React.ReactNode {
  if (name === "upper_bound" || name === "lower_bound") return null
  return [formatKES(Number(value)), name]
}

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4, ease: "easeOut" as const },
  }),
}

const kpis = [
  {
    label: "Expected Spending",
    value: mockForecast.reduce((s, f) => s + f.predicted, 0) / mockForecast.length,
    icon: TrendingUp,
    color: "bg-blue-500/10",
    iconColor: "text-blue-600",
    trend: "+4%",
    trendUp: true,
  },
  {
    label: "Expected Balance",
    value: 47680 + (mockForecast[mockForecast.length - 1]?.predicted ?? 0) - mockForecast.reduce((s, f) => s + f.predicted, 0),
    icon: Wallet,
    color: "bg-green-500/10",
    iconColor: "text-green-600",
    trend: "+8%",
    trendUp: true,
  },
  {
    label: "Savings Forecast",
    value: mockForecast[mockForecast.length - 1]?.predicted
      ? mockMonthlyCashFlow[mockMonthlyCashFlow.length - 1].income - mockForecast[mockForecast.length - 1].predicted
      : 0,
    icon: PiggyBank,
    color: "bg-purple-500/10",
    iconColor: "text-purple-600",
    trend: "+12%",
    trendUp: true,
  },
]

const forecastSteps = [
  {
    icon: CheckCircle2,
    text: "Analyzes your historical spending patterns over the last 6 months",
  },
  {
    icon: CheckCircle2,
    text: "Applies seasonality and trend adjustments using statistical models",
  },
  {
    icon: CheckCircle2,
    text: "Generates a confidence interval representing the likely range of future spending",
  },
  {
    icon: CheckCircle2,
    text: "Predictions become less precise further into the future, shown by the widening band",
  },
]

export function ForecastsPage() {
  const latestForecast = useMemo(() => mockForecast[mockForecast.length - 1], [])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">Forecast</h2>
        <p className="text-sm text-muted-foreground">
          AI-projected financial outlook for the next 3 months.
        </p>
      </div>

      <Separator />

      {/* Summary KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {kpis.map((kpi, i) => {
          const Icon = kpi.icon
          return (
            <motion.div
              key={kpi.label}
              custom={i}
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
            >
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground">
                        {kpi.label}
                      </p>
                      <p className="text-2xl font-bold">{formatKES(kpi.value)}</p>
                      <span className="inline-flex items-center rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-600">
                        {kpi.trendUp ? (
                          <ArrowUpRight className="mr-0.5 size-3" />
                        ) : (
                          <ArrowDownRight className="mr-0.5 size-3" />
                        )}
                        {kpi.trend}
                      </span>
                    </div>
                    <div className={`flex size-10 items-center justify-center rounded-lg ${kpi.color}`}>
                      <Icon className={`size-5 ${kpi.iconColor}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Main Forecast Chart */}
      <motion.div
        custom={3}
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Spending Forecast</CardTitle>
                <CardDescription>
                  Actual vs predicted expenses with confidence band
                </CardDescription>
              </div>
              <Badge variant="secondary" className="gap-1">
                <Sparkles className="size-3" />
                AI Model
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer config={forecastConfig} className="h-[400px] w-full">
              <AreaChart data={forecastData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  className="text-xs"
                />
                <YAxis
                  tickFormatter={(v: number) => formatKES(v)}
                  tickLine={false}
                  axisLine={false}
                  className="text-xs"
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent formatter={formatTooltipValue} />
                  }
                />
                <ReferenceLine
                  x="Jul"
                  stroke="hsl(var(--muted-foreground) / 0.3)"
                  strokeDasharray="3 3"
                  label={{
                    value: "Today",
                    position: "top",
                    className: "text-xs fill-muted-foreground",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="upper_bound"
                  stroke="transparent"
                  fill="var(--color-predicted)"
                  fillOpacity={0.08}
                />
                <Area
                  type="monotone"
                  dataKey="lower_bound"
                  stroke="transparent"
                  fill="hsl(var(--card))"
                />
                <Area
                  type="monotone"
                  dataKey="actual"
                  stroke="var(--color-actual)"
                  fill="var(--color-actual)"
                  fillOpacity={0.15}
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="predicted"
                  stroke="var(--color-predicted)"
                  fill="transparent"
                  strokeWidth={2}
                  strokeDasharray="6 4"
                />
              </AreaChart>
            </ChartContainer>

            <div className="mt-4 flex items-center gap-6 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="h-0.5 w-4 rounded bg-[var(--color-actual)]" />
                Actual spending
              </div>
              <div className="flex items-center gap-2">
                <span className="h-0.5 w-4 rounded border-t-2 border-dashed border-[var(--color-predicted)]" />
                Predicted spending
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block size-2 rounded-sm bg-[var(--color-predicted)] opacity-20" />
                Confidence band
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* How Forecast Works */}
      <motion.div
        custom={4}
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="size-4 text-purple-600" />
              How this forecast works
            </CardTitle>
            <CardDescription>
              Next predicted expense for {latestForecast.month}:{" "}
              <span className="font-semibold text-foreground">
                {formatKES(latestForecast.predicted)}
              </span>
              {" "}(range {formatKES(latestForecast.lower_bound)} –{" "}
              {formatKES(latestForecast.upper_bound)})
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {forecastSteps.map((step, i) => {
                const StepIcon = step.icon
                return (
                  <div key={i} className="flex items-start gap-3">
                    <StepIcon className="mt-0.5 size-4 shrink-0 text-green-600" />
                    <p className="text-sm text-muted-foreground">{step.text}</p>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
