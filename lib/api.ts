import type {
  User,
  Statement,
  Transaction,
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
  ChatMessage,
} from "./types"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...((options?.headers as Record<string, string>) || {}),
  }

  // Don't set Content-Type for FormData
  if (options?.body instanceof FormData) {
    delete headers["Content-Type"]
  }

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers })

  if (res.status === 401) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token")
      window.location.href = "/login"
    }
    throw new Error("Unauthorized")
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: "Request failed" }))
    throw new Error(error.detail || "Request failed")
  }

  return res.json()
}

export const api = {
  auth: {
    login: (email: string, password: string) =>
      request<{ access_token: string; user: User }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }),
    register: (email: string, password: string, full_name: string) =>
      request<{ access_token: string; user: User }>("/auth/register", {
        method: "POST",
        body: JSON.stringify({ email, password, full_name }),
      }),
    me: () => request<User>("/auth/me"),
    logout: () => {
      localStorage.removeItem("token")
    },
  },

  statements: {
    list: () => request<Statement[]>("/statements"),
    upload: (file: File, password?: string) => {
      const formData = new FormData()
      formData.append("file", file)
      if (password) formData.append("password", password)
      return request<Statement>("/statements", { method: "POST", body: formData })
    },
    delete: (id: string) =>
      request<void>(`/statements/${id}`, { method: "DELETE" }),
  },

  transactions: {
    list: (params?: {
      skip?: number
      limit?: number
      category?: string
      search?: string
      sort_by?: string
      sort_order?: "asc" | "desc"
    }) => {
      const searchParams = new URLSearchParams()
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== "") {
            searchParams.set(key, String(value))
          }
        })
      }
      return request<Transaction[]>(`/transactions?${searchParams}`)
    },
  },

  analytics: {
    dashboard: () => request<DashboardStats>("/analytics/dashboard"),
    spendingByCategory: () => request<SpendingByCategory[]>("/analytics/spending-by-category"),
    monthlyCashFlow: () => request<MonthlyCashFlow[]>("/analytics/monthly-cash-flow"),
    balanceTrend: () => request<BalanceTrend[]>("/analytics/balance-trend"),
    spendingTrend: () => request<SpendingTrend[]>("/analytics/spending-trend"),
    topMerchants: () => request<TopMerchant[]>("/analytics/top-merchants"),
    hourlySpending: () => request<HourlySpending[]>("/analytics/hourly-spending"),
    dailyHeatmap: () => request<DailyHeatmap[]>("/analytics/daily-heatmap"),
  },

  forecasts: {
    get: () => request<Forecast[]>("/forecasts"),
  },

  anomalies: {
    list: () => request<Anomaly[]>("/anomalies"),
  },

  insights: {
    list: () => request<AIInsight[]>("/insights"),
  },

  chat: {
    send: (message: string) =>
      request<ChatMessage>("/chat", {
        method: "POST",
        body: JSON.stringify({ message }),
      }),
    history: () => request<ChatMessage[]>("/chat/history"),
  },
}
