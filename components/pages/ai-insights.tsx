"use client"

import { useMemo } from "react"
import { motion } from "framer-motion"
import {
  Brain,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Info,
  ArrowRight,
} from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { mockInsights } from "@/lib/mock-data"

const typeConfig = {
  spending: { icon: TrendingUp, color: "text-green-600", bg: "bg-green-500/10" },
  saving: { icon: TrendingDown, color: "text-green-600", bg: "bg-green-500/10" },
  budget: { icon: Info, color: "text-blue-600", bg: "bg-blue-500/10" },
  trend: { icon: Brain, color: "text-blue-600", bg: "bg-blue-500/10" },
  anomaly: { icon: AlertTriangle, color: "text-red-600", bg: "bg-red-500/10" },
} as const

const severityStyles = {
  info: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  warning: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  success: "bg-green-500/10 text-green-600 border-green-500/20",
} as const

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
}

export function AIInsightsPage() {
  const insightsWithMeta = useMemo(
    () =>
      mockInsights.map((insight, i) => ({
        ...insight,
        confidence: 75 + (((i * 37 + 13) % 24)),
        timeAgo: getTimeAgo(insight.created_at),
      })),
    []
  )

  if (insightsWithMeta.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24">
        <div className="flex size-16 items-center justify-center rounded-2xl bg-muted">
          <Brain className="size-8 text-muted-foreground" />
        </div>
        <div className="text-center">
          <h3 className="text-lg font-medium">No insights yet</h3>
          <p className="text-sm text-muted-foreground">
            Upload a statement to receive personalized AI insights.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">AI Insights</h2>
        <p className="text-sm text-muted-foreground">
          Personalized intelligence from your spending.
        </p>
      </div>

      <Separator />

      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="grid gap-4 md:grid-cols-2"
      >
        {insightsWithMeta.map((insight) => {
          const { icon: Icon, color, bg } = typeConfig[insight.type]
          return (
            <motion.div key={insight.id} variants={item}>
              <Card className="transition-shadow hover:shadow-md">
                <CardContent className="pt-5">
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${bg}`}
                    >
                      <Icon className={`size-5 ${color}`} />
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-semibold leading-tight">
                            {insight.title}
                          </h3>
                          <Badge
                            variant="outline"
                            className={`shrink-0 text-[10px] font-semibold uppercase ${severityStyles[insight.severity]}`}
                          >
                            {insight.severity}
                          </Badge>
                        </div>
                      </div>

                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {insight.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span>{insight.timeAgo}</span>
                          <span className="inline-flex items-center gap-1">
                            <span
                              className={`inline-block size-1.5 rounded-full ${
                                insight.confidence >= 85
                                  ? "bg-green-500"
                                  : "bg-amber-500"
                              }`}
                            />
                            {insight.confidence}% confidence
                          </span>
                        </div>
                        <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs">
                          Learn more
                          <ArrowRight className="size-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </motion.div>
    </div>
  )
}

function getTimeAgo(dateStr: string): string {
  const now = new Date()
  const date = new Date(dateStr)
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffDays > 0) return `${diffDays}d ago`
  if (diffHours > 0) return `${diffHours}h ago`
  if (diffMins > 0) return `${diffMins}m ago`
  return "just now"
}
