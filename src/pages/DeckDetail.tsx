
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Flashcard } from "@/components/Flashcard";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

interface Card {
  id: string;
  front_content: string;
  back_content: string;
}

const DeckDetail = () => {
  const { deckId } = useParams();
  const navigate = useNavigate();
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  const { data: deck, isLoading: isDeckLoading } = useQuery({
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

  const { data: cards, isLoading: isCardsLoading } = useQuery({
    queryKey: ['cards', deckId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cards')
        .select('*')
        .eq('deck_id', deckId)
        .order('created_at');
      
      if (error) throw error;
      return data as Card[];
    },
  });

  const handleCardResult = (correct: boolean) => {
    // Here you can implement spaced repetition logic
    setTimeout(() => {
      if (cards && currentCardIndex < cards.length - 1) {
        setCurrentCardIndex(prev => prev + 1);
      }
    }, 1000);
  };

  if (isDeckLoading || isCardsLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-[200px]" />
        <Skeleton className="h-[200px] w-full" />
      </div>
    );
  }

  if (!deck || !cards) {
    return <div>Deck not found</div>;
  }

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
      </div>

      {cards.length > 0 ? (
        <div className="space-y-4">
          <div className="text-center text-sm text-muted-foreground">
            Card {currentCardIndex + 1} of {cards.length}
          </div>
          <Flashcard
            front={cards[currentCardIndex].front_content}
            back={cards[currentCardIndex].back_content}
            onResult={handleCardResult}
          />
        </div>
      ) : (
        <div className="text-center text-muted-foreground">
          No cards found in this deck
        </div>
      )}
    </div>
  );
};

export default DeckDetail;
