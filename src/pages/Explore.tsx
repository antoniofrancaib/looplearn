
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, Plus } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/components/ui/use-toast"
import { motion, AnimatePresence } from "framer-motion"
import { Interest } from "@/types/interests"
import { Flashcard } from "@/components/Flashcard"
import { useState, useCallback } from "react"

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
  const [viewedCards, setViewedCards] = useState<Set<string>>(new Set())
  const [currentCardIndex, setCurrentCardIndex] = useState(0)

  // Fetch user's interests
  const { data: interests, isLoading: loadingInterests } = useQuery({
    queryKey: ['user-interests'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

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
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data, error } = await supabase
        .from('explore_cards')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      return data as ExploreCard[]
    },
  })

  // Delete card mutation
  const deleteCardMutation = useMutation({
    mutationFn: async (cardId: string) => {
      const { error } = await supabase
        .from('explore_cards')
        .delete()
        .eq('id', cardId)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['explore-cards'] })
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error deleting card",
        description: error.message,
      })
    }
  })

  // Filter out viewed cards
  const availableCards = exploreCards?.filter(card => !viewedCards.has(card.id)) || []

  // Generate new cards mutation
  const generateMutation = useMutation({
    mutationFn: async ({ interest, count }: { interest: Interest; count: number }) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const response = await supabase.functions.invoke('generate-explore-cards', {
        body: { 
          interest, 
          count,
          allInterests: interests 
        },
      })
      
      if (response.error) throw response.error
      
      const { data: { cards } } = response
      
      const { error } = await supabase
        .from('explore_cards')
        .insert(
          cards.map((card: any) => ({
            interest,
            front_content: card.front,
            back_content: card.back,
            user_id: user.id,
          }))
        )
      if (error) throw error
      
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

  // Generate initial cards if none available
  const generateInitialCards = useCallback(async () => {
    if (interests && interests.length > 0 && (!exploreCards || exploreCards.length === 0)) {
      const cardsPerInterest = Math.ceil(20 / interests.length)
      for (const interest of interests) {
        await generateMutation.mutateAsync({ interest, count: cardsPerInterest })
      }
    }
  }, [interests, exploreCards, generateMutation])

  // Call generateInitialCards when the component mounts and we have interests
  useQuery({
    queryKey: ['initial-cards', interests?.length],
    queryFn: generateInitialCards,
    enabled: !!interests && interests.length > 0 && (!exploreCards || exploreCards.length === 0),
  })

  const handleCardView = async (cardId: string) => {
    try {
      await deleteCardMutation.mutateAsync(cardId)
      setViewedCards(prev => new Set([...prev, cardId]))
      setCurrentCardIndex(currentIndex => {
        const nextIndex = currentIndex + 1
        return nextIndex >= availableCards.length ? currentIndex : nextIndex
      })
    } catch (error) {
      console.error('Error deleting card:', error)
    }
  }

  const generateMoreCards = async () => {
    if (!interests || interests.length === 0) return
    
    // Randomly select an interest to generate cards from
    const randomInterest = interests[Math.floor(Math.random() * interests.length)]
    await generateMutation.mutateAsync({ interest: randomInterest, count: 5 })
    setCurrentCardIndex(0) // Reset to show the first new card
  }

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

  const currentCard = availableCards[currentCardIndex]

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
        Explore
      </h1>

      <AnimatePresence mode="popLayout">
        {loadingCards ? (
          <div className="flex justify-center p-8">
            <Loader2 className="animate-spin" />
          </div>
        ) : currentCard ? (
          <motion.div
            key={currentCard.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Topic: {currentCard.interest}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Flashcard
                  front={currentCard.front_content}
                  back={currentCard.back_content}
                  onNext={() => handleCardView(currentCard.id)}
                />
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center p-8 space-y-4"
          >
            <p className="text-lg text-gray-600">No more cards to explore!</p>
            <Button
              onClick={generateMoreCards}
              disabled={generateMutation.isPending}
              className="bg-gradient-to-r from-teal-600 to-blue-600 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Generate 5 More Cards
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Explore
