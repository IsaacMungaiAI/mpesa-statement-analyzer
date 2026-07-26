import type {
  DashboardStats,
  SpendingByCategory,
  MonthlyCashFlow,
  BalanceTrend,
  SpendingTrend,
  TopMerchant,
  HourlySpending,
  DailyHeatmap,
  Forecast,
  Anomaly,
  AIInsight,
  Transaction,
  Statement,
} from "./types"

export const CATEGORIES: { name: string; color: string }[] = [
  { name: "Food & Dining", color: "hsl(var(--chart-1))" },
  { name: "Transport", color: "hsl(var(--chart-2))" },
  { name: "Bills & Utilities", color: "hsl(var(--chart-3))" },
  { name: "Shopping", color: "hsl(var(--chart-4))" },
  { name: "Airtime & Data", color: "hsl(var(--chart-5))" },
  { name: "Other", color: "hsl(var(--muted-foreground))" },
]

export const mockDashboardStats: DashboardStats = {
  total_income: 84500,
  total_expenses: 51200,
  total_fees: 1840,
  net_cash_flow: 33300,
  current_balance: 47680,
  transaction_count: 127,
  savings_rate: 39.4,
  avg_daily_spend: 1651,
}

export const mockSpendingByCategory: SpendingByCategory[] = [
  { name: "Food & Dining", value: 14200, color: "hsl(var(--chart-1))", percentage: 27.7 },
  { name: "Transport", value: 8600, color: "hsl(var(--chart-2))", percentage: 16.8 },
  { name: "Bills & Utilities", value: 11300, color: "hsl(var(--chart-3))", percentage: 22.1 },
  { name: "Shopping", value: 9400, color: "hsl(var(--chart-4))", percentage: 18.4 },
  { name: "Airtime & Data", value: 4700, color: "hsl(var(--chart-5))", percentage: 9.2 },
  { name: "Other", value: 3000, color: "hsl(var(--muted-foreground))", percentage: 5.8 },
]

export const mockMonthlyCashFlow: MonthlyCashFlow[] = [
  { month: "Jan", income: 72000, expenses: 48000, savings: 24000 },
  { month: "Feb", income: 74000, expenses: 51000, savings: 23000 },
  { month: "Mar", income: 76000, expenses: 53000, savings: 23000 },
  { month: "Apr", income: 78000, expenses: 49000, savings: 29000 },
  { month: "May", income: 80000, expenses: 55000, savings: 25000 },
  { month: "Jun", income: 76000, expenses: 53000, savings: 23000 },
  { month: "Jul", income: 84500, expenses: 51200, savings: 33300 },
]

export const mockBalanceTrend: BalanceTrend[] = [
  { date: "Jul 1", balance: 14380 },
  { date: "Jul 5", balance: 18920 },
  { date: "Jul 10", balance: 22450 },
  { date: "Jul 15", balance: 31200 },
  { date: "Jul 20", balance: 38900 },
  { date: "Jul 25", balance: 43100 },
  { date: "Jul 31", balance: 47680 },
]

export const mockSpendingTrend: SpendingTrend[] = [
  { date: "Week 1", income: 21000, expenses: 12800, balance: 8200 },
  { date: "Week 2", income: 21500, expenses: 13400, balance: 8100 },
  { date: "Week 3", income: 22000, expenses: 14200, balance: 7800 },
  { date: "Week 4", income: 20000, expenses: 10800, balance: 9200 },
]

export const mockTopMerchants: TopMerchant[] = [
  { name: "Naivas Supermarket", total: 9800, transactions: 4, percentage: 19.1 },
  { name: "Java House", total: 6400, transactions: 3, percentage: 12.5 },
  { name: "Uber", total: 4200, transactions: 8, percentage: 8.2 },
  { name: "Safaricom Airtime", total: 3600, transactions: 6, percentage: 7.0 },
  { name: "KPLC Tokens", total: 3200, transactions: 2, percentage: 6.3 },
  { name: "M-Pesa Transfer", total: 8500, transactions: 12, percentage: 16.6 },
  { name: "Zuku Internet", total: 2400, transactions: 1, percentage: 4.7 },
  { name: "Other", total: 13100, transactions: 91, percentage: 25.6 },
]

export const mockHourlySpending: HourlySpending[] = Array.from({ length: 24 }, (_, i) => ({
  hour: i,
  spending: Math.round(
    i >= 7 && i <= 21
      ? Math.random() * 5000 + 1000
      : Math.random() * 800 + 100
  ),
}))

export const mockDailyHeatmap: DailyHeatmap[] = (() => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  const data: DailyHeatmap[] = []
  for (let week = 0; week < 7; week++) {
    for (let day = 0; day < 7; day++) {
      data.push({
        day: days[day],
        week,
        amount: Math.round(Math.random() * 5000 + 500),
      })
    }
  }
  return data
})()

export const mockForecast: Forecast[] = [
  { month: "Aug", predicted: 48000, lower_bound: 42000, upper_bound: 54000, actual: undefined },
  { month: "Sep", predicted: 52000, lower_bound: 44000, upper_bound: 60000, actual: undefined },
  { month: "Oct", predicted: 49000, lower_bound: 39000, upper_bound: 59000, actual: undefined },
]

