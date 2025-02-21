import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/components/ui/use-toast"
import { Mic, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export function NewDeckDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // First, create the deck
      const { data: deck, error: deckError } = await supabase
        .from('decks')
        .insert({
          title,
          description,
          user_id: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single()

      if (deckError) throw deckError

      // Generate flashcards using OpenAI
      const { data: flashcardsData, error: aiError } = await supabase.functions
        .invoke('generate-flashcards', {
          body: { title, description }
        })

      if (aiError) throw aiError

      // Insert the generated cards
      if (flashcardsData.cards && Array.isArray(flashcardsData.cards)) {
        const cardsToInsert = flashcardsData.cards.map((card: any) => ({
          deck_id: deck.id,
          front_content: card.front_content,
          back_content: card.back_content,
          next_review_at: new Date(), // Set initial review date to now
          interval_days: 1, // Start with 1-day interval
          ease_factor: 2.5, // Default ease factor
        }))

        const { error: cardsError } = await supabase
          .from('cards')
          .insert(cardsToInsert)

        if (cardsError) throw cardsError
      } else {
        throw new Error('Invalid flashcards data received')
      }

      toast({
        title: "Success!",
        description: "Your deck has been created with AI-generated flashcards.",
      })

      onOpenChange(false)
      setTitle("")
      setDescription("")
    } catch (error: any) {
      console.error('Error creating deck:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to create deck. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const startRecording = async () => {
    try {
      setIsRecording(true)
      // Here you would implement actual voice recording
      // For now, we'll simulate it
      setTimeout(() => {
        setIsRecording(false)
        setIsProcessing(true)
        setTimeout(() => {
          setDescription("A deck with 20 Spanish vocabulary words for beginners")
          setIsProcessing(false)
        }, 1500)
      }, 2000)
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not access microphone. Please check permissions.",
        variant: "destructive",
      })
      setIsRecording(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Deck</DialogTitle>
          <DialogDescription>
            Enter the details for your new flashcard deck. Our AI will generate 10 relevant cards automatically.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Input
                placeholder="Deck Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="relative">
              <Textarea
                placeholder="Describe your deck (e.g., 'I want a deck with 20 Spanish vocab words')"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[100px] w-full pr-12"
              />
              <Button
                type="button"
                size="icon"
                className={`absolute right-2 top-2 bg-teal-500 hover:bg-teal-600 text-white ${
                  isRecording ? 'animate-pulse' : ''
                }`}
                onClick={startRecording}
                disabled={isRecording || isProcessing}
              >
                {isRecording ? (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    <Mic className="h-4 w-4" />
                  </motion.div>
                ) : isProcessing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Mic className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          <Button
            type="submit"
            className="w-full bg-teal-500 hover:bg-teal-600 text-white"
            disabled={isLoading || !title || !description}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Deck'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
