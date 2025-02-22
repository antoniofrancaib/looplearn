import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Plus, ArrowRight, Calendar } from "lucide-react";
import { useState, useEffect } from "react";
import { NewDeckDialog } from "@/components/NewDeckDialog";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { PersonalizedFeed } from "@/components/PersonalizedFeed";
import { DeckCarousel } from "@/components/DeckCarousel";
import { AllDecksGrid } from "@/components/AllDecksGrid";
import { useToast } from "@/components/ui/use-toast";
import { format, addDays, subDays, parseISO } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

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
  const [completedDays, setCompletedDays] = useState<Date[]>([]);
  const [selectedDecks, setSelectedDecks] = useState<Set<string>>(new Set());
  const navigate = useNavigate();
  const { toast } = useToast();

  // Fetch selected decks when component mounts
  useEffect(() => {
    const fetchSelectedDecks = async () => {
      const { data: selectedDecksData, error } = await supabase
        .from('selected_decks')
        .select('deck_id');

      if (error) {
        console.error('Error fetching selected decks:', error);
        return;
      }

      setSelectedDecks(new Set(selectedDecksData.map(d => d.deck_id)));
    };

    fetchSelectedDecks();
  }, []);

  const handleSelectedDecksChange = async (newSelected: Set<string>) => {
    const oldSelected = new Set(selectedDecks);
    setSelectedDecks(newSelected);

    // Find decks to add and remove
    const toAdd = [...newSelected].filter(id => !oldSelected.has(id));
    const toRemove = [...oldSelected].filter(id => !newSelected.has(id));

    // Add new selections
    for (const deckId of toAdd) {
      const { error } = await supabase
        .from('selected_decks')
        .insert({ deck_id: deckId });

      if (error) {
        console.error('Error adding selected deck:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to save deck selection",
        });
      }
    }

    // Remove unselected decks
    for (const deckId of toRemove) {
      const { error } = await supabase
        .from('selected_decks')
        .delete()
        .eq('deck_id', deckId);

      if (error) {
        console.error('Error removing selected deck:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to remove deck selection",
        });
      }
    }
  };

  const handleReviewToday = async () => {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString();
    const endOfDay = new Date(today.setHours(23, 59, 59, 999)).toISOString();

    const { data: todayCards, error } = await supabase
      .from('cards')
      .select('*', { count: 'exact', head: true })
      .gte('next_review_at', startOfDay)
      .lt('next_review_at', endOfDay);

    if (error) {
      toast({
        title: "Error",
        description: "Could not fetch today's cards",
        variant: "destructive",
      });
      return;
    }

    if (!todayCards || todayCards.length === 0) {
      toast({
        title: "No cards due",
        description: "There are no cards to review today",
      });
      return;
    }

    navigate('/review', { state: { filter: 'today' } });
  };

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

  useEffect(() => {
    const fetchUserActivity = async () => {
      const thirtyDaysAgo = subDays(new Date(), 30).toISOString();
      
      const { data, error } = await supabase
        .from('user_daily_activity')
        .select('activity_date')
        .gte('activity_date', thirtyDaysAgo)
        .order('activity_date', { ascending: true });

      if (!error && data) {
        // Convert the activity dates to Date objects
        const activityDates = data.map(activity => new Date(activity.activity_date));
        setCompletedDays(activityDates);
      } else if (error) {
        console.error('Error fetching user activity:', error);
      }
    };

    fetchUserActivity();
  }, []);

  // Add progress to the decks data
  const decksWithProgress = decks.map(deck => ({
    ...deck,
    progress: Math.floor(Math.random() * 100), // Replace with actual progress data
  }));

  // Filter decks for the carousel to only show selected ones
  const selectedDecksForCarousel = decksWithProgress.filter(deck => selectedDecks.has(deck.id));

  return (
    <div className="space-y-8">
      {/* Personalized Feed */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Your Personal Feed</h2>
        <PersonalizedFeed selectedInterests={[]} />
      </div>

      {/* Create New Deck and Review Today Buttons */}
      <div className="flex justify-center gap-4">
        <Button
          onClick={() => setNewDeckDialogOpen(true)}
          className="w-full max-w-md bg-teal-500 hover:bg-teal-600 text-white shadow-lg hover:shadow-teal-200/50 transition-all"
          size="lg"
        >
          <Plus className="mr-2 h-5 w-5" />
          Create New Deck
        </Button>
        <Button
          onClick={handleReviewToday}
          variant="secondary"
          className="w-full max-w-md shadow-lg hover:shadow-blue-200/50 transition-all"
          size="lg"
        >
          <Calendar className="mr-2 h-5 w-5" />
          Review Today's Cards
        </Button>
      </div>

      {/* Active Decks */}
      {selectedDecksForCarousel.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Continue Learning</h2>
          <DeckCarousel 
            decks={selectedDecksForCarousel} 
            onDeckSelect={(deckId) => navigate(`/deck/${deckId}`)}
          />
        </div>
      )}

      {/* All Decks Grid */}
      <AllDecksGrid 
        decks={decksWithProgress} 
        selectedDecks={selectedDecks}
        onSelectedDecksChange={handleSelectedDecksChange}
      />

      <NewDeckDialog 
        open={newDeckDialogOpen} 
        onOpenChange={setNewDeckDialogOpen}
      />
    </div>
  );
};

export default Dashboard;
