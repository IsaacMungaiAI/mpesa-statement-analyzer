"use client"

import { usePathname, useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import {
  Bell,
  ChevronDown,
  LogOut,
  Settings,
  User,
  Moon,
  Sun,
  Search,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"

const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/statements": "Statements",
  "/transactions": "Transactions",
  "/analytics": "Analytics",
  "/ai-insights": "AI Insights",
  "/ai-chat": "AI Chat",
  "/forecasts": "Forecasts",
  "/anomalies": "Anomalies",
  "/settings": "Settings",
}

const notifications = [
  { id: 1, text: "Statement processed", time: "2h ago", unread: true },
  { id: 2, text: "New AI insight generated", time: "5h ago", unread: true },
  { id: 3, text: "Large expense detected", time: "1d ago", unread: false },
]

export function TopBar() {
  const pathname = usePathname()
  const router = useRouter()
  const { theme, setTheme } = useTheme()

  const title =
    pageTitles[pathname] ||
    pathname
      .split("/")
      .pop()
      ?.replace(/-/g, " ")
      ?.replace(/\b\w/g, (c) => c.toUpperCase()) ||
    "Page"

  const unreadCount = notifications.filter((n) => n.unread).length

  const handleLogout = () => {
    localStorage.removeItem("token")
    router.push("/login")
  }

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="md:hidden" />
      <Separator orientation="vertical" className="mr-2 h-4 md:hidden" />

      <div className="flex items-center gap-2">
        <h1 className="text-lg font-semibold">{title}</h1>
      </div>

      <div className="ml-auto flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          className="hidden gap-2 text-muted-foreground md:flex"
          onClick={() => {
            document.dispatchEvent(
              new KeyboardEvent("keydown", { key: "k", ctrlKey: true })
            )
          }}
        >
          <Search className="size-4" />
          <span className="text-xs">Search...</span>
          <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground sm:inline-flex">
            Ctrl+K
          </kbd>
        </Button>

        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <Sun className="size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" className="relative" />}>
            <Bell />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                {unreadCount}
              </span>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="px-3 py-2">
              <p className="text-sm font-medium">Notifications</p>
            </div>
            <DropdownMenuSeparator />
            {notifications.map((n) => (
              <DropdownMenuItem key={n.id} className="flex items-start gap-3 py-3">
                <div className={`mt-0.5 size-2 shrink-0 rounded-full ${n.unread ? "bg-primary" : "bg-muted"}`} />
                <div className="flex-1">
                  <p className="text-sm">{n.text}</p>
                  <p className="text-xs text-muted-foreground">{n.time}</p>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="ghost" size="sm" className="gap-2" />}>
            <Avatar className="size-6">
              <AvatarImage src="" alt="User" />
              <AvatarFallback className="bg-primary text-primary-foreground text-xs">I</AvatarFallback>
            </Avatar>
            <span className="hidden md:inline">Account</span>
            <ChevronDown className="size-3" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => router.push("/settings")}>
              <User className="mr-2 size-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/settings")}>
              <Settings className="mr-2 size-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 size-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
