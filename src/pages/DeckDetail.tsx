
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Flashcard } from "@/components/Flashcard";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { addDays } from "date-fns";
import { useToast } from "@/components/ui/use-toast";

interface Card {
  id: string;
  front_content: string;
  back_content: string;
  next_review_at: string;
  interval_days: number;
  ease_factor: number;
  review_count: number;
}

const calculateNextInterval = (
  currentInterval: number,
  easeFactor: number,
  difficulty: 'forgot' | 'struggled' | 'easy'
): { newInterval: number; newEaseFactor: number } => {
  let newEaseFactor = easeFactor;
  let newInterval: number;

  switch (difficulty) {
    case 'forgot':
      newInterval = 1; // Reset to 1 day
      newEaseFactor = Math.max(1.3, easeFactor - 0.2); // Decrease ease factor but not below 1.3
      break;
    case 'struggled':
      newInterval = currentInterval; // Keep the same interval
      newEaseFactor = Math.max(1.3, easeFactor - 0.15); // Slightly decrease ease factor
      break;
    case 'easy':
      newInterval = Math.ceil(currentInterval * easeFactor);
      newEaseFactor = Math.min(2.5, easeFactor + 0.1); // Increase ease factor but not above 2.5
      break;
    default:
      newInterval = currentInterval;
  }

  // Ensure minimum interval of 1 day and maximum of 365 days
  return {
    newInterval: Math.min(365, Math.max(1, newInterval)),
    newEaseFactor: newEaseFactor
  };
};

const DeckDetail = () => {
  const { deckId } = useParams();
  const navigate = useNavigate();
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: deck, isLoading: isDeckLoading, error: deckError } = useQuery({
    queryKey: ['deck', deckId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('decks')
        .select('*')
        .eq('id', deckId)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  const { data: cards, isLoading: isCardsLoading, error: cardsError } = useQuery({
    queryKey: ['cards', deckId],
    queryFn: async () => {
      const now = new Date().toISOString();
      
      const { data, error } = await supabase
        .from('cards')
        .select('*')
        .eq('deck_id', deckId)
        .lte('next_review_at', now)
        .order('next_review_at');
      
      if (error) throw error;
      return data as Card[];
    },
  });

  // Reset currentCardIndex when cards data changes
  useEffect(() => {
    setCurrentCardIndex(0);
  }, [cards]);

  const updateCardMutation = useMutation({
    mutationFn: async ({ cardId, difficulty }: { cardId: string, difficulty: 'forgot' | 'struggled' | 'easy' }) => {
      const card = cards?.find(c => c.id === cardId);
      if (!card) throw new Error('Card not found');

      const { newInterval, newEaseFactor } = calculateNextInterval(
        card.interval_days || 1,
        card.ease_factor || 2.5,
        difficulty
      );

      const nextReviewAt = addDays(new Date(), newInterval).toISOString();

      const { error } = await supabase
        .from('cards')
        .update({
          next_review_at: nextReviewAt,
          interval_days: newInterval,
          ease_factor: newEaseFactor,
          last_reviewed_at: new Date().toISOString(),
          review_count: (card.review_count || 0) + 1
        })
        .eq('id', cardId);

      if (error) throw error;

      return {
        cardId,
        nextReviewAt,
        newInterval,
        newEaseFactor
      };
    },
    onSuccess: (updatedCard) => {
      queryClient.setQueryData(['cards', deckId], (oldData: Card[] | undefined) => {
        if (!oldData) return [];
        return oldData.filter(card => card.id !== updatedCard.cardId);
      });

      if (cards && currentCardIndex < cards.length - 1) {
        setCurrentCardIndex(prev => prev + 1);
      } else {
        toast({
          title: "Review Complete!",
          description: "You've reviewed all due cards in this deck.",
        });
      }
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error updating card",
        description: error.message,
      });
    }
  });

  const handleDifficultySelect = (difficulty: 'forgot' | 'struggled' | 'easy') => {
    if (!cards || !cards.length) return;
    const currentCard = cards[currentCardIndex];
    if (!currentCard) return;
    updateCardMutation.mutate({ cardId: currentCard.id, difficulty });
  };

  // Error states
  if (deckError || cardsError) {
    return (
      <div className="p-4 text-red-500">
        {deckError ? "Error loading deck" : "Error loading cards"}
      </div>
    );
  }

  // Loading states
  if (isDeckLoading || isCardsLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-[200px]" />
        <Skeleton className="h-[200px] w-full" />
      </div>
    );
  }

  if (!deck) {
    return <div className="p-4">Deck not found</div>;
  }

  // Ensure cards is an array even if empty
  const safeCards = cards || [];
  const dueCardsCount = safeCards.length;

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={() => navigate('/dashboard')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>

      <div>
        <h1 className="text-3xl font-bold">{deck.title}</h1>
        <p className="text-muted-foreground">{deck.description}</p>
        {dueCardsCount > 0 && (
          <p className="text-sm text-muted-foreground mt-2">
            {dueCardsCount} card{dueCardsCount !== 1 ? 's' : ''} due for review
          </p>
        )}
      </div>

      {dueCardsCount > 0 ? (
        <div className="space-y-4">
          <div className="text-center text-sm text-muted-foreground">
            Card {currentCardIndex + 1} of {dueCardsCount}
          </div>
          {currentCardIndex < safeCards.length && (
            <Flashcard
              front={safeCards[currentCardIndex].front_content}
              back={safeCards[currentCardIndex].back_content}
              onDifficultySelect={handleDifficultySelect}
            />
          )}
        </div>
      ) : (
        <div className="text-center py-8 space-y-4">
          <p className="text-muted-foreground">
            No cards due for review! Come back later.
          </p>
          <Button variant="outline" onClick={() => navigate('/dashboard')}>
            Return to Dashboard
          </Button>
        </div>
      )}
    </div>
  );
};

export default DeckDetail;
