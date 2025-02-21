
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useState, useCallback } from "react"
import { supabase } from "@/integrations/supabase/client"
import { Interest } from "@/types/interests"
import { useToast } from "@/components/ui/use-toast"

export interface ExploreCard {
  id: string
  interest: Interest
  front_content: string
  back_content: string
  saved: boolean
}

export const useExploreCards = () => {
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

  // Generate new cards mutation
  const generateMutation = useMutation({
    mutationFn: async ({ interest, count }: { interest: Interest; count: number }) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')
      
      // Check total card count before generating
      const { count: totalCards, error: countError } = await supabase
        .from('explore_cards')
        .select('*', { count: 'exact', head: true })
      
      if (countError) throw countError
      
      if (totalCards >= 100) {
        throw new Error('Maximum card limit reached (100 cards)')
      }
      
      // Adjust count if it would exceed the limit
      const remainingSlots = 100 - totalCards
      const adjustedCount = Math.min(count, remainingSlots)
      
      if (adjustedCount <= 0) {
        throw new Error('Maximum card limit reached (100 cards)')
      }

      const response = await supabase.functions.invoke('generate-explore-cards', {
        body: { 
          interest, 
          count: adjustedCount,
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

  // Filter out viewed cards
  const availableCards = exploreCards?.filter(card => !viewedCards.has(card.id)) || []

  const generateInitialCards = useCallback(async () => {
    if (interests && interests.length > 0 && (!exploreCards || exploreCards.length === 0)) {
      const cardsPerInterest = Math.ceil(20 / interests.length)
      for (const interest of interests) {
        await generateMutation.mutateAsync({ interest, count: cardsPerInterest })
      }
    }
  }, [interests, exploreCards, generateMutation])

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
    
    const randomInterest = interests[Math.floor(Math.random() * interests.length)]
    await generateMutation.mutateAsync({ interest: randomInterest, count: 5 })
    setCurrentCardIndex(0)
  }

  return {
    interests,
    loadingInterests,
    loadingCards,
    currentCard: availableCards[currentCardIndex],
    availableCards,
    handleCardView,
    generateMoreCards,
    generateInitialCards,
  }
}
