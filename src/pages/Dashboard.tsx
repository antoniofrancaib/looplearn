import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Plus, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { NewDeckDialog } from "@/components/NewDeckDialog";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { InterestSelector, interests } from "@/components/InterestSelector";
import { PersonalizedFeed } from "@/components/PersonalizedFeed";
import { DeckCarousel } from "@/components/DeckCarousel";
import { AllDecksGrid } from "@/components/AllDecksGrid";

interface Deck {
  id: string;
  title: string;
  description: string | null;
  created_at: string | null;
  card_count: number;
}

const Dashboard = () => {
  const [newDeckDialogOpen, setNewDeckDialogOpen] = useState(false);
  const [decks, setDecks] = useState<Deck[]>([]);
  const [selectedInterests, setSelectedInterests] = useState(() => 
    interests.filter(i => i.defaultSelected).map(i => i.id)
  );
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDecks = async () => {
      const { data: decksData, error } = await supabase
        .from('decks')
        .select(`
          id,
          title,
          description,
          created_at,
          cards (count)
        `)
        .order('created_at', { ascending: false });

      if (!error && decksData) {
        setDecks(decksData.map(deck => ({
          ...deck,
          card_count: deck.cards?.[0]?.count || 0
        })));
      }
    };

    fetchDecks();
  }, [newDeckDialogOpen]);

  // Add progress to the decks data
  const decksWithProgress = decks.map(deck => ({
    ...deck,
    progress: Math.floor(Math.random() * 100), // Replace with actual progress data
  }));

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-teal-500 to-blue-500 p-8 text-white">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold">Welcome back, John! 👋</h1>
          <p className="mt-2 text-teal-50">Ready to continue your learning journey?</p>
          <div className="mt-4 space-y-4">
            <Button 
              className="bg-white text-teal-600 hover:bg-teal-50"
              onClick={() => setNewDeckDialogOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create New Deck
            </Button>
            <div className="pt-4">
              <p className="text-sm text-teal-50 mb-2">Customize your feed:</p>
              <InterestSelector 
                selectedInterests={selectedInterests}
                onInterestsChange={setSelectedInterests}
              />
            </div>
          </div>
        </div>
        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-blue-400/20 to-transparent" />
      </div>

      {/* Personalized Feed */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Your Personal Feed</h2>
        <PersonalizedFeed selectedInterests={selectedInterests} />
      </div>

      {/* Create New Deck Button */}
      <div className="flex justify-center">
        <Button
          onClick={() => setNewDeckDialogOpen(true)}
          className="w-full max-w-2xl bg-teal-500 hover:bg-teal-600 text-white shadow-lg hover:shadow-teal-200/50 transition-all"
          size="lg"
        >
          <Plus className="mr-2 h-5 w-5" />
          Create New Deck
        </Button>
      </div>

      {/* Active Decks */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Continue Learning</h2>
        <DeckCarousel 
          decks={decksWithProgress} 
          onDeckSelect={(deckId) => navigate(`/deck/${deckId}`)}
        />
      </div>

      {/* All Decks Grid */}
      <AllDecksGrid decks={decksWithProgress} />

      <NewDeckDialog 
        open={newDeckDialogOpen} 
        onOpenChange={setNewDeckDialogOpen}
      />
    </div>
  );
};

export default Dashboard;
