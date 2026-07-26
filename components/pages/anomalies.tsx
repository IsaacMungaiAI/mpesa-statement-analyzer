"use client"

import { useMemo } from "react"
import { motion } from "framer-motion"
import {
  AlertTriangle,
  TrendingUp,
  Clock,
  Zap,
  ShieldAlert,
  Calendar,
  Inbox,
} from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"
import { mockAnomalies } from "@/lib/mock-data"

function formatKES(amount: number): string {
  return `KES ${amount.toLocaleString()}`
}

const typeIcons = {
  large_expense: TrendingUp,
  unusual_time: Clock,
  unusual_merchant: Zap,
  frequency_spike: AlertTriangle,
} as const

const typeLabels = {
  large_expense: "Large Expense",
  unusual_time: "Unusual Time",
  unusual_merchant: "Unusual Merchant",
  frequency_spike: "Frequency Spike",
} as const

const severityBadge = {
  high: "bg-red-500/10 text-red-600 border-red-500/20",
  medium: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  low: "bg-gray-500/10 text-gray-600 border-gray-500/20",
} as const

const severityLabel = {
  high: "High",
  medium: "Medium",
  low: "Low",
} as const

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4, ease: "easeOut" as const },
  }),
}

export function AnomaliesPage() {
  const highSeverity = useMemo(
    () => mockAnomalies.filter((a) => a.severity === "high"),
    []
  )

  const topAnomaly = useMemo(
    () => mockAnomalies.find((a) => a.severity === "high") ?? mockAnomalies[0],
    []
  )

  const thisMonthCount = useMemo(
    () =>
      mockAnomalies.filter((a) => {
        const d = new Date(a.date)
        const now = new Date()
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
      }).length,
    []
  )

  if (mockAnomalies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24">
        <div className="flex size-16 items-center justify-center rounded-2xl bg-green-500/10">
          <Inbox className="size-8 text-green-600" />
        </div>
        <div className="text-center">
          <h3 className="text-lg font-medium">No anomalies detected</h3>
          <p className="text-sm text-muted-foreground">
            Your transactions look normal. We&apos;ll keep monitoring.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">Anomalies</h2>
        <p className="text-sm text-muted-foreground">
          Suspicious or unusual transactions flagged by AI.
        </p>
      </div>

      {/* Alert Banner */}
      {topAnomaly && (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <Alert variant="destructive">
            <AlertTriangle className="size-4" />
            <AlertTitle>{topAnomaly.description}</AlertTitle>
            <AlertDescription>
              {topAnomaly.merchant} — {formatKES(topAnomaly.amount)} —{" "}
              {new Date(topAnomaly.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </AlertDescription>
          </Alert>
        </motion.div>
      )}

      {/* Summary Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <motion.div
          custom={0}
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
        >
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">
                    Total Anomalies
                  </p>
                  <p className="text-2xl font-bold">{mockAnomalies.length}</p>
                </div>
                <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                  <ShieldAlert className="size-5 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          custom={1}
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
        >
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">
                    High Severity
                  </p>
                  <p className="text-2xl font-bold text-red-600">
                    {highSeverity.length}
                  </p>
                </div>
                <div className="flex size-10 items-center justify-center rounded-lg bg-red-500/10">
                  <AlertTriangle className="size-5 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          custom={2}
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
        >
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">
                    This Month
                  </p>
                  <p className="text-2xl font-bold">{thisMonthCount}</p>
                </div>
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <Calendar className="size-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Separator />

      {/* Suspicious Transactions Table */}
      <motion.div
        custom={3}
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
      >
        <Card>
          <CardContent className="pt-5">
            <div className="mb-3">
              <h3 className="text-sm font-semibold">Suspicious Transactions</h3>
              <p className="text-xs text-muted-foreground">
                {mockAnomalies.length} transactions flagged for review
              </p>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Merchant</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockAnomalies.map((anomaly, i) => {
                  const Icon = typeIcons[anomaly.type]
                  return (
                    <motion.tr
                      key={anomaly.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 + i * 0.05 }}
                      className="border-b transition-colors hover:bg-muted/50"
                    >
                      <TableCell>
                        <span className="text-muted-foreground">
                          {new Date(anomaly.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted">
                            <Icon className="size-3.5 text-muted-foreground" />
                          </div>
                          <span className="font-medium">{anomaly.merchant}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="font-medium tabular-nums">
                          {formatKES(anomaly.amount)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {typeLabels[anomaly.type]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`text-xs font-semibold ${severityBadge[anomaly.severity]}`}
                        >
                          {severityLabel[anomaly.severity]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs text-muted-foreground line-clamp-1">
                          {anomaly.description}
                        </span>
                      </TableCell>
                    </motion.tr>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
