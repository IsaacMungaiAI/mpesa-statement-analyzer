"use client"

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { TopBar } from "@/components/top-bar"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"
import { CommandPalette } from "@/components/command-palette"

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <TopBar />
          <main className="flex-1 overflow-y-auto p-4 pb-20 lg:p-6 lg:pb-6">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
      <MobileBottomNav />
      <CommandPalette />
    </>
  )
}
