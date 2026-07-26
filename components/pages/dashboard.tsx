"use client"

import {
  Wallet,
  TrendingUp,
  TrendingDown,
  ArrowDownRight,
  FileText,
  Upload,
} from "lucide-react"
import Link from "next/link"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Bar, BarChart, XAxis, YAxis } from "recharts"

import {
  mockDashboardStats,
  mockMonthlyCashFlow,
  mockTransactions,
} from "@/lib/mock-data"

const cashFlowConfig = {
  income: { label: "Income", color: "hsl(var(--chart-2))" },
  expenses: { label: "Expenses", color: "hsl(var(--chart-1))" },
} satisfies ChartConfig

function formatKES(amount: number): string {
  return `KES ${Math.abs(amount).toLocaleString()}`
}

export function DashboardPage() {
  const stats = mockDashboardStats
  const recentTransactions = mockTransactions.slice(0, 5)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            Your finances are healthy this month. Here&apos;s your snapshot.
          </p>
        </div>
        <Link href="/statements">
          <Button>
            <Upload className="mr-2 size-4" />
            Upload Statement
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Total Income</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatKES(stats.total_income)}
                </p>
              </div>
              <div className="flex size-10 items-center justify-center rounded-lg bg-green-500/10">
                <TrendingUp className="size-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Total Expenses</p>
                <p className="text-2xl font-bold text-red-600">
                  {formatKES(stats.total_expenses)}
                </p>
              </div>
              <div className="flex size-10 items-center justify-center rounded-lg bg-red-500/10">
                <TrendingDown className="size-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Net Cash Flow</p>
                <p className="text-2xl font-bold">
                  {formatKES(stats.net_cash_flow)}
                </p>
              </div>
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                <ArrowDownRight className="size-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Current Balance</p>
                <p className="text-2xl font-bold">
                  {formatKES(stats.current_balance)}
                </p>
              </div>
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                <Wallet className="size-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Cash Flow</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={cashFlowConfig} className="h-[250px] w-full">
              <BarChart data={mockMonthlyCashFlow}>
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="income" fill="var(--color-income)" radius={4} />
                <Bar dataKey="expenses" fill="var(--color-expenses)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentTransactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted">
                      <FileText className="size-4 text-muted-foreground" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{tx.merchant}</p>
                      <p className="text-xs text-muted-foreground">{tx.date}</p>
                    </div>
                  </div>
                  <span
                    className={`text-sm font-medium tabular-nums ${
                      tx.amount > 0 ? "text-green-600" : "text-foreground"
                    }`}
                  >
                    {tx.amount > 0 ? "+" : "-"}
                    {formatKES(tx.amount)}
                  </span>
                </div>
              ))}
            </div>
            <Link href="/transactions">
              <Button variant="ghost" className="mt-4 w-full">
                View All Transactions
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-4">
            <p className="text-xs text-muted-foreground">Transactions</p>
            <p className="text-2xl font-bold">{stats.transaction_count}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-xs text-muted-foreground">Savings Rate</p>
            <p className="text-2xl font-bold">{stats.savings_rate}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-xs text-muted-foreground">Avg Daily Spend</p>
            <p className="text-2xl font-bold">{formatKES(stats.avg_daily_spend)}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
