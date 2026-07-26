"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  ArrowDownRight,
  Receipt,
  Upload,
  DollarSign,
  PiggyBank,
  Clock,
  ChevronRight,
} from "lucide-react"
import Link from "next/link"
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table"
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  Area,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
} from "recharts"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

import {
  mockDashboardStats,
  mockSpendingByCategory,
  mockMonthlyCashFlow,
  mockSpendingTrend,
  mockTransactions,
} from "@/lib/mock-data"
import type { Transaction } from "@/lib/types"

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4, ease: "easeOut" as const },
  }),
}

const cardHover = {
  rest: { scale: 1 },
  hover: { scale: 1.02, transition: { duration: 0.2 } },
}

const cashFlowConfig = {
  income: { label: "Income", color: "#16A34A" },
  expenses: { label: "Expenses", color: "#EF4444" },
  savings: { label: "Savings", color: "#3B82F6" },
} satisfies ChartConfig

const spendingTrendConfig = {
  income: { label: "Income", color: "#16A34A" },
  expenses: { label: "Expenses", color: "#EF4444" },
  balance: { label: "Balance", color: "#3B82F6" },
} satisfies ChartConfig

const categoryPieConfig = Object.fromEntries(
  mockSpendingByCategory.map((cat) => [
    cat.name,
    { label: cat.name, color: cat.color },
  ])
) satisfies ChartConfig

const weeklySpendingConfig = {
  expenses: { label: "Weekly Expenses", color: "#16A34A" },
  income: { label: "Weekly Income", color: "#8B5CF6" },
} satisfies ChartConfig

function formatKES(amount: number): string {
  const abs = Math.abs(amount)
  if (abs >= 1000000) {
    return `KES ${(abs / 1000000).toFixed(1)}M`
  }
  return `KES ${abs.toLocaleString()}`
}

