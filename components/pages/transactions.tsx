"use client"

import { useState, useMemo, useEffect, Fragment } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  createColumnHelper,
  flexRender,
  type SortingState,
  type PaginationState,
} from "@tanstack/react-table"
import {
  Search,
  Download,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronRight,
  Columns3,
} from "lucide-react"

import { cn } from "@/lib/utils"
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
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { mockTransactions } from "@/lib/mock-data"
import type { Transaction } from "@/lib/types"

const ROWS_PER_PAGE = 10
const columnHelper = createColumnHelper<Transaction>()

function formatKES(amount: number): string {
  return `KES ${Math.abs(amount).toLocaleString()}`
}

function exportCSV(data: Transaction[]) {
  const headers = [
    "Date",
    "Merchant",
    "Category",
    "Amount",
    "Balance",
    "Type",
    "Status",
    "Description",
    "Phone",
  ]
  const rows = data.map((t) => [
    t.date,
    t.merchant,
    t.category,
    t.amount.toString(),
    t.balance.toString(),
    t.type,
    t.status,
    t.description ?? "",
    t.phone ?? "",
  ])
  const csv = [headers, ...rows]
    .map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
    )
    .join("\n")
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = "transactions.csv"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

function SortIcon({ sorted }: { sorted: false | "asc" | "desc" }) {
  if (sorted === "asc") return <ArrowUp className="ml-1 size-3" />
  if (sorted === "desc") return <ArrowDown className="ml-1 size-3" />
  return <ArrowUpDown className="ml-1 size-3 opacity-50" />
}

