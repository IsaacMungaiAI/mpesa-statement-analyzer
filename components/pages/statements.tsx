"use client"

import { useState, useCallback, useEffect } from "react"
import { useDropzone } from "react-dropzone"
import { motion, AnimatePresence } from "framer-motion"
import {
  CloudUpload,
  FileText,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowLeft,
  TrendingUp,
  DollarSign,
  BarChart3,
  Sparkles,
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import { mockStatements, mockTransactions } from "@/lib/mock-data"
import type { Statement } from "@/lib/types"

const processingSteps = [
  { label: "Reading Statement", icon: FileText },
  { label: "Extracting Transactions", icon: BarChart3 },
  { label: "Generating Insights", icon: Sparkles },
]

export function StatementsPage() {
  const [password, setPassword] = useState("")
  const [statements, setStatements] = useState<Statement[]>(mockStatements)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [processingStep, setProcessingStep] = useState(0)
  const [processingProgress, setProcessingProgress] = useState(0)

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (!file) return
      const newStatement: Statement = {
        id: `s${Date.now()}`,
        filename: file.name,
        upload_date: new Date().toISOString(),
        status: "processing",
        transaction_count: 0,
        file_size: file.size,
        password_protected: !!password,
      }
      setStatements((prev) => [newStatement, ...prev])
      setProcessingStep(0)
      setProcessingProgress(0)
    },
    [password]
  )

  useEffect(() => {
    const processing = statements.find((s) => s.status === "processing")
    if (!processing) return
    let step = 0
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.random() * 15 + 5
      if (progress >= 100) {
        progress = 0
        step += 1
      }
      if (step >= processingSteps.length) {
        clearInterval(interval)
        setStatements((prev) =>
          prev.map((s) =>
            s.id === processing.id
              ? { ...s, status: "completed", transaction_count: 42 }
              : s
          )
        )
        setProcessingProgress(100)
        return
      }
      setProcessingStep(step)
      setProcessingProgress(Math.min(progress, 100))
    }, 400)
    return () => clearInterval(interval)
  }, [statements])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"], "text/csv": [".csv"] },
    maxSize: 10 * 1024 * 1024,
    maxFiles: 1,
  })

  const handleDelete = (id: string) => {
    setStatements((prev) => prev.filter((s) => s.id !== id))
    if (selectedId === id) setSelectedId(null)
  }

  const selectedStatement = statements.find((s) => s.id === selectedId)
  const statementTransactions = selectedStatement
    ? mockTransactions.filter((t) => t.statement_id === selectedStatement.id)
    : []

  if (selectedStatement) {
    const totalIncome = statementTransactions
      .filter((t) => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0)
    const totalExpenses = statementTransactions
      .filter((t) => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0)

    return (
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setSelectedId(null)}
          >
            <ArrowLeft className="size-4" />
          </Button>
          <div>
            <h2 className="text-lg font-semibold">
              {selectedStatement.filename}
            </h2>
            <p className="text-sm text-muted-foreground">
              {selectedStatement.transaction_count} transactions &middot;{" "}
              {selectedStatement.period_start && selectedStatement.period_end
                ? `${new Date(selectedStatement.period_start).toLocaleDateString("en-US", { month: "short", year: "numeric" })} - ${new Date(selectedStatement.period_end).toLocaleDateString("en-US", { month: "short", year: "numeric" })}`
                : "N/A"}
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="ai-summary">AI Summary</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-4">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  {
                    label: "Total Income",
                    value: `KES ${totalIncome.toLocaleString()}`,
                    icon: TrendingUp,
                    color: "text-green-600",
                  },
                  {
                    label: "Total Expenses",
                    value: `KES ${totalExpenses.toLocaleString()}`,
                    icon: DollarSign,
                    color: "text-red-600",
                  },
                  {
                    label: "Transactions",
                    value: String(selectedStatement.transaction_count),
                    icon: BarChart3,
                    color: "text-blue-600",
                  },
                  {
                    label: "File Size",
                    value: `${(selectedStatement.file_size / 1024).toFixed(0)} KB`,
                    icon: FileText,
                    color: "text-purple-600",
                  },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + i * 0.05 }}
                  >
                    <Card>
                      <CardContent className="flex items-center gap-3 pt-6">
                        <div
                          className={`flex size-10 items-center justify-center rounded-lg bg-muted ${stat.color}`}
                        >
                          <stat.icon className="size-5" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">
                            {stat.label}
                          </p>
                          <p className="text-lg font-semibold">{stat.value}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="transactions" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  {statementTransactions.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Merchant</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {statementTransactions.map((tx) => (
                          <TableRow key={tx.id}>
                            <TableCell>
                              {new Date(tx.date).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })}
                            </TableCell>
                            <TableCell className="font-medium">
                              {tx.merchant}
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary">{tx.category}</Badge>
                            </TableCell>
                            <TableCell
                              className={`text-right font-medium ${tx.amount > 0 ? "text-green-600" : "text-foreground"}`}
                            >
                              {tx.amount > 0 ? "+" : "-"}KES{" "}
                              {Math.abs(tx.amount).toLocaleString()}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="py-8 text-center text-sm text-muted-foreground">
                      No transactions found for this statement.
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="ai-summary" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="size-4 text-primary" />
                    AI Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-lg bg-muted/50 p-4">
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      Based on {selectedStatement.transaction_count} transactions
                      in this statement, your spending patterns show a
                      well-balanced portfolio. Food &amp; Dining accounts for the
                      largest expense category at 27.7%, followed by Bills &amp;
                      Utilities at 22.1%. Your savings rate of 39.4% is
                      significantly above the average, indicating strong
                      financial discipline.
                    </p>
                  </div>
                  <Separator />
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium">Key Highlights</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-green-600" />
                        <span>Savings rate improved to 39.4% from 30.3% last month</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-green-600" />
                        <span>Transport spending dropped 34% month-over-month</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertCircle className="mt-0.5 size-4 shrink-0 text-amber-600" />
                        <span>Food spending increased 11% — consider meal prepping</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <DollarSign className="mt-0.5 size-4 shrink-0 text-blue-600" />
                        <span>
                          Largest single transaction: KES 10,000 transfer
                        </span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="mt-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Spending by Category</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      { name: "Food & Dining", pct: 27.7, color: "bg-chart-1" },
                      { name: "Bills & Utilities", pct: 22.1, color: "bg-chart-3" },
                      { name: "Shopping", pct: 18.4, color: "bg-chart-4" },
                      { name: "Transport", pct: 16.8, color: "bg-chart-2" },
                      { name: "Airtime & Data", pct: 9.2, color: "bg-chart-5" },
                      { name: "Other", pct: 5.8, color: "bg-muted-foreground" },
                    ].map((cat) => (
                      <div key={cat.name} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{cat.name}</span>
                          <span className="text-muted-foreground">
                            {cat.pct}%
                          </span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${cat.pct}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className={`h-full rounded-full ${cat.color}`}
                          />
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Statement Info</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      { label: "Filename", value: selectedStatement.filename },
                      { label: "Status", value: selectedStatement.status },
                      {
                        label: "Transactions",
                        value: String(selectedStatement.transaction_count),
                      },
                      {
                        label: "File Size",
                        value: `${(selectedStatement.file_size / 1024).toFixed(0)} KB`,
                      },
                      {
                        label: "Password Protected",
                        value: selectedStatement.password_protected ? "Yes" : "No",
                      },
                      {
                        label: "Uploaded",
                        value: new Date(
                          selectedStatement.upload_date
                        ).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        }),
                      },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="flex items-center justify-between"
                      >
                        <span className="text-sm text-muted-foreground">
                          {item.label}
                        </span>
                        <span className="text-sm font-medium">{item.value}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    )
  }

  const isProcessing = statements.some((s) => s.status === "processing")

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Upload your MPESA statements to unlock AI insights and analytics.
      </p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card>
          <CardContent className="pt-6">
            <div
              {...getRootProps()}
              className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 transition-colors ${
                isDragActive
                  ? "border-primary bg-primary/5"
                  : "border-muted-foreground/25 hover:border-muted-foreground/50"
              }`}
            >
              <input {...getInputProps()} />
              {isProcessing ? (
                <div className="w-full max-w-md space-y-6">
                  <div className="flex flex-col items-center">
                    <Loader2 className="mb-4 size-12 animate-spin text-primary" />
                    <p className="text-sm font-medium">Processing statement...</p>
                  </div>
                  <div className="space-y-4">
                    {processingSteps.map((step, i) => {
                      const isActive = i === processingStep
                      const isDone = i < processingStep
                      return (
                        <motion.div
                          key={step.label}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="space-y-2"
                        >
                          <div className="flex items-center gap-2">
                            {isDone ? (
                              <CheckCircle2 className="size-4 text-green-600" />
                            ) : isActive ? (
                              <Loader2 className="size-4 animate-spin text-primary" />
                            ) : (
                              <step.icon className="size-4 text-muted-foreground/50" />
                            )}
                            <span
                              className={`text-sm ${isDone ? "text-green-600" : isActive ? "font-medium" : "text-muted-foreground/50"}`}
                            >
                              {step.label}
                            </span>
                          </div>
                          {isActive && (
                            <Progress
                              value={processingProgress}
                              className="w-full"
                            >
                              <div className="contents">
                                <span className="sr-only">{step.label}</span>
                              </div>
                            </Progress>
                          )}
                          {isDone && (
                            <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
                              <div className="h-full w-full rounded-full bg-green-600" />
                            </div>
                          )}
                        </motion.div>
                      )
                    })}
                  </div>
                </div>
              ) : (
                <>
                  <CloudUpload className="mb-4 size-12 text-muted-foreground" />
                  <p className="text-sm font-medium">
                    {isDragActive
                      ? "Release to upload"
                      : "Drop MPESA Statement Here"}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Supports PDF &amp; CSV &mdash; Max 10MB
                  </p>
                  <div className="mt-4 flex gap-2">
                    <Label htmlFor="file-upload">
                      <Button variant="outline" size="sm">
                        Browse File
                      </Button>
                    </Label>
                    <input
                      id="file-upload"
                      type="file"
                      accept=".pdf,.csv"
                      className="hidden"
                      {...getInputProps()}
                    />
                  </div>
                  <div className="mt-4 w-full max-w-xs">
                    <Input
                      type="password"
                      placeholder="PDF password (if protected)"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <Card>
        <CardHeader>
          <CardTitle>Uploaded Statements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {statements.map((stmt) => (
                <motion.div
                  key={stmt.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <button
                    type="button"
                    onClick={() => stmt.status === "completed" && setSelectedId(stmt.id)}
                    className="flex flex-1 items-center gap-3 text-left"
                    disabled={stmt.status !== "completed"}
                  >
                    <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                      <FileText className="size-5 text-muted-foreground" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {stmt.filename}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {stmt.transaction_count} transactions &middot;{" "}
                        {stmt.period_start && stmt.period_end
                          ? `${new Date(stmt.period_start).toLocaleDateString("en-US", { month: "short", year: "numeric" })} - ${new Date(stmt.period_end).toLocaleDateString("en-US", { month: "short", year: "numeric" })}`
                          : "Processing"}
                      </p>
                    </div>
                  </button>
                  <div className="flex items-center gap-2">
                    {stmt.status === "completed" ? (
                      <Badge
                        variant="outline"
                        className="border-green-200 bg-green-50 text-green-600"
                      >
                        <CheckCircle2 className="mr-1 size-3" />
                        Completed
                      </Badge>
                    ) : stmt.status === "processing" ? (
                      <Badge variant="outline">
                        <Loader2 className="mr-1 size-3 animate-spin" />
                        Processing
                      </Badge>
                    ) : (
                      <Badge variant="destructive">
                        <AlertCircle className="mr-1 size-3" />
                        Failed
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => handleDelete(stmt.id)}
                    >
                      <Trash2 className="size-4 text-muted-foreground" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
