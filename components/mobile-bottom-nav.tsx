"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  ArrowLeftRight,
  FileText,
  ChartColumn,
  Bot,
} from "lucide-react"

const bottomNavItems = [
  { to: "/", label: "Home", icon: LayoutDashboard },
  { to: "/transactions", label: "Txns", icon: ArrowLeftRight },
  { to: "/statements", label: "Upload", icon: FileText, primary: true },
  { to: "/analytics", label: "Stats", icon: ChartColumn },
  { to: "/ai-chat", label: "AI", icon: Bot },
]

export function MobileBottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex h-16 items-center justify-around border-t bg-background/90 backdrop-blur-xl lg:hidden">
      {bottomNavItems.map((item) => {
        const isActive =
          item.to === "/"
            ? pathname === "/"
            : pathname.startsWith(item.to)

        if (item.primary) {
          return (
            <Link
              key={item.to}
              href={item.to}
              className="flex h-11 w-11 -translate-y-3 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30"
            >
              <item.icon className="size-5" />
            </Link>
          )
        }

        return (
          <Link
            key={item.to}
            href={item.to}
            className={`flex flex-col items-center gap-0.5 text-xs ${
              isActive ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <item.icon className="size-5" />
            <span>{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