function TableSkeleton({ colSpan }: { colSpan: number }) {
  return (
    <tbody>
      {Array.from({ length: ROWS_PER_PAGE }).map((_, i) => (
        <tr key={i} className="border-b last:border-0">
          {Array.from({ length: colSpan }).map((_, j) => (
            <td key={j} className="px-4 py-3">
              <Skeleton
                className={cn(
                  "h-4",
                  j === 0 ? "w-20" : j === 1 ? "w-36" : j === 2 ? "w-24" : j === 3 || j === 4 ? "w-20 ml-auto" : j === 5 ? "w-16" : "w-7"
                )}
              />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  )
}

function SortableHeader({
  column,
  children,
}: {
  column: { toggleSorting: (desc?: boolean) => void; getIsSorted: () => false | "asc" | "desc" }
  children: React.ReactNode
}) {
  return (
    <button
      className="inline-flex items-center cursor-pointer select-none"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      {children}
      <SortIcon sorted={column.getIsSorted()} />
    </button>
  )
}

export function TransactionsPage() {
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("all")
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnVisibility, setColumnVisibility] =
    useState<Record<string, boolean>>({})
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: ROWS_PER_PAGE,
  })
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }))
  }, [search, category])

  const categories = useMemo(
    () => Array.from(new Set(mockTransactions.map((t) => t.category))),
    []
  )

  const filteredData = useMemo(() => {
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
    return data
  }, [search, category])

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const columns = useMemo(
    () => [
      columnHelper.accessor("date", {
        header: ({ column }) => (
          <SortableHeader column={column}>Date</SortableHeader>
        ),
        cell: (info) => (
          <span className="tabular-nums">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor("merchant", {
        header: ({ column }) => (
          <SortableHeader column={column}>Merchant</SortableHeader>
        ),
        cell: (info) => <span className="font-medium">{info.getValue()}</span>,
      }),
      columnHelper.accessor("category", {
        header: ({ column }) => (
          <SortableHeader column={column}>Category</SortableHeader>
        ),
        cell: (info) => (
          <Badge variant="secondary" className="text-xs">
            {info.getValue()}
          </Badge>
        ),
      }),
      columnHelper.accessor("amount", {
        header: ({ column }) => (
          <SortableHeader column={column}>Amount</SortableHeader>
        ),
        cell: (info) => {
          const amount = info.getValue()
          return (
            <span
              className={cn(
                "text-right font-medium tabular-nums block",
                amount > 0 && "text-green-600 dark:text-green-500"
              )}
            >
              {amount > 0 ? "+" : "-"}
              {formatKES(amount)}
            </span>
          )
        },
      }),
      columnHelper.accessor("balance", {
        header: ({ column }) => (
          <SortableHeader column={column}>Balance</SortableHeader>
        ),
        cell: (info) => (
          <span className="tabular-nums text-muted-foreground text-right block">
            {formatKES(info.getValue())}
          </span>
        ),
      }),
      columnHelper.accessor("status", {
        header: "Status",
        cell: (info) => {
          const status = info.getValue()
          return (
            <Badge
              variant={
                status === "completed"
                  ? "outline"
                  : status === "pending"
                    ? "secondary"
                    : "destructive"
              }
              className={cn(
                "text-xs",
                status === "completed" &&
                  "border-green-500/50 text-green-600 dark:text-green-500",
                status === "pending" &&
                  "bg-yellow-500/10 text-yellow-600 dark:text-yellow-500"
              )}
            >
              {status}
            </Badge>
          )
        },
      }),
      columnHelper.display({
        id: "actions",
        enableHiding: false,
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row }) => {
          const isExpanded = expandedRows.has(row.original.id)
          return (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={(e) => {
                e.stopPropagation()
                toggleRow(row.original.id)
              }}
            >
              <motion.div
                animate={{ rotate: isExpanded ? 90 : 0 }}
                transition={{ duration: 0.15 }}
              >
                <ChevronRight className="size-4" />
              </motion.div>
            </Button>
          )
        },
      }),
    ],
    [expandedRows]
  )

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting, columnVisibility, pagination },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  const colSpan = table.getVisibleLeafColumns().length
  const totalPages = table.getPageCount()
  const currentPage = table.getState().pagination.pageIndex
  const startRow = currentPage * ROWS_PER_PAGE + 1
  const endRow = Math.min((currentPage + 1) * ROWS_PER_PAGE, filteredData.length)

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          All transactions across your statements.
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => exportCSV(filteredData)}
        >
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
        <Select
          value={category}
          onValueChange={(v) => setCategory(v ?? "all")}
        >
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

        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="outline" size="sm" />}>
            <Columns3 className="mr-2 size-4" />
            Columns
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {table
              .getAllLeafColumns()
              .filter((col) => col.getCanHide())
              .map((col) => (
                <DropdownMenuCheckboxItem
                  key={col.id}
                  checked={col.getIsVisible()}
                  onCheckedChange={(v) => col.toggleVisibility(!!v)}
                >
                  {typeof col.columnDef.header === "string"
                    ? col.columnDef.header
                    : col.id.charAt(0).toUpperCase() + col.id.slice(1)}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                {table.getHeaderGroups().map((hg) => (
                  <tr
                    key={hg.id}
                    className="border-b text-left text-muted-foreground"
                  >
                    {hg.headers.map((header) => (
                      <th
                        key={header.id}
                        className={cn(
                          "px-4 py-3 font-medium",
                          (header.column.id === "amount" ||
                            header.column.id === "balance") &&
                            "text-right",
                          header.column.id === "actions" && "w-12"
                        )}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              {loading ? (
                <TableSkeleton colSpan={colSpan} />
              ) : (
                <tbody>
                  {table.getRowModel().rows.length === 0 ? (
                    <tr>
                      <td
                        colSpan={colSpan}
                        className="px-4 py-12 text-center text-muted-foreground"
                      >
                        <div className="flex flex-col items-center gap-2">
                          <Search className="size-8 opacity-50" />
                          <p>No transactions found.</p>
                          <p className="text-xs">
                            Try adjusting your search or filter criteria.
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    table
                      .getRowModel()
                      .rows.map((row, index) => {
                        const isExpanded = expandedRows.has(row.original.id)
                        return (
                          <Fragment key={row.original.id}>
                            <motion.tr
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{
                                duration: 0.15,
                                delay: Math.min(index * 0.02, 0.3),
                              }}
                              className={cn(
                                "cursor-pointer border-b last:border-0 hover:bg-muted/50 transition-colors",
                                isExpanded && "bg-muted/30"
                              )}
                              onClick={() => toggleRow(row.original.id)}
                            >
                              {row
                                .getVisibleCells()
                                .map((cell) => (
                                  <td
                                    key={cell.id}
                                    className={cn(
                                      "px-4 py-3",
                                      (cell.column.id === "amount" ||
                                        cell.column.id === "balance") &&
                                        "text-right",
                                      cell.column.id === "actions" && "w-12"
                                    )}
                                  >
                                    {flexRender(
                                      cell.column.columnDef.cell,
                                      cell.getContext()
                                    )}
                                  </td>
                                ))}
                            </motion.tr>
                            <AnimatePresence>
                              {isExpanded && (
                                <motion.tr
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  exit={{ opacity: 0 }}
                                  className="border-b last:border-0 bg-muted/20"
                                >
                                  <td colSpan={colSpan} className="px-4 py-4">
                                    <motion.div
                                      initial={{ opacity: 0, y: -8 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      transition={{ duration: 0.2 }}
                                      className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4"
                                    >
                                      <div>
                                        <p className="text-xs text-muted-foreground mb-1">
                                          Description
                                        </p>
                                        <p>
                                          {row.original.description || "—"}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-xs text-muted-foreground mb-1">
                                          Phone
                                        </p>
                                        <p className="tabular-nums">
                                          {row.original.phone || "—"}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-xs text-muted-foreground mb-1">
                                          Type
                                        </p>
                                        <p className="capitalize">
                                          {row.original.type}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-xs text-muted-foreground mb-1">
                                          Statement
                                        </p>
                                        <p className="tabular-nums">
                                          {row.original.statement_id}
                                        </p>
                                      </div>
                                    </motion.div>
                                  </td>
                                </motion.tr>
                              )}
                            </AnimatePresence>
                          </Fragment>
                        )
                      })
                  )}
                </tbody>
              )}
            </table>
          </div>
        </CardContent>

        {!loading && filteredData.length > 0 && (
          <>
            <Separator />
            <div className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {startRow}–{endRow} of {filteredData.length}{" "}
                transactions
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {currentPage + 1} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  )
}
