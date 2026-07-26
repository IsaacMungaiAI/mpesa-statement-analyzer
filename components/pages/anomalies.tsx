"use client"

import { AlertTriangle, TrendingUp, Clock, Zap } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { mockAnomalies } from "@/lib/mock-data"

const typeIcons = {
  large_expense: TrendingUp,
  unusual_time: Clock,
  unusual_merchant: Zap,
  frequency_spike: AlertTriangle,
}

const severityBadge = {
  high: "destructive",
  medium: "secondary",
  low: "outline",
} as const

const typeLabels = {
  large_expense: "Large Expense",
  unusual_time: "Unusual Time",
  unusual_merchant: "Unusual Merchant",
  frequency_spike: "Frequency Spike",
}

export function AnomaliesPage() {
  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Suspicious or unusual transactions flagged by AI.
      </p>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-4">
            <p className="text-xs text-muted-foreground">Total Anomalies</p>
            <p className="text-2xl font-bold">{mockAnomalies.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-xs text-muted-foreground">High Severity</p>
            <p className="text-2xl font-bold text-red-600">
              {mockAnomalies.filter((a) => a.severity === "high").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-xs text-muted-foreground">This Month</p>
            <p className="text-2xl font-bold">{mockAnomalies.length}</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-3">
        {mockAnomalies.map((anomaly) => {
          const Icon = typeIcons[anomaly.type]
          return (
            <Card key={anomaly.id}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <Icon className="size-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-medium">{anomaly.description}</h3>
                      <Badge variant={severityBadge[anomaly.severity]} className="text-xs">
                        {anomaly.severity}
                      </Badge>
                    </div>
                    <div className="mt-1 flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{anomaly.merchant}</span>
                      <span>KES {anomaly.amount.toLocaleString()}</span>
                      <span>{new Date(anomaly.date).toLocaleDateString()}</span>
                      <Badge variant="outline" className="text-xs">
                        {typeLabels[anomaly.type]}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
