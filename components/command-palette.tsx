"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  LayoutDashboard,
  FileText,
  ArrowLeftRight,
  ChartColumn,
  Brain,
  Bot,
  TrendingUp,
  TriangleAlert,
  Settings,
  Search,
} from "lucide-react"

import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

const routes = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/" },
  { label: "Statements", icon: FileText, href: "/statements" },
  { label: "Transactions", icon: ArrowLeftRight, href: "/transactions" },
  { label: "Analytics", icon: ChartColumn, href: "/analytics" },
  { label: "AI Insights", icon: Brain, href: "/ai-insights" },
  { label: "AI Chat", icon: Bot, href: "/ai-chat" },
  { label: "Forecasts", icon: TrendingUp, href: "/forecasts" },
  { label: "Anomalies", icon: TriangleAlert, href: "/anomalies" },
  { label: "Settings", icon: Settings, href: "/settings" },
]

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const router = useRouter()

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((o) => !o)
      }
    }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [])

  const filtered = routes.filter((r) =>
    r.label.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="gap-0 p-0 overflow-hidden max-w-md">
        <div className="flex items-center border-b px-3">
          <Search className="size-4 shrink-0 text-muted-foreground" />
          <input
            placeholder="Search pages..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent px-3 py-3 text-sm outline-none placeholder:text-muted-foreground"
            autoFocus
          />
          <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground sm:flex">
            ESC
          </kbd>
        </div>
        <div className="max-h-80 overflow-y-auto p-1">
          {filtered.length === 0 && (
            <p className="p-4 text-center text-sm text-muted-foreground">No results found.</p>
          )}
          {filtered.map((route) => (
            <button
              key={route.href}
              onClick={() => {
                router.push(route.href)
                setOpen(false)
                setQuery("")
              }}
              className={cn(
                "flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm outline-none",
                "hover:bg-accent hover:text-accent-foreground",
                "transition-colors"
              )}
            >
              <route.icon className="size-4 text-muted-foreground" />
              {route.label}
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
