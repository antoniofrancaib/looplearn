
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, RefreshCw, BookmarkPlus } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/components/ui/use-toast"
import { motion } from "framer-motion"
import { Interest } from "@/types/interests"
import { Flashcard } from "@/components/Flashcard"
import { useState } from "react"

interface ExploreCard {
  id: string
  interest: Interest
  front_content: string
  back_content: string
  saved: boolean
}

const Explore = () => {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [selectedCard, setSelectedCard] = useState<string | null>(null)

  // Fetch user's interests
  const { data: interests, isLoading: loadingInterests } = useQuery({
    queryKey: ['user-interests'],
    queryFn: async () => {
      const { data: userInterests, error } = await supabase
        .from('user_interests')
        .select('interest')
      if (error) throw error
      return userInterests.map(ui => ui.interest) as Interest[]
    },
  })

  // Fetch explore cards
  const { data: exploreCards, isLoading: loadingCards } = useQuery({
    queryKey: ['explore-cards'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('explore_cards')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      return data as ExploreCard[]
    },
  })

  // Generate new cards mutation
  const generateMutation = useMutation({
    mutationFn: async (interest: Interest) => {
      const response = await supabase.functions.invoke('generate-explore-cards', {
        body: { interest, count: 3 },
      })
      if (response.error) throw response.error
      
      const { data: { cards } } = response
      
      // Insert generated cards into the database
      const { error } = await supabase.from('explore_cards').insert(
        cards.map((card: any) => ({
          interest,
          front_content: card.front,
          back_content: card.back,
        }))
      )
      if (error) throw error
      
      // Refresh the cards list
      queryClient.invalidateQueries({ queryKey: ['explore-cards'] })
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error generating cards",
        description: error.message,
      })
    },
    onSuccess: () => {
      toast({
        title: "New cards generated!",
        description: "Fresh flashcards have been added to your explore feed.",
      })
    },
  })

  // Save card to a deck mutation
  const saveMutation = useMutation({
    mutationFn: async (card: ExploreCard) => {
      const { error } = await supabase
        .from('explore_cards')
        .update({ saved: true })
        .eq('id', card.id)
      if (error) throw error
      
      // Add card to user's deck
      const { error: cardError } = await supabase
        .from('cards')
        .insert({
          front_content: card.front_content,
          back_content: card.back_content,
          // For now, save to a default deck - you might want to let users choose a deck
          deck_id: 'default-deck-id',
        })
      if (cardError) throw cardError
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error saving card",
        description: error.message,
      })
    },
    onSuccess: () => {
      toast({
        title: "Card saved!",
        description: "The flashcard has been added to your deck.",
      })
      queryClient.invalidateQueries({ queryKey: ['explore-cards'] })
    },
  })

  if (loadingInterests) {
    return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>
  }

  if (!interests?.length) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Select Your Interests</h2>
        <p>Please select some interests on the interests page to see personalized flashcards.</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
          Explore
        </h1>
        <div className="flex gap-2">
          {interests.map((interest) => (
            <Button
              key={interest}
              variant="outline"
              className="bg-white/50 backdrop-blur-sm"
              onClick={() => generateMutation.mutate(interest)}
              disabled={generateMutation.isPending}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${generateMutation.isPending ? 'animate-spin' : ''}`} />
              Generate {interest}
            </Button>
          ))}
        </div>
      </div>

      <motion.div layout className="grid gap-6">
        {loadingCards ? (
          <div className="flex justify-center p-8">
            <Loader2 className="animate-spin" />
          </div>
        ) : (
          exploreCards?.map((card) => (
            <motion.div
              key={card.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Topic: {card.interest}
                  </CardTitle>
                  <Button
                    size="sm"
                    variant="ghost"
                    disabled={card.saved || saveMutation.isPending}
                    onClick={() => saveMutation.mutate(card)}
                  >
                    <BookmarkPlus className={`h-4 w-4 ${card.saved ? 'fill-current' : ''}`} />
                  </Button>
                </CardHeader>
                <CardContent>
                  <Flashcard
                    front={card.front_content}
                    back={card.back_content}
                    onDifficultySelect={() => {}} // Not used in explore mode
                  />
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </motion.div>
    </div>
  )
}

export default Explore
