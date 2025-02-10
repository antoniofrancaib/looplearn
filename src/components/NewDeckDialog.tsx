
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
        description: "Your deck has been created with 10 AI-generated flashcards.",
      })

      onOpenChange(false)
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Deck</DialogTitle>
          <DialogDescription>
            Enter the details for your new flashcard deck. Our AI will generate 10 relevant cards automatically.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Spanish Vocabulary, JavaScript Basics"
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What would you like to learn? Be specific to help our AI create better flashcards."
                disabled={isLoading}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Deck"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
