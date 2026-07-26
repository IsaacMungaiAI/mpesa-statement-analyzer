export interface User {
  id: string
  email: string
  full_name: string
  avatar_url?: string
  is_verified: boolean
  created_at: string
}

export interface Statement {
  id: string
  filename: string
  upload_date: string
  status: "processing" | "completed" | "failed"
  transaction_count: number
  period_start?: string
  period_end?: string
  file_size: number
  password_protected: boolean
}

export interface Transaction {
  id: string
  date: string
  merchant: string
  category: TransactionCategory
  amount: number
  balance: number
  type: "income" | "expense" | "transfer" | "payment"
  status: "completed" | "pending" | "failed"
  description?: string
  phone?: string
  statement_id: string
}

export type TransactionCategory =
  | "Food & Dining"
  | "Transport"
  | "Bills & Utilities"
  | "Shopping"
  | "Airtime & Data"
  | "Financial Services"
  | "Transfer"
  | "Salary"
  | "Other"

export interface DashboardStats {
  total_income: number
  total_expenses: number
  total_fees: number
  net_cash_flow: number
  current_balance: number
  transaction_count: number
  savings_rate: number
  avg_daily_spend: number
}

export interface SpendingByCategory {
  name: string
  value: number
  color: string
  percentage: number
}

export interface MonthlyCashFlow {
  month: string
  income: number
  expenses: number
  savings: number
}

export interface BalanceTrend {
  date: string
  balance: number
}

export interface SpendingTrend {
  date: string
  income: number
  expenses: number
  balance: number
}

export interface TopMerchant {
  name: string
  total: number
  transactions: number
  percentage: number
}

export interface HourlySpending {
  hour: number
  spending: number
}

export interface DailyHeatmap {
  day: string
  week: number
  amount: number
}

export interface Forecast {
  month: string
  actual?: number
  predicted: number
  lower_bound: number
  upper_bound: number
}

export interface Anomaly {
  id: string
  transaction_id: string
  type: "large_expense" | "unusual_time" | "unusual_merchant" | "frequency_spike"
  severity: "high" | "medium" | "low"
  description: string
  amount: number
  date: string
  merchant: string
  created_at: string
}

export interface AIInsight {
  id: string
  type: "spending" | "saving" | "budget" | "trend" | "anomaly"
  title: string
  description: string
  severity: "info" | "warning" | "success"
  created_at: string
  data?: Record<string, unknown>
}

export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: string
}

export interface CategoryColor {
  [key: string]: string
}