function formatShortKES(amount: number): string {
  return `KES ${(amount / 1000).toFixed(0)}k`
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function formatTooltipValue(value: any, name: any): React.ReactNode {
  return [formatKES(Number(value)), name]
}

const kpiTrends: Record<string, { value: string; positive: boolean }> = {
  income: { value: "+12%", positive: true },
  expenses: { value: "-8%", positive: false },
  "net-cash": { value: "+19%", positive: true },
  balance: { value: "+5%", positive: true },
}

const statusStyles: Record<string, string> = {
  completed: "bg-green-500/10 text-green-600 border-green-500/20",
  pending: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  failed: "bg-red-500/10 text-red-600 border-red-500/20",
}

function CircularHealthScore({ score }: { score: number }) {
  const radius = 54
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  return (
    <div className="relative flex items-center justify-center">
      <svg width="140" height="140" className="-rotate-90">
        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          className="text-muted/50"
        />
        <motion.circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          strokeLinecap="round"
          className="text-green-500"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-3xl font-bold text-green-600"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          {score}
        </motion.span>
        <span className="text-xs text-muted-foreground">/ 100</span>
      </div>
    </div>
  )
}

function SkeletonKpiCard() {
  return (
    <Card>
      <CardContent className="pt-4">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-7 w-32" />
            <Skeleton className="h-4 w-14" />
          </div>
          <Skeleton className="size-10 rounded-lg" />
        </div>
      </CardContent>
    </Card>
  )
}

function SkeletonChart({ className }: { className?: string }) {
  return (
    <Card className={className}>
      <CardHeader>
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-3 w-56" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[250px] w-full rounded-lg" />
      </CardContent>
    </Card>
  )
}

export function DashboardPage() {
  const [isLoading] = useState(false)

  const stats = mockDashboardStats
  const categories = mockSpendingByCategory
  const cashFlow = mockMonthlyCashFlow
  const spendingTrend = mockSpendingTrend
  const transactions = mockTransactions

  const recentTransactions = useMemo(() => transactions.slice(0, 8), [transactions])

  const columns: ColumnDef<Transaction>[] = useMemo(
    () => [
      {
        accessorKey: "date",
        header: "Date",
        cell: ({ row }) => (
          <span className="text-muted-foreground">{row.original.date}</span>
        ),
      },
      {
        accessorKey: "merchant",
        header: "Merchant",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted">
              <DollarSign className="size-3.5 text-muted-foreground" />
            </div>
            <span className="font-medium">{row.original.merchant}</span>
          </div>
        ),
      },
      {
        accessorKey: "category",
        header: "Category",
        cell: ({ row }) => (
          <Badge variant="secondary">{row.original.category}</Badge>
        ),
      },
      {
        accessorKey: "amount",
        header: "Amount",
        cell: ({ row }) => (
          <span
            className={`font-medium tabular-nums ${
              row.original.amount > 0 ? "text-green-600" : "text-foreground"
            }`}
          >
            {row.original.amount > 0 ? "+" : "-"}
            {formatKES(row.original.amount)}
          </span>
        ),
      },
      {
        accessorKey: "balance",
        header: "Balance",
        cell: ({ row }) => (
          <span className="tabular-nums text-muted-foreground">
            {formatKES(row.original.balance)}
          </span>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <span
            className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium capitalize ${
              statusStyles[row.original.status] ?? ""
            }`}
          >
            {row.original.status}
          </span>
        ),
      },
    ],
    []
  )

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: recentTransactions,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-80" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonKpiCard key={i} />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <SkeletonChart className="lg:col-span-2" />
          <SkeletonChart />
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <SkeletonChart />
          <SkeletonChart />
          <SkeletonChart />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Good Morning, Isaac
          </h1>
          <p className="text-muted-foreground">
            Your finances are healthy this month.
          </p>
        </div>
        <Link href="/statements">
          <Button>
            <Upload className="mr-2 size-4" />
            Upload Statement
          </Button>
        </Link>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Income */}
        <motion.div
          custom={0}
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={cardHover} initial="rest" whileHover="hover">
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">
                      Total Income
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      {formatKES(stats.total_income)}
                    </p>
                    <span className="inline-flex items-center rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-600">
                      <TrendingUp className="mr-1 size-3" />
                      {kpiTrends.income.value}
                    </span>
                  </div>
                  <div className="flex size-10 items-center justify-center rounded-lg bg-green-500/10">
                    <TrendingUp className="size-5 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Total Expenses */}
        <motion.div
          custom={1}
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={cardHover} initial="rest" whileHover="hover">
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">
                      Total Expenses
                    </p>
                    <p className="text-2xl font-bold text-red-600">
                      {formatKES(stats.total_expenses)}
                    </p>
                    <span className="inline-flex items-center rounded-full bg-red-500/10 px-2 py-0.5 text-xs font-medium text-red-600">
                      <TrendingDown className="mr-1 size-3" />
                      {kpiTrends.expenses.value}
                    </span>
                  </div>
                  <div className="flex size-10 items-center justify-center rounded-lg bg-red-500/10">
                    <TrendingDown className="size-5 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Net Cash Flow */}
        <motion.div
          custom={2}
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={cardHover} initial="rest" whileHover="hover">
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">
                      Net Cash Flow
                    </p>
                    <p className="text-2xl font-bold">
                      {formatKES(stats.net_cash_flow)}
                    </p>
                    <span className="inline-flex items-center rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-600">
                      <TrendingUp className="mr-1 size-3" />
                      {kpiTrends["net-cash"].value}
                    </span>
                  </div>
                  <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                    <ArrowDownRight className="size-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Current Balance */}
        <motion.div
          custom={3}
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={cardHover} initial="rest" whileHover="hover">
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">
                      Current Balance
                    </p>
                    <p className="text-2xl font-bold">
                      {formatKES(stats.current_balance)}
                    </p>
                    <span className="inline-flex items-center rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-600">
                      <TrendingUp className="mr-1 size-3" />
                      {kpiTrends.balance.value}
                    </span>
                  </div>
                  <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                    <Wallet className="size-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>

      {/* Monthly Cash Flow + Financial Health */}
      <div className="grid gap-6 lg:grid-cols-3">
        <motion.div
          custom={4}
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="lg:col-span-2"
        >
          <motion.div variants={cardHover} initial="rest" whileHover="hover">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Income vs Expenses</CardTitle>
                <CardDescription>
                  Cash flow breakdown over the past 7 months
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={cashFlowConfig}
                  className="h-[280px] w-full"
                >
                  <BarChart data={cashFlow}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis
                      dataKey="month"
                      tickLine={false}
                      axisLine={false}
                      className="text-xs"
                    />
                    <YAxis
                      tickFormatter={(v: number) => formatShortKES(v)}
                      tickLine={false}
                      axisLine={false}
                      className="text-xs"
                    />
                    <ChartTooltip
                      content={
                        <ChartTooltipContent
                          formatter={formatTooltipValue}
                        />
                      }
                    />
                    <Bar dataKey="income" fill="var(--color-income)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="expenses" fill="var(--color-expenses)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        <motion.div
          custom={5}
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={cardHover} initial="rest" whileHover="hover">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Financial Health</CardTitle>
                <CardDescription>Overall score based on your habits</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-4">
                <CircularHealthScore score={87} />
                <div className="w-full space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Savings Rate</span>
                    <span className="font-medium">{stats.savings_rate}%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Transactions</span>
                    <span className="font-medium">{stats.transaction_count}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Avg Daily Spend</span>
                    <span className="font-medium">{formatKES(stats.avg_daily_spend)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Total Fees</span>
                    <span className="font-medium">{formatKES(stats.total_fees)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>

      {/* Spending Trend + Category Distribution + Weekly Spending */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Spending Trend (Line Chart) */}
        <motion.div
          custom={6}
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={cardHover} initial="rest" whileHover="hover">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Spending Trend</CardTitle>
                <CardDescription>Weekly income, expenses & balance</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={spendingTrendConfig}
                  className="h-[250px] w-full"
                >
                  <LineChart data={spendingTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis
                      dataKey="date"
                      tickLine={false}
                      axisLine={false}
                      className="text-xs"
                    />
                    <YAxis
                      tickFormatter={(v: number) => formatShortKES(v)}
                      tickLine={false}
                      axisLine={false}
                      className="text-xs"
                    />
                    <ChartTooltip
                      content={
                        <ChartTooltipContent
                          formatter={formatTooltipValue}
                        />
                      }
                    />
                    <Line
                      type="monotone"
                      dataKey="income"
                      stroke="var(--color-income)"
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="expenses"
                      stroke="var(--color-expenses)"
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="balance"
                      stroke="var(--color-balance)"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Category Distribution (Pie Chart) */}
        <motion.div
          custom={7}
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={cardHover} initial="rest" whileHover="hover">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Category Distribution</CardTitle>
                <CardDescription>Spending breakdown by category</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={categoryPieConfig}
                  className="mx-auto h-[250px] w-full"
                >
                  <PieChart>
                    <ChartTooltip
                      content={
                        <ChartTooltipContent
                          formatter={formatTooltipValue}
                        />
                      }
                    />
                    <Pie
                      data={categories}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={90}
                      strokeWidth={2}
                      stroke="hsl(var(--card))"
                    >
                      {categories.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ChartContainer>
                <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1.5">
                  {categories.map((cat) => (
                    <div key={cat.name} className="flex items-center gap-2 text-xs">
                      <div
                        className="size-2 shrink-0 rounded-full"
                        style={{ backgroundColor: cat.color }}
                      />
                      <span className="truncate text-muted-foreground">
                        {cat.name}
                      </span>
                      <span className="ml-auto font-medium tabular-nums">
                        {cat.percentage}%
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Weekly Spending (Area Chart) */}
        <motion.div
          custom={8}
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={cardHover} initial="rest" whileHover="hover">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Weekly Spending</CardTitle>
                <CardDescription>Income vs expenses per week</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={weeklySpendingConfig}
                  className="h-[250px] w-full"
                >
                  <AreaChart data={spendingTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis
                      dataKey="date"
                      tickLine={false}
                      axisLine={false}
                      className="text-xs"
                    />
                    <YAxis
                      tickFormatter={(v: number) => formatShortKES(v)}
                      tickLine={false}
                      axisLine={false}
                      className="text-xs"
                    />
                    <ChartTooltip
                      content={
                        <ChartTooltipContent
                          formatter={formatTooltipValue}
                        />
                      }
                    />
                    <Area
                      type="monotone"
                      dataKey="income"
                      stroke="var(--color-income)"
                      fill="var(--color-income)"
                      fillOpacity={0.1}
                      strokeWidth={2}
                    />
                    <Area
                      type="monotone"
                      dataKey="expenses"
                      stroke="var(--color-expenses)"
                      fill="var(--color-expenses)"
                      fillOpacity={0.1}
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>

      {/* Recent Transactions Table */}
      <motion.div
        custom={9}
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={cardHover} initial="rest" whileHover="hover">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Transactions</CardTitle>
                  <CardDescription>Your latest M-Pesa activity</CardDescription>
                </div>
                <Link href="/transactions">
                  <Button variant="ghost" size="sm">
                    View All
                    <ChevronRight className="size-4" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    {table.getHeaderGroups().map((headerGroup) => (
                      <tr
                        key={headerGroup.id}
                        className="border-b"
                      >
                        {headerGroup.headers.map((header) => (
                          <th
                            key={header.id}
                            className="px-4 py-3 text-left text-xs font-medium text-muted-foreground"
                          >
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody>
                    {table.getRowModel().rows.map((row) => (
                      <motion.tr
                        key={row.id}
                        className="border-b transition-colors hover:bg-muted/50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <td key={cell.id} className="px-4 py-3">
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </td>
                        ))}
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Bottom Stats Row */}
      <div className="grid gap-4 sm:grid-cols-3">
        <motion.div custom={10} variants={fadeInUp} initial="hidden" animate="visible">
          <motion.div variants={cardHover} initial="rest" whileHover="hover">
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">
                      Transactions
                    </p>
                    <p className="text-2xl font-bold">{stats.transaction_count}</p>
                  </div>
                  <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                    <Receipt className="size-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        <motion.div custom={11} variants={fadeInUp} initial="hidden" animate="visible">
          <motion.div variants={cardHover} initial="rest" whileHover="hover">
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">
                      Savings Rate
                    </p>
                    <p className="text-2xl font-bold">{stats.savings_rate}%</p>
                  </div>
                  <div className="flex size-10 items-center justify-center rounded-lg bg-green-500/10">
                    <PiggyBank className="size-5 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        <motion.div custom={12} variants={fadeInUp} initial="hidden" animate="visible">
          <motion.div variants={cardHover} initial="rest" whileHover="hover">
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">
                      Avg Daily Spend
                    </p>
                    <p className="text-2xl font-bold">
                      {formatKES(stats.avg_daily_spend)}
                    </p>
                  </div>
                  <div className="flex size-10 items-center justify-center rounded-lg bg-purple-500/10">
                    <Clock className="size-5 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
