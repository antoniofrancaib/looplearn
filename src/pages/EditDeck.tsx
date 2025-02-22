
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

interface Card {
  id: string;
  front_content: string;
  back_content: string;
}

const EditDeck = () => {
  const { deckId } = useParams();
  const navigate = useNavigate();

  const { data: deck, isLoading: isDeckLoading, error: deckError } = useQuery({
    queryKey: ['edit-deck', deckId],
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
    queryKey: ['edit-deck-cards', deckId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cards')
        .select('*')
        .eq('deck_id', deckId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Card[];
    },
  });

  // Error handling
  if (deckError || cardsError) {
    const errorMessage = deckError ? "Error loading deck" : "Error loading cards";
    toast.error(errorMessage);
    return (
      <div className="p-4 text-red-500">
        {errorMessage}
      </div>
    );
  }

  // Loading state
  if (isDeckLoading || isCardsLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-[200px]" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  if (!deck) {
    return <div className="p-4">Deck not found</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
        <Button 
          onClick={() => navigate(`/deck/${deckId}/add-card`)}
          className="bg-teal-500 hover:bg-teal-600"
        >
          Add New Card
        </Button>
      </div>

      <div>
        <h1 className="text-3xl font-bold">{deck.title}</h1>
        <p className="text-muted-foreground">{deck.description}</p>
      </div>

      {cards && cards.length > 0 ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Front</TableHead>
                <TableHead>Back</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cards.map((card) => (
                <TableRow key={card.id}>
                  <TableCell>{card.front_content}</TableCell>
                  <TableCell>{card.back_content}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      onClick={() => navigate(`/deck/${deckId}/card/${card.id}/edit`)}
                    >
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No cards in this deck yet.</p>
          <Button
            onClick={() => navigate(`/deck/${deckId}/add-card`)}
            className="mt-4"
          >
            Create your first card
          </Button>
        </div>
      )}
    </div>
  );
};

export default EditDeck;
