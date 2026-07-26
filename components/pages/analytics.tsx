"use client"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
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
  Treemap,
  ResponsiveContainer,
} from "recharts"
import {
  TrendingUp,
  TrendingDown,
  Utensils,
  Car,
  Zap,
  ShoppingCart,
  Smartphone,
  MoreHorizontal,
  Store,
  Clock,
  Hash,
} from "lucide-react"
import {
  mockSpendingByCategory,
  mockMonthlyCashFlow,
  mockBalanceTrend,
  mockTopMerchants,
  mockHourlySpending,
  mockDailyHeatmap,
} from "@/lib/mock-data"

const fadeIn = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.4, ease: "easeOut" as const },
  }),
}

const cashFlowConfig = {
  income: { label: "Income", color: "hsl(142, 71%, 45%)" },
  expenses: { label: "Expenses", color: "hsl(142, 40%, 55%)" },
  savings: { label: "Savings", color: "hsl(142, 80%, 35%)" },
} satisfies ChartConfig

const balanceConfig = {
  balance: { label: "Balance", color: "hsl(142, 71%, 45%)" },
} satisfies ChartConfig

const categoryConfig = Object.fromEntries(
  mockSpendingByCategory.map((c) => [
    c.name,
    { label: c.name, color: c.color },
  ])
) satisfies ChartConfig

const hourlyConfig = {
  spending: { label: "Spending", color: "hsl(142, 71%, 45%)" },
} satisfies ChartConfig

const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  "Food & Dining": Utensils,
  Transport: Car,
  "Bills & Utilities": Zap,
  Shopping: ShoppingCart,
  "Airtime & Data": Smartphone,
  Other: MoreHorizontal,
}

const CATEGORY_TRENDS: Record<string, { value: number; direction: "up" | "down" }> = {
  "Food & Dining": { value: 11, direction: "up" },
  Transport: { value: 34, direction: "down" },
  "Bills & Utilities": { value: 5, direction: "up" },
  Shopping: { value: 8, direction: "up" },
  "Airtime & Data": { value: 12, direction: "down" },
  Other: { value: 3, direction: "up" },
}

const CATEGORY_COUNTS: Record<string, number> = {
  "Food & Dining": 32,
  Transport: 18,
  "Bills & Utilities": 8,
  Shopping: 14,
  "Airtime & Data": 22,
  Other: 33,
}

const heatmapMax = Math.max(...mockDailyHeatmap.map((c) => c.amount))

const customTreemapData = mockTopMerchants.map((m) => ({
  name: m.name,
  size: m.total,
  fill: "hsl(142, 50%, 50%)",
}))

function CustomTreemapContent(props: { x: number; y: number; width: number; height: number; name: string; index: number }) {
  const { x, y, width, height, name } = props
  if (width < 60 || height < 30) return null
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={6}
        fill="hsl(142, 45%, 42%)"
        stroke="hsl(142, 50%, 96%)"
        strokeWidth={2}
        opacity={0.85 - (props.index % 3) * 0.15}
      />
      <text
        x={x + width / 2}
        y={y + height / 2}
        textAnchor="middle"
        dominantBaseline="central"
        fill="white"
        fontSize={11}
        fontWeight={500}
      >
        {name.length > 16 ? name.slice(0, 14) + "…" : name}
      </text>
    </g>
  )
}

