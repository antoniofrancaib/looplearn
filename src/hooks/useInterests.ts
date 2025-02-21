
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Interest } from '@/types/interests';

export function useInterests(
  selectedInterests: Interest[],
  onInterestsChange: (interests: Interest[]) => void
) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUserInterests();
  }, []);

  const loadUserInterests = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: userInterests, error } = await supabase
        .from('user_interests')
        .select('interest')
        .eq('user_id', user.id);

      if (error) throw error;

      if (userInterests) {
        const savedInterests = userInterests.map(row => row.interest) as Interest[];
        onInterestsChange(savedInterests);
      }
    } catch (error) {
      console.error('Error loading interests:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load your interests"
      });
    }
  };

  const toggleInterest = async (interestId: Interest) => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "You must be logged in to save interests"
        });
        return;
      }

      if (selectedInterests.includes(interestId)) {
        const { error } = await supabase
          .from('user_interests')
          .delete()
          .eq('user_id', user.id)
          .eq('interest', interestId);

        if (error) throw error;
        onInterestsChange(selectedInterests.filter(id => id !== interestId));
      } else {
        const { error } = await supabase
          .from('user_interests')
          .insert([{ user_id: user.id, interest: interestId }]);

        if (error) throw error;
        onInterestsChange([...selectedInterests, interestId]);
      }
    } catch (error) {
      console.error('Error toggling interest:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update your interests"
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    toggleInterest
  };
}
