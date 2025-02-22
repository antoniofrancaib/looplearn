
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { subDays } from 'date-fns';

export interface Deck {
  id: string;
  title: string;
  description: string | null;
  created_at: string | null;
  card_count: number;
}

export const useDashboardData = () => {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [completedDays, setCompletedDays] = useState<Date[]>([]);
  const [selectedDecks, setSelectedDecks] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  // Fetch selected decks
  useEffect(() => {
    const fetchSelectedDecks = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      const { data: selectedDecksData, error } = await supabase
        .from('selected_decks')
        .select('deck_id')
        .eq('user_id', session.user.id);

      if (error) {
        console.error('Error fetching selected decks:', error);
        return;
      }

      setSelectedDecks(new Set(selectedDecksData.map(d => d.deck_id)));
    };

    fetchSelectedDecks();
  }, []);

  // Fetch decks
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
  }, []);

  // Fetch user activity
  useEffect(() => {
    const fetchUserActivity = async () => {
      const thirtyDaysAgo = subDays(new Date(), 30).toISOString();
      
      const { data, error } = await supabase
        .from('user_daily_activity')
        .select('activity_date')
        .gte('activity_date', thirtyDaysAgo)
        .order('activity_date', { ascending: true });

      if (!error && data) {
        const activityDates = data.map(activity => new Date(activity.activity_date));
        setCompletedDays(activityDates);
      } else if (error) {
        console.error('Error fetching user activity:', error);
      }
    };

    fetchUserActivity();
  }, []);

  const handleSelectedDecksChange = async (newSelected: Set<string>) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in to select decks",
      });
      return;
    }

    const oldSelected = new Set(selectedDecks);
    setSelectedDecks(newSelected);

    // Find decks to add and remove
    const toAdd = [...newSelected].filter(id => !oldSelected.has(id));
    const toRemove = [...oldSelected].filter(id => !newSelected.has(id));

    // Add new selections
    for (const deckId of toAdd) {
      const { error } = await supabase
        .from('selected_decks')
        .insert({
          deck_id: deckId,
          user_id: session.user.id
        });

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
        .eq('deck_id', deckId)
        .eq('user_id', session.user.id);

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

  return {
    decks,
    selectedDecks,
    completedDays,
    handleSelectedDecksChange,
    setDecks
  };
};
