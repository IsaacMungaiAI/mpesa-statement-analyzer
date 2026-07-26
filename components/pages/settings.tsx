"use client"

import { useState } from "react"
import { useTheme } from "next-themes"
import { motion } from "framer-motion"
import {
  Moon,
  Sun,
  Camera,
  Mail,
  User,
  Lock,
  Bell,
  Shield,
} from "lucide-react"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [name, setName] = useState("Isaac")
  const [email, setEmail] = useState("isaac@example.com")
  const [weeklyDigest, setWeeklyDigest] = useState(true)
  const [aiNotifications, setAiNotifications] = useState(true)
  const [anomalyAlerts, setAnomalyAlerts] = useState(true)

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <motion.p
        variants={item}
        className="text-sm text-muted-foreground"
      >
        Manage your account and preferences.
      </motion.p>

      <motion.div variants={item}>
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Your personal information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar size="lg">
                <AvatarFallback>
                  {name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <p className="text-sm font-medium">{name}</p>
                <p className="text-xs text-muted-foreground">{email}</p>
                <Button variant="outline" size="xs">
                  <Camera className="mr-1 size-3" />
                  Change Avatar
                </Button>
              </div>
            </div>
            <Separator />
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">
                  <User className="size-3.5" />
                  Full name
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">
                  <Mail className="size-3.5" />
                  Email address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <Button>Save changes</Button>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
            <CardDescription>Customize your experience</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {theme === "dark" ? (
                  <Moon className="size-5 text-muted-foreground" />
                ) : (
                  <Sun className="size-5 text-muted-foreground" />
                )}
                <div>
                  <p className="text-sm font-medium">Dark mode</p>
                  <p className="text-xs text-muted-foreground">
                    Toggle theme appearance
                  </p>
                </div>
              </div>
              <Switch
                checked={theme === "dark"}
                onCheckedChange={(checked) =>
                  setTheme(checked ? "dark" : "light")
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="size-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Weekly digest email</p>
                  <p className="text-xs text-muted-foreground">
                    Spending summary every Monday
                  </p>
                </div>
              </div>
              <Switch
                checked={weeklyDigest}
                onCheckedChange={setWeeklyDigest}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="size-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">
                    AI insight notifications
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Get notified when new insights are generated
                  </p>
                </div>
              </div>
              <Switch
                checked={aiNotifications}
                onCheckedChange={setAiNotifications}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="size-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Anomaly alerts</p>
                  <p className="text-xs text-muted-foreground">
                    Alert on suspicious transactions
                  </p>
                </div>
              </div>
              <Switch
                checked={anomalyAlerts}
                onCheckedChange={setAnomalyAlerts}
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <Card>
          <CardHeader>
            <CardTitle>Security</CardTitle>
            <CardDescription>Protect your account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Lock className="size-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Change password</p>
                  <p className="text-xs text-muted-foreground">
                    Last changed 3 months ago
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Update
              </Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="size-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Two-factor auth</p>
                  <p className="text-xs text-muted-foreground">
                    Add an extra layer of security
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" disabled>
                Coming Soon
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
