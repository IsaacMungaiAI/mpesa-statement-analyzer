"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  Pie,
  PieChart,
  Cell,
  Line,
  LineChart,
  CartesianGrid,
  Tooltip,
} from "recharts"

import {
  mockSpendingByCategory,
  mockMonthlyCashFlow,
  mockBalanceTrend,
  mockTopMerchants,
  mockHourlySpending,
  mockDailyHeatmap,
} from "@/lib/mock-data"

const cashFlowConfig = {
  income: { label: "Income", color: "hsl(var(--chart-2))" },
  expenses: { label: "Expenses", color: "hsl(var(--chart-1))" },
  savings: { label: "Savings", color: "hsl(var(--chart-3))" },
} satisfies ChartConfig

const balanceConfig = {
  balance: { label: "Balance", color: "hsl(var(--chart-1))" },
} satisfies ChartConfig

const categoryConfig = Object.fromEntries(
  mockSpendingByCategory.map((c) => [
    c.name,
    { label: c.name, color: c.color },
  ])
) satisfies ChartConfig

export function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Detailed analytics and spending breakdowns across all your statements.
      </p>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Income vs Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={cashFlowConfig} className="h-[300px] w-full">
              <BarChart data={mockMonthlyCashFlow}>
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="income" fill="var(--color-income)" radius={4} />
                <Bar dataKey="expenses" fill="var(--color-expenses)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Category Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={categoryConfig} className="h-[300px] w-full">
              <PieChart>
                <Pie
                  data={mockSpendingByCategory}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {mockSpendingByCategory.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Balance Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={balanceConfig} className="h-[300px] w-full">
              <LineChart data={mockBalanceTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="balance"
                  stroke="var(--color-balance)"
                  strokeWidth={2}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Merchants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockTopMerchants.map((merchant) => (
                <div key={merchant.name} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{merchant.name}</span>
                    <span className="tabular-nums text-muted-foreground">
                      KES {merchant.total.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${merchant.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Spending by Hour</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}} className="h-[250px] w-full">
              <BarChart data={mockHourlySpending}>
                <XAxis
                  dataKey="hour"
                  tickFormatter={(h) => `${h}:00`}
                  interval={3}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="spending" fill="hsl(var(--chart-1))" radius={2} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Daily Spending Heatmap</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                <div key={day} className="text-center text-xs text-muted-foreground">
                  {day}
                </div>
              ))}
              {mockDailyHeatmap.map((cell, i) => {
                const maxAmount = Math.max(...mockDailyHeatmap.map((c) => c.amount))
                const intensity = cell.amount / maxAmount
                return (
                  <div
                    key={i}
                    className="aspect-square rounded-sm"
                    style={{
                      backgroundColor: `hsl(var(--chart-1) / ${0.1 + intensity * 0.8})`,
                    }}
                    title={`${cell.day} Week ${cell.week + 1}: KES ${cell.amount.toLocaleString()}`}
                  />
                )
              })}
            </div>
            <div className="mt-3 flex items-center justify-end gap-1 text-xs text-muted-foreground">
              <span>Less</span>
              {[0.1, 0.3, 0.5, 0.7, 0.9].map((v) => (
                <div
                  key={v}
                  className="size-3 rounded-sm"
                  style={{ backgroundColor: `hsl(var(--chart-1) / ${v})` }}
                />
              ))}
              <span>More</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
