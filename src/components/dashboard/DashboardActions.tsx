
import { Plus, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface DashboardActionsProps {
  onNewDeckClick: () => void;
}

export const DashboardActions = ({ onNewDeckClick }: DashboardActionsProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

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

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <Button
        onClick={onNewDeckClick}
        className="w-full md:max-w-md bg-teal-500 hover:bg-teal-600 text-white shadow-lg hover:shadow-teal-200/50 transition-all"
        size="lg"
      >
        <Plus className="mr-2 h-5 w-5" />
        Create New Deck
      </Button>
      <Button
        onClick={handleReviewToday}
        variant="secondary"
        className="w-full md:max-w-md shadow-lg hover:shadow-blue-200/50 transition-all"
        size="lg"
      >
        <Calendar className="mr-2 h-5 w-5" />
        Review Today's Cards
      </Button>
    </div>
  );
};