export function AnalyticsPage() {
  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">Analytics</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Detailed analytics and spending breakdowns across all your statements.
        </p>
      </motion.div>

      {/* ── 1. Income vs Expenses ── */}
      <motion.div variants={fadeIn} initial="hidden" animate="visible" custom={0}>
        <Card>
          <CardHeader>
            <CardTitle>Income vs Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={cashFlowConfig} className="h-[340px] w-full">
              <BarChart data={mockMonthlyCashFlow} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <ChartTooltip content={<ChartTooltipContent formatter={(v) => `KES ${Number(v).toLocaleString()}`} />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="income" fill="var(--color-income)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" fill="var(--color-expenses)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="savings" fill="var(--color-savings)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* ── 2. Category Distribution ── */}
      <motion.div variants={fadeIn} initial="hidden" animate="visible" custom={1}>
        <Card>
          <CardHeader>
            <CardTitle>Category Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-6 md:flex-row md:items-center">
              <ChartContainer config={categoryConfig} className="h-[300px] flex-1">
                <PieChart>
                  <Pie
                    data={mockSpendingByCategory}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={120}
                    paddingAngle={3}
                    dataKey="value"
                    animationBegin={200}
                    animationDuration={800}
                  >
                    {mockSpendingByCategory.map((entry, i) => (
                      <Cell key={i} fill={entry.color} stroke="transparent" />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent formatter={(v) => `KES ${Number(v).toLocaleString()}`} />} />
                </PieChart>
              </ChartContainer>
              <div className="flex flex-col gap-3 md:w-56">
                {mockSpendingByCategory.map((cat) => (
                  <div key={cat.name} className="flex items-center gap-3 text-sm">
                    <div className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: cat.color }} />
                    <div className="flex-1 truncate">{cat.name}</div>
                    <div className="tabular-nums text-muted-foreground">{cat.percentage}%</div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ── 3. Balance Trend ── */}
      <motion.div variants={fadeIn} initial="hidden" animate="visible" custom={2}>
        <Card>
          <CardHeader>
            <CardTitle>Balance Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={balanceConfig} className="h-[300px] w-full">
              <LineChart data={mockBalanceTrend}>
                <defs>
                  <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <ChartTooltip content={<ChartTooltipContent formatter={(v) => `KES ${Number(v).toLocaleString()}`} />} />
                <Line
                  type="monotone"
                  dataKey="balance"
                  stroke="var(--color-balance)"
                  strokeWidth={2.5}
                  dot={{ fill: "var(--color-balance)", r: 4, strokeWidth: 0 }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* ── 4. Spending Treemap ── */}
      <motion.div variants={fadeIn} initial="hidden" animate="visible" custom={3}>
        <Card>
          <CardHeader>
            <CardTitle>Where Your Money Goes</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <Treemap
                data={customTreemapData}
                dataKey="size"
                nameKey="name"
                content={<CustomTreemapContent x={0} y={0} width={0} height={0} name="" index={0} />}
                animationDuration={600}
              />
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* ── 5. Top Merchants ── */}
      <motion.div variants={fadeIn} initial="hidden" animate="visible" custom={4}>
        <Card>
          <CardHeader>
            <CardTitle>Top Merchants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockTopMerchants.map((merchant) => (
                <div key={merchant.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{merchant.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{merchant.transactions} txns</span>
                      <span className="tabular-nums font-medium">KES {merchant.total.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <motion.div
                      className="h-full rounded-full bg-primary"
                      initial={{ width: 0 }}
                      animate={{ width: `${merchant.percentage}%` }}
                      transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ── 6. Spending by Hour ── */}
      <motion.div variants={fadeIn} initial="hidden" animate="visible" custom={5}>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Clock className="size-4 text-muted-foreground" />
              <CardTitle>Spending by Hour</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer config={hourlyConfig} className="h-[260px] w-full">
              <BarChart data={mockHourlySpending}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="hour"
                  tickFormatter={(h) => `${h}:00`}
                  tickLine={false}
                  axisLine={false}
                  interval={3}
                />
                <YAxis tickLine={false} axisLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <ChartTooltip content={<ChartTooltipContent formatter={(v) => `KES ${Number(v).toLocaleString()}`} />} />
                <Bar dataKey="spending" fill="var(--color-spending)" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* ── 7. Daily Spending Heatmap ── */}
      <motion.div variants={fadeIn} initial="hidden" animate="visible" custom={6}>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Hash className="size-4 text-muted-foreground" />
              <CardTitle>Daily Spending Heatmap</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="grid grid-cols-7 gap-1.5">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                  <div key={day} className="text-center text-xs font-medium text-muted-foreground">
                    {day}
                  </div>
                ))}
                {mockDailyHeatmap.map((cell, i) => {
                  const intensity = cell.amount / heatmapMax
                  return (
                    <motion.div
                      key={i}
                      className="aspect-square rounded-md transition-colors hover:ring-2 hover:ring-primary/30"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: i * 0.008, duration: 0.25 }}
                      style={{
                        backgroundColor: `hsl(142, 50%, ${30 + (1 - intensity) * 40}%)`,
                        opacity: 0.25 + intensity * 0.75,
                      }}
                      title={`${cell.day} Week ${cell.week + 1}: KES ${cell.amount.toLocaleString()}`}
                    />
                  )
                })}
              </div>
              <div className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
                <span>Less</span>
                {[0.2, 0.4, 0.6, 0.8, 1.0].map((v) => (
                  <div
                    key={v}
                    className="size-3 rounded-sm"
                    style={{
                      backgroundColor: `hsl(142, 50%, ${30 + (1 - v) * 40}%)`,
                      opacity: 0.25 + v * 0.75,
                    }}
                  />
                ))}
                <span>More</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ── 8. Category Analytics Grid ── */}
      <motion.div variants={fadeIn} initial="hidden" animate="visible" custom={7}>
        <h2 className="font-heading text-lg font-semibold tracking-tight">Category Analytics</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {mockSpendingByCategory.map((cat, i) => {
            const Icon = CATEGORY_ICONS[cat.name] ?? MoreHorizontal
            const trend = CATEGORY_TRENDS[cat.name]
            const count = CATEGORY_COUNTS[cat.name] ?? 0
            return (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + i * 0.06, duration: 0.3 }}
              >
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="flex size-10 items-center justify-center rounded-lg"
                          style={{ backgroundColor: `${cat.color.replace(")", ", 0.15)")}` }}
                        >
                          <Icon className="size-5 text-current" />
                        </div>
                        <div>
                          <p className="text-sm font-medium leading-none">{cat.name}</p>
                          <p className="mt-1 text-xs text-muted-foreground">{count} transactions</p>
                        </div>
                      </div>
                      {trend && (
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            trend.direction === "down"
                              ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                              : "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300"
                          }`}
                        >
                          {trend.direction === "down" ? (
                            <TrendingDown className="mr-0.5 size-3" />
                          ) : (
                            <TrendingUp className="mr-0.5 size-3" />
                          )}
                          {trend.value}%
                        </Badge>
                      )}
                    </div>
                    <div className="mt-4">
                      <p className="font-heading text-2xl font-semibold tabular-nums">
                        KES {cat.value.toLocaleString()}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {cat.percentage}% of total spend
                      </p>
                    </div>
                    <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${cat.percentage}%`, backgroundColor: cat.color }}
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* ── 9. Merchant Analytics ── */}
      <motion.div variants={fadeIn} initial="hidden" animate="visible" custom={8}>
        <h2 className="font-heading text-lg font-semibold tracking-tight">Merchant Analytics</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {mockTopMerchants.slice(0, 8).map((merchant, i) => (
            <motion.div
              key={merchant.name}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + i * 0.05, duration: 0.3 }}
            >
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
                      <Store className="size-4 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{merchant.name}</p>
                      <p className="text-xs text-muted-foreground">{merchant.transactions} transactions</p>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Total spent</span>
                      <span className="text-sm font-semibold tabular-nums">KES {merchant.total.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Share</span>
                      <span className="text-sm tabular-nums text-muted-foreground">{merchant.percentage}%</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${merchant.percentage}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
