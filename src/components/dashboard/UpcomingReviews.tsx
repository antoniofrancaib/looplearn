
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { format, addDays } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

export const UpcomingReviews = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: reviewCounts, isLoading } = useQuery({
    queryKey: ['upcoming-reviews'],
    queryFn: async () => {
      const dates = Array.from({ length: 5 }).map((_, index) => {
        const date = addDays(new Date(), index);
        return {
          startDate: new Date(date.setHours(0, 0, 0, 0)).toISOString(),
          endDate: new Date(date.setHours(23, 59, 59, 999)).toISOString(),
          displayDate: format(date, 'MMM dd')
        };
      });

      // Fetch card counts for each day
      const counts = await Promise.all(
        dates.map(async ({ startDate, endDate, displayDate }) => {
          const { count, error } = await supabase
            .from('cards')
            .select('*', { count: 'exact', head: true })
            .gte('next_review_at', startDate)
            .lt('next_review_at', endDate);

          if (error) {
            console.error('Error fetching card count:', error);
            return { date: displayDate, cards: 0 };
          }

          return {
            date: displayDate,
            cards: count || 0
          };
        })
      );

      return counts;
    },
  });

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

  if (isLoading) {
    return (
      <div className="p-3 rounded-lg bg-white/80 shadow-sm border border-teal-50">
        <h3 className="text-sm font-semibold mb-2 text-gray-700">Upcoming Reviews</h3>
        <Skeleton className="h-[150px] w-full" />
      </div>
    );
  }

  const todayCards = reviewCounts?.[0]?.cards || 0;

  return (
    <div className="p-3 rounded-lg bg-white/80 shadow-sm border border-teal-50">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-semibold text-gray-700">Upcoming Reviews</h3>
        <Button
          variant="secondary"
          size="sm"
          className="gap-2"
          onClick={handleReviewToday}
          disabled={todayCards === 0}
        >
          <Calendar className="h-4 w-4" />
          Review Today ({todayCards})
        </Button>
      </div>
      <div className="h-[150px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={reviewCounts} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis 
              dataKey="date" 
              stroke="#374151"
              fontSize={10}
              tickSize={5}
            />
            <YAxis 
              stroke="#374151"
              fontSize={10}
              tickSize={5}
            />
            <Tooltip />
            <Bar 
              dataKey="cards" 
              fill="#14b8a6" 
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
