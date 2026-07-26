"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Bot, User } from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { motion, AnimatePresence } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { mockChatResponses } from "@/lib/mock-data"
import type { ChatMessage } from "@/lib/types"

const suggestedPrompts = [
  {
    title: "Food spending",
    prompt: "How much did I spend on food?",
    description: "Break down your food & dining expenses",
  },
  {
    title: "Large transactions",
    prompt: "Show transactions above KES 10,000",
    description: "Find all transactions over KES 10,000",
  },
  {
    title: "Monthly comparison",
    prompt: "Compare June and July",
    description: "Side-by-side month comparison",
  },
  {
    title: "Top merchant",
    prompt: "Which merchant received the most money?",
    description: "Your highest spending merchant",
  },
]

export function AIChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const counterRef = useRef(0)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, loading])

  const sendMessage = (text: string) => {
    if (!text.trim() || loading) return

    const id = `msg-${++counterRef.current}`
    const userMsg: ChatMessage = {
      id,
      role: "user",
      content: text.trim(),
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMsg])
    setInput("")
    setLoading(true)

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
    }

    setTimeout(() => {
      const lower = text.toLowerCase()
      let response = mockChatResponses.default

      for (const [key, value] of Object.entries(mockChatResponses)) {
        if (key !== "default" && lower.includes(key)) {
          response = value
          break
        }
      }

      const assistantMsg: ChatMessage = {
        id: `${id}-reply`,
        role: "assistant",
        content: response,
        timestamp: new Date().toISOString(),
      }

      setMessages((prev) => [...prev, assistantMsg])
      setLoading(false)
    }, 1200)
  }

  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    const el = e.target
    el.style.height = "auto"
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col">
      <ScrollArea className="flex-1 pr-4" ref={scrollRef}>
        <div className="mx-auto max-w-3xl space-y-6">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="mb-2 flex size-12 items-center justify-center rounded-full bg-primary/10">
                <Bot className="size-6 text-primary" />
              </div>
              <h2 className="mb-1 text-lg font-semibold">MPESA AI Assistant</h2>
              <p className="mb-8 text-sm text-muted-foreground">
                Ask anything about your spending, transactions, or financial
                health.
              </p>
              <div className="grid w-full grid-cols-2 gap-3">
                {suggestedPrompts.map((s) => (
                  <Card
                    key={s.prompt}
                    className="cursor-pointer transition-colors hover:bg-muted/50"
                    onClick={() => sendMessage(s.prompt)}
                  >
                    <CardContent className="px-4 py-3">
                      <p className="text-sm font-medium">{s.title}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {s.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className={`flex gap-3 ${
                  msg.role === "user" ? "justify-end" : ""
                }`}
              >
                {msg.role === "assistant" && (
                  <Avatar className="mt-0.5 size-8 shrink-0">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <Bot className="size-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  {msg.role === "assistant" ? (
                    <div className="prose prose-sm dark:prose-invert max-w-none [&_table]:w-full [&_table]:border-collapse [&_th]:border [&_th]:border-border [&_th]:px-3 [&_th]:py-1.5 [&_th]:text-left [&_th]:text-xs [&_th]:font-medium [&_td]:border [&_td]:border-border [&_td]:px-3 [&_td]:py-1.5 [&_td]:text-xs [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-background/50 [&_code]:text-xs">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                  )}
                </div>
                {msg.role === "user" && (
                  <Avatar className="mt-0.5 size-8 shrink-0">
                    <AvatarFallback>
                      <User className="size-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          <AnimatePresence>
            {loading && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="flex gap-3"
              >
                <Avatar className="mt-0.5 size-8 shrink-0">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <Bot className="size-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex items-center rounded-2xl bg-muted px-4 py-3">
                  <span className="flex gap-1">
                    <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:0ms]" />
                    <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:150ms]" />
                    <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:300ms]" />
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </ScrollArea>

      <div className="mx-auto mt-4 w-full max-w-3xl">
        <div className="flex gap-2 rounded-xl border bg-background p-2 shadow-sm">
          <Textarea
            ref={textareaRef}
            placeholder="Ask about your MPESA data..."
            value={input}
            onChange={handleTextareaInput}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                sendMessage(input)
              }
            }}
            rows={1}
            className="min-h-10 max-h-[200px] resize-none border-0 bg-transparent shadow-none focus-visible:ring-0"
          />
          <Button
            size="icon"
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || loading}
          >
            <Send className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