export const mockAnomalies: Anomaly[] = [
  {
    id: "1",
    transaction_id: "t1",
    type: "large_expense",
    severity: "high",
    description: "Unusually large transfer of KES 10,000 detected",
    amount: 10000,
    date: "2025-07-20",
    merchant: "M-Pesa Transfer - John",
    created_at: "2025-07-20T14:30:00Z",
  },
  {
    id: "2",
    transaction_id: "t2",
    type: "frequency_spike",
    severity: "medium",
    description: "Transport spending increased 34% compared to last month",
    amount: 8600,
    date: "2025-07-18",
    merchant: "Uber",
    created_at: "2025-07-18T10:15:00Z",
  },
  {
    id: "3",
    transaction_id: "t3",
    type: "unusual_time",
    severity: "low",
    description: "Transaction at unusual hour: 2:30 AM",
    amount: 1500,
    date: "2025-07-15",
    merchant: "Safaricom Airtime",
    created_at: "2025-07-15T02:30:00Z",
  },
]

export const mockInsights: AIInsight[] = [
  {
    id: "1",
    type: "spending",
    title: "Food spending increased 11%",
    description: "Your food and dining expenses have increased by 11% compared to last month. Consider meal prepping to reduce costs.",
    severity: "warning",
    created_at: "2025-07-22T09:00:00Z",
  },
  {
    id: "2",
    type: "saving",
    title: "Transport spending dropped 34%",
    description: "Great job! Your transport expenses dropped significantly. You saved approximately KES 4,400 compared to last month.",
    severity: "success",
    created_at: "2025-07-22T08:00:00Z",
  },
  {
    id: "3",
    type: "trend",
    title: "July statement is ready",
    description: "Your July MPesa statement has been processed. You have 127 transactions totaling KES 51,200 in expenses.",
    severity: "info",
    created_at: "2025-07-21T16:00:00Z",
  },
  {
    id: "4",
    type: "budget",
    title: "Savings rate improved",
    description: "Your savings rate improved to 39.4% this month, up from 30.3% last month. Keep up the good work!",
    severity: "success",
    created_at: "2025-07-21T10:00:00Z",
  },
]

export const mockTransactions: Transaction[] = [
  { id: "1", date: "2025-07-21", merchant: "Naivas Supermarket", category: "Shopping", amount: -3200, balance: 47680, type: "expense", status: "completed", statement_id: "s1" },
  { id: "2", date: "2025-07-21", merchant: "Java House", category: "Food & Dining", amount: -1820, balance: 50880, type: "expense", status: "completed", statement_id: "s1" },
  { id: "3", date: "2025-07-20", merchant: "M-Pesa Transfer - John", category: "Transfer", amount: -10000, balance: 52700, type: "transfer", status: "completed", statement_id: "s1" },
  { id: "4", date: "2025-07-20", merchant: "Salary - Acme Corp", category: "Salary", amount: 84500, balance: 62700, type: "income", status: "completed", statement_id: "s1" },
  { id: "5", date: "2025-07-19", merchant: "Uber", category: "Transport", amount: -640, balance: -21800, type: "expense", status: "completed", statement_id: "s1" },
  { id: "6", date: "2025-07-19", merchant: "Safaricom Airtime", category: "Airtime & Data", amount: -500, balance: -21160, type: "expense", status: "completed", statement_id: "s1" },
  { id: "7", date: "2025-07-18", merchant: "KPLC Tokens", category: "Bills & Utilities", amount: -2100, balance: -20660, type: "expense", status: "completed", statement_id: "s1" },
  { id: "8", date: "2025-07-18", merchant: "Zuku Internet", category: "Bills & Utilities", amount: -2400, balance: -18560, type: "expense", status: "completed", statement_id: "s1" },
  { id: "9", date: "2025-07-17", merchant: "Naivas Supermarket", category: "Food & Dining", amount: -2800, balance: -16160, type: "expense", status: "completed", statement_id: "s1" },
  { id: "10", date: "2025-07-16", merchant: "Uber", category: "Transport", amount: -480, balance: -13360, type: "expense", status: "completed", statement_id: "s1" },
  { id: "11", date: "2025-07-15", merchant: "Safaricom Airtime", category: "Airtime & Data", amount: -300, balance: -12880, type: "expense", status: "completed", statement_id: "s1" },
  { id: "12", date: "2025-07-14", merchant: "Naivas Supermarket", category: "Food & Dining", amount: -1900, balance: -12580, type: "expense", status: "completed", statement_id: "s1" },
]

export const mockStatements: Statement[] = [
  {
    id: "s1",
    filename: "mpesa_statement_jul_2025.pdf",
    upload_date: "2025-07-22T10:00:00Z",
    status: "completed",
    transaction_count: 127,
    period_start: "2025-07-01",
    period_end: "2025-07-31",
    file_size: 245000,
    password_protected: true,
  },
  {
    id: "s2",
    filename: "mpesa_statement_jun_2025.pdf",
    upload_date: "2025-06-30T14:00:00Z",
    status: "completed",
    transaction_count: 112,
    period_start: "2025-06-01",
    period_end: "2025-06-30",
    file_size: 198000,
    password_protected: true,
  },
]

export const mockChatResponses: Record<string, string> = {
  food: "You spent **KES 14,200** on Food & Dining this month -- 28% of your total spend. The largest portion went to supermarket groceries.",
  "10,000": "Found **1 transaction** above KES 10,000: Funds Transfer - John -- KES 10,000 -- Jul 20",
  compare: "**June vs July** comparison:\n| Metric | June | July | Change |\n|---|---|---|---|\n| Income | KES 76,000 | KES 84,500 | +11% |\n| Expenses | KES 53,000 | KES 51,200 | -3% |\n| Savings | KES 23,000 | KES 33,300 | +45% |",
  merchant: "**Naivas Supermarket** received the most money this month -- KES 9,800 across 4 transactions.",
  default: "I can help you analyze your M-Pesa data. Try asking about your spending categories, compare months, or find specific transactions.",
}
