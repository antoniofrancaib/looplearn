
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useState, useEffect, useCallback } from "react"
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

  // Fetch unviewed explore cards
  const { data: exploreCards, isLoading: loadingCards } = useQuery({
    queryKey: ['explore-cards'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Get currently active cards that haven't been viewed
      const { data, error } = await supabase
        .from('explore_cards')
        .select('*')
        .eq('user_id', user.id)
        .is('viewed_at', null)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data as ExploreCard[]
    },
  })

  // Delete card mutation
  const deleteCardMutation = useMutation({
    mutationFn: async (cardId: string) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Instead of deleting, mark as viewed
      const { error } = await supabase
        .from('explore_cards')
        .update({ viewed_at: new Date().toISOString() })
        .eq('id', cardId)
        .eq('user_id', user.id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['explore-cards'] })
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error updating card",
        description: error.message,
      })
    }
  })

  // Generate new cards mutation
  const generateMutation = useMutation({
    mutationFn: async ({ interest, count }: { interest: Interest; count: number }) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')
      
      // Get total unviewed cards count
      const { count: totalCards, error: countError } = await supabase
        .from('explore_cards')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .is('viewed_at', null)
      
      if (countError) throw countError
      
      if (totalCards >= 100) {
        throw new Error('Maximum card limit reached (100 unviewed cards)')
      }
      
      // Adjust count if it would exceed the limit
      const remainingSlots = 100 - totalCards
      const adjustedCount = Math.min(count, remainingSlots)
      
      if (adjustedCount <= 0) {
        throw new Error('Maximum card limit reached (100 unviewed cards)')
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
            viewed_at: null
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

  const generateInitialCards = useCallback(async () => {
    if (!interests?.length) return;
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return;
    
    // Check if we already have unviewed cards
    const { count } = await supabase
      .from('explore_cards')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .is('viewed_at', null)
    
    // Only generate new cards if we have none
    if (count === 0) {
      const cardsPerInterest = Math.ceil(20 / interests.length)
      for (const interest of interests) {
        await generateMutation.mutateAsync({ interest, count: cardsPerInterest })
      }
    }
    return true;
  }, [interests, generateMutation])

  const handleCardView = async (cardId: string) => {
    try {
      await deleteCardMutation.mutateAsync(cardId)
      setCurrentCardIndex(currentIndex => {
        const nextIndex = currentIndex + 1
        return nextIndex >= (exploreCards?.length || 0) ? currentIndex : nextIndex
      })
    } catch (error) {
      console.error('Error updating card:', error)
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
    currentCard: exploreCards?.[currentCardIndex],
    handleCardView,
    generateMoreCards,
    generateInitialCards,
  }
}
