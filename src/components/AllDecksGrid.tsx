
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Plus, MoreVertical, Pencil, Trash } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";
import { useRewards } from "@/contexts/RewardsContext";
import { Celebration } from "@/components/Celebration";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Deck {
  id: string;
  title: string;
  description: string | null;
  card_count: number;
  top_card?: {
    front_content: string;
  };
}

export function AllDecksGrid({ decks: initialDecks }: { decks: Deck[] }) {
  const [selectedDecks, setSelectedDecks] = useState<Set<string>>(new Set());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pendingDeckId, setPendingDeckId] = useState<string | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [decks, setDecks] = useState<Deck[]>(initialDecks);
  const { completeDeck } = useRewards();
  const navigate = useNavigate();

  useEffect(() => {
    setDecks(initialDecks);
  }, [initialDecks]);

  const handleAddToSession = (deckId: string) => {
    setPendingDeckId(deckId);
    setDialogOpen(true);
  };

  const confirmAddToSession = () => {
    if (pendingDeckId) {
      const newSelected = new Set(selectedDecks);
      newSelected.add(pendingDeckId);
      setSelectedDecks(newSelected);
      toast.success("Deck added to today's session");
    }
    setDialogOpen(false);
    setPendingDeckId(null);
  };

  const handleDeckCompletion = (deckId: string) => {
    completeDeck(deckId);
    setShowCelebration(true);
  };

  const handleEditDeck = (deckId: string) => {
    navigate(`/deck/${deckId}/edit`);
  };

  const handleDeleteDeck = async (deckId: string) => {
    try {
      // First delete all cards in the deck
      const { error: cardsError } = await supabase
        .from('cards')
        .delete()
        .eq('deck_id', deckId);

      if (cardsError) {
        toast.error("Failed to delete deck's cards");
        return;
      }

      // Then delete the deck
      const { error: deckError } = await supabase
        .from('decks')
        .delete()
        .eq('id', deckId);

      if (deckError) {
        toast.error("Failed to delete deck");
        return;
      }

      // Update local state to remove the deleted deck
      setDecks(prevDecks => prevDecks.filter(deck => deck.id !== deckId));
      
      // Remove the deck from selected decks if it was there
      const newSelected = new Set(selectedDecks);
      newSelected.delete(deckId);
      setSelectedDecks(newSelected);
      
      toast.success("Deck deleted successfully");
    } catch (error) {
      toast.error("An error occurred while deleting the deck");
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">All Decks</h2>
          {selectedDecks.size > 0 && (
            <div className="text-sm text-muted-foreground">
              {selectedDecks.size} deck(s) selected for today
            </div>
          )}
        </div>

        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
            {decks.map((deck) => (
              <motion.div
                key={deck.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="relative group overflow-hidden">
                  <div className="absolute top-4 right-4 z-10 flex gap-2">
                    <Button
                      size="sm"
                      variant={selectedDecks.has(deck.id) ? "default" : "outline"}
                      className={`transition-all ${
                        selectedDecks.has(deck.id)
                          ? "bg-teal-500 hover:bg-teal-600 text-white"
                          : "hover:border-teal-500 hover:text-teal-500"
                      }`}
                      onClick={() => handleAddToSession(deck.id)}
                    >
                      {selectedDecks.has(deck.id) ? (
                        <>
                          <Check className="h-4 w-4" />
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4" />
                        </>
                      )}
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="hover:border-teal-500 hover:text-teal-500"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditDeck(deck.id)}>
                          <Pencil className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-red-600 hover:text-red-600"
                          onClick={() => handleDeleteDeck(deck.id)}
                        >
                          <Trash className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{deck.title}</h3>
                    <div className="text-sm text-muted-foreground mb-4">
                      {deck.card_count} cards
                    </div>

                    {deck.top_card && (
                      <div className="bg-muted/30 rounded-lg p-4 text-sm">
                        <p className="font-medium text-muted-foreground">Preview:</p>
                        <p className="mt-1">{deck.top_card.front_content}</p>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Fade effect for scroll indication */}
          <div className="absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-background to-transparent pointer-events-none" />
        </div>

        <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Add to Today's Session?</AlertDialogTitle>
              <AlertDialogDescription>
                This deck will be included in your study session for today. You can remove it later if needed.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-teal-500 hover:bg-teal-600"
                onClick={confirmAddToSession}
              >
                Add to Session
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <Celebration 
        show={showCelebration}
        onComplete={() => setShowCelebration(false)}
        sparksEarned={50}
      />
    </>
  );
}
