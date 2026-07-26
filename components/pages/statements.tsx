"use client"

import { useState, useCallback } from "react"
import { CloudUpload, FileText, Trash2, CheckCircle2, AlertCircle, Loader2 } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { mockStatements } from "@/lib/mock-data"

export function StatementsPage() {
  const [dragOver, setDragOver] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [password, setPassword] = useState("")

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) {
      setUploading(true)
      setTimeout(() => setUploading(false), 2000)
    }
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploading(true)
      setTimeout(() => setUploading(false), 2000)
    }
  }, [])

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Upload your MPESA statements to unlock AI insights and analytics.
      </p>

      <Card>
        <CardContent className="pt-6">
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-colors ${
              dragOver
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25 hover:border-muted-foreground/50"
            }`}
          >
            {uploading ? (
              <Loader2 className="mb-4 size-12 text-muted-foreground animate-spin" />
            ) : (
              <CloudUpload className="mb-4 size-12 text-muted-foreground" />
            )}
            <p className="text-sm font-medium">
              {uploading ? "Processing statement..." : "Drop MPESA statement here"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Supports PDF & CSV -- Max 10MB
            </p>
            {!uploading && (
              <>
                <div className="mt-4 flex gap-2">
                  <Label htmlFor="file-upload">
                    <Button variant="outline">Browse File</Button>
                  </Label>
                  <input
                    id="file-upload"
                    type="file"
                    accept=".pdf,.csv"
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                </div>
                <div className="mt-4 w-full max-w-xs">
                  <Input
                    type="password"
                    placeholder="PDF password (if protected)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Uploaded Statements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockStatements.map((stmt) => (
              <div
                key={stmt.id}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                    <FileText className="size-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{stmt.filename}</p>
                    <p className="text-xs text-muted-foreground">
                      {stmt.transaction_count} transactions &middot;{" "}
                      {stmt.period_start && stmt.period_end
                        ? `${new Date(stmt.period_start).toLocaleDateString("en-US", { month: "short", year: "numeric" })} - ${new Date(stmt.period_end).toLocaleDateString("en-US", { month: "short", year: "numeric" })}`
                        : "Processing"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {stmt.status === "completed" ? (
                    <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
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
                  <Button variant="ghost" size="icon-sm">
                    <Trash2 className="size-4 text-muted-foreground" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
