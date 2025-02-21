import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Plus } from "lucide-react";
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
import { motion } from "framer-motion";
import { useRewards } from "@/contexts/RewardsContext";
import { Celebration } from "@/components/Celebration";

interface Deck {
  id: string;
  title: string;
  description: string | null;
  card_count: number;
  top_card?: {
    front_content: string;
  };
}

export function AllDecksGrid({ decks }: { decks: Deck[] }) {
  const [selectedDecks, setSelectedDecks] = useState<Set<string>>(new Set());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pendingDeckId, setPendingDeckId] = useState<string | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const { completeDeck } = useRewards();

  const handleAddToSession = (deckId: string) => {
    setPendingDeckId(deckId);
    setDialogOpen(true);
  };

  const confirmAddToSession = () => {
    if (pendingDeckId) {
      const newSelected = new Set(selectedDecks);
      newSelected.add(pendingDeckId);
      setSelectedDecks(newSelected);
    }
    setDialogOpen(false);
    setPendingDeckId(null);
  };

  const handleDeckCompletion = (deckId: string) => {
    completeDeck(deckId);
    setShowCelebration(true);
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
                  <div className="absolute top-4 right-4 z-10">
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
                          <Check className="h-4 w-4 mr-1" />
                          Added
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4 mr-1" />
                          Add to Today
                        </>
                      )}
                    </Button>
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