"use client"

import { useState, useMemo } from "react"
import { Search, Download, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { mockTransactions } from "@/lib/mock-data"

type SortField = "date" | "merchant" | "category" | "amount" | "balance"
type SortOrder = "asc" | "desc"

function formatKES(amount: number): string {
  return `KES ${Math.abs(amount).toLocaleString()}`
}

export function TransactionsPage() {
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("all")
  const [sortField, setSortField] = useState<SortField>("date")
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc")

  const categories = useMemo(
    () => Array.from(new Set(mockTransactions.map((t) => t.category))),
    []
  )

  const filtered = useMemo(() => {
    let data = [...mockTransactions]

    if (search) {
      const q = search.toLowerCase()
      data = data.filter(
        (t) =>
          t.merchant.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q)
      )
    }

    if (category !== "all") {
      data = data.filter((t) => t.category === category)
    }

    data.sort((a, b) => {
      let cmp = 0
      if (sortField === "date") cmp = a.date.localeCompare(b.date)
      else if (sortField === "merchant") cmp = a.merchant.localeCompare(b.merchant)
      else if (sortField === "category") cmp = a.category.localeCompare(b.category)
      else if (sortField === "amount") cmp = a.amount - b.amount
      else if (sortField === "balance") cmp = a.balance - b.balance
      return sortOrder === "asc" ? cmp : -cmp
    })

    return data
  }, [search, category, sortField, sortOrder])

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortOrder("desc")
    }
  }

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="ml-1 size-3 opacity-50" />
    return sortOrder === "asc" ? (
      <ArrowUp className="ml-1 size-3" />
    ) : (
      <ArrowDown className="ml-1 size-3" />
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          All transactions across your statements.
        </p>
        <Button variant="outline" size="sm">
          <Download className="mr-2 size-4" />
          Export CSV
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search transactions, merchants..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={category} onValueChange={(v) => setCategory(v ?? "all")}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  {(
                    [
                      { field: "date" as SortField, label: "Date" },
                      { field: "merchant" as SortField, label: "Merchant" },
                      { field: "category" as SortField, label: "Category" },
                      { field: "amount" as SortField, label: "Amount", align: "right" as const },
                      { field: "balance" as SortField, label: "Balance", align: "right" as const },
                    ]
                  ).map((col) => (
                    <th
                      key={col.field}
                      className={`cursor-pointer select-none px-4 py-3 font-medium hover:text-foreground ${
                        col.align === "right" ? "text-right" : ""
                      }`}
                      onClick={() => toggleSort(col.field)}
                    >
                      <span className="inline-flex items-center">
                        {col.label}
                        <SortIcon field={col.field} />
                      </span>
                    </th>
                  ))}
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((tx) => (
                  <tr key={tx.id} className="border-b last:border-0 hover:bg-muted/50">
                    <td className="px-4 py-3 tabular-nums">{tx.date}</td>
                    <td className="px-4 py-3 font-medium">{tx.merchant}</td>
                    <td className="px-4 py-3">
                      <Badge variant="secondary" className="text-xs">
                        {tx.category}
                      </Badge>
                    </td>
                    <td
                      className={`px-4 py-3 text-right font-medium tabular-nums ${
                        tx.amount > 0 ? "text-green-600" : ""
                      }`}
                    >
                      {tx.amount > 0 ? "+" : "-"}
                      {formatKES(tx.amount)}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">
                      {formatKES(tx.balance)}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={
                          tx.status === "completed"
                            ? "outline"
                            : tx.status === "pending"
                            ? "secondary"
                            : "destructive"
                        }
                        className="text-xs"
                      >
                        {tx.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                      No transactions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
