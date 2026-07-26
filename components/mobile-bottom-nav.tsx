"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import {
  LayoutDashboard,
  ArrowLeftRight,
  Upload,
  ChartColumn,
  Bot,
} from "lucide-react"

const bottomNavItems = [
  { to: "/", label: "Home", icon: LayoutDashboard },
  { to: "/transactions", label: "Txns", icon: ArrowLeftRight },
  { to: "/statements", label: "Upload", icon: Upload, primary: true },
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
              className="relative -mt-5 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 transition-transform active:scale-95"
            >
              <item.icon className="size-5" />
            </Link>
          )
        }

        return (
          <Link
            key={item.to}
            href={item.to}
            className="relative flex flex-col items-center gap-0.5 text-xs"
          >
            {isActive && (
              <motion.div
                layoutId="mobile-nav-indicator"
                className="absolute -top-2 h-0.5 w-6 rounded-full bg-primary"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <item.icon
              className={`size-5 transition-colors ${isActive ? "text-primary" : "text-muted-foreground"}`}
            />
            <span
              className={`transition-colors ${isActive ? "text-primary font-medium" : "text-muted-foreground"}`}
            >
              {item.label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
