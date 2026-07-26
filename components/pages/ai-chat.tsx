"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Bot, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { mockChatResponses } from "@/lib/mock-data"
import type { ChatMessage } from "@/lib/types"

const suggestedPrompts = [
  "How much did I spend on food this month?",
  "Compare my spending between June and July",
  "What's my biggest expense?",
  "Show me transactions above KES 5,000",
]

export function AIChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "0",
      role: "assistant",
      content: "Hi! I'm your MPESA AI assistant. Ask me anything about your spending, transactions, or financial health.",
      timestamp: new Date().toISOString(),
    },
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const counterRef = useRef(0)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

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
    }, 800)
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col">
      <ScrollArea className="flex-1 pr-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${
                msg.role === "user" ? "justify-end" : ""
              }`}
            >
              {msg.role === "assistant" && (
                <Avatar className="size-8 shrink-0">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <Bot className="size-4" />
                  </AvatarFallback>
                </Avatar>
              )}
              <div
                className={`max-w-[80%] rounded-lg px-4 py-3 text-sm ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>
              </div>
              {msg.role === "user" && (
                <Avatar className="size-8 shrink-0">
                  <AvatarFallback>
                    <User className="size-4" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex gap-3">
              <Avatar className="size-8 shrink-0">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  <Bot className="size-4" />
                </AvatarFallback>
              </Avatar>
              <div className="rounded-lg bg-muted px-4 py-3 text-sm">
                <div className="flex gap-1">
                  <span className="animate-bounce">.</span>
                  <span className="animate-bounce [animation-delay:0.1s]">.</span>
                  <span className="animate-bounce [animation-delay:0.2s]">.</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {messages.length <= 1 && (
        <div className="mb-4">
          <p className="mb-2 text-xs text-muted-foreground">Suggested prompts</p>
          <div className="flex flex-wrap gap-2">
            {suggestedPrompts.map((prompt) => (
              <Button
                key={prompt}
                variant="outline"
                size="sm"
                onClick={() => sendMessage(prompt)}
              >
                {prompt}
              </Button>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <Textarea
          placeholder="Ask about your MPESA data"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              sendMessage(input)
            }
          }}
          rows={1}
          className="min-h-10 resize-none"
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
  )
}
