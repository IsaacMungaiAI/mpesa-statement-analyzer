"use client"

import { Brain, TrendingUp, TrendingDown, AlertTriangle, Info } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { mockInsights } from "@/lib/mock-data"

const typeIcons = {
  spending: TrendingUp,
  saving: TrendingDown,
  budget: Info,
  trend: Brain,
  anomaly: AlertTriangle,
}

const severityStyles = {
  info: "border-blue-200 bg-blue-50 text-blue-800",
  warning: "border-amber-200 bg-amber-50 text-amber-800",
  success: "border-green-200 bg-green-50 text-green-800",
}

export function AIInsightsPage() {
  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Personalized intelligence from your spending.
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        {mockInsights.map((insight) => {
          const Icon = typeIcons[insight.type]
          return (
            <Card key={insight.id}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <Icon className="size-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-medium">{insight.title}</h3>
                      <Badge
                        variant="outline"
                        className={`text-xs ${severityStyles[insight.severity]}`}
                      >
                        {insight.severity}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {insight.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(insight.created_at).toLocaleDateString()}
                    </p>
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
