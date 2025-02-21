
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Plus, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { NewDeckDialog } from "@/components/NewDeckDialog";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { PersonalizedFeed } from "@/components/PersonalizedFeed";
import { DeckCarousel } from "@/components/DeckCarousel";
import { AllDecksGrid } from "@/components/AllDecksGrid";
import { format, addDays, subDays, parseISO } from 'date-fns';
import { Calendar } from "@/components/ui/calendar";
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
  const navigate = useNavigate();

  // Generate mock data for the next 5 days
  const upcomingReviews = Array.from({ length: 5 }).map((_, index) => ({
    date: format(addDays(new Date(), index), 'MMM dd'),
    cards: Math.floor(Math.random() * 20) + 5, // Random number between 5 and 25
  }));

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

  // Fetch user activity data
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

  return (
    <div className="space-y-8">
      {/* Personalized Feed */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Your Personal Feed</h2>
        <PersonalizedFeed selectedInterests={[]} />
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
