
import { DeckCarousel } from "@/components/DeckCarousel";
import { useNavigate } from "react-router-dom";
import type { Deck } from "@/hooks/useDashboardData";

interface ActiveDecksProps {
  decks: Deck[];
  selectedDecks: Set<string>;
}

export const ActiveDecks = ({ decks, selectedDecks }: ActiveDecksProps) => {
  const navigate = useNavigate();

  // Add progress to the decks data
  const decksWithProgress = decks.map(deck => ({
    ...deck,
    progress: Math.floor(Math.random() * 100), // Replace with actual progress data
  }));

  // Filter decks for the carousel to only show selected ones
  const selectedDecksForCarousel = decksWithProgress.filter(deck => selectedDecks.has(deck.id));

  if (selectedDecksForCarousel.length === 0) {
    return null;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Continue Learning</h2>
      <DeckCarousel 
        decks={selectedDecksForCarousel} 
        onDeckSelect={(deckId) => navigate(`/deck/${deckId}`)}
      />
    </div>
  );
};
