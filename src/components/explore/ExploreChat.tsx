
import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Send } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from '@/components/ui/use-toast'
import { supabase } from '@/integrations/supabase/client'
import type { ExploreCard } from '@/hooks/useExploreCards'

interface ExploreChatProps {
  card: ExploreCard
}

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export const ExploreChat = ({ card }: ExploreChatProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput('')
    setIsLoading(true)

    // Add user message to chat
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])

    try {
      const context = `Context: The user is looking at a flashcard with the following content:
Front: ${card.front_content}
Back: ${card.back_content}
Topic: ${card.interest}

The user's question is: ${userMessage}`

      const { data, error } = await supabase.functions.invoke('explore-chat', {
        body: { context }
      })

      if (error) throw error

      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.answer 
      }])
    } catch (error) {
      console.error('Error:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to get response. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Ask Follow-up Questions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-4">
            {messages.map((message, i) => (
              <div
                key={i}
                className={`p-3 rounded-lg ${
                  message.role === 'user' 
                    ? 'bg-primary text-primary-foreground ml-12' 
                    : 'bg-muted mr-12'
                }`}
              >
                {message.content}
              </div>
            ))}
          </div>

          <form onSubmit={sendMessage} className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question about this flashcard..."
              className="min-h-[60px]"
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading} className="self-end">
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  )
}
