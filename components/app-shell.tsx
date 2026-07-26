"use client"

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { TopBar } from "@/components/top-bar"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"
import { CommandPalette } from "@/components/command-palette"

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden bg-background">
        <AppSidebar />
        <SidebarInset className="flex flex-1 flex-col overflow-hidden">
          <TopBar />
          <main className="flex-1 overflow-y-auto p-4 pb-20 lg:p-6 lg:pb-6">
            {children}
          </main>
        </SidebarInset>
        <MobileBottomNav />
        <CommandPalette />
      </div>
    </SidebarProvider>
  )
}
