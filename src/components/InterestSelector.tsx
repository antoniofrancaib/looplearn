
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export type Interest = "science" | "tech" | "history" | "art" | "sports" | "languages" | "travel" | "music";

export const interests = [
  { id: 'science' as Interest, label: 'Science', defaultSelected: true },
  { id: 'tech' as Interest, label: 'Technology', defaultSelected: true },
  { id: 'history' as Interest, label: 'History', defaultSelected: false },
  { id: 'art' as Interest, label: 'Art', defaultSelected: false },
  { id: 'sports' as Interest, label: 'Sports', defaultSelected: false },
  { id: 'languages' as Interest, label: 'Languages', defaultSelected: false },
  { id: 'travel' as Interest, label: 'Travel', defaultSelected: false },
  { id: 'music' as Interest, label: 'Music', defaultSelected: false },
] as const;

export function InterestSelector({ 
  selectedInterests, 
  onInterestsChange 
}: { 
  selectedInterests: Interest[],
  onInterestsChange: (interests: Interest[]) => void 
}) {
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
        // Remove interest
        const { error } = await supabase
          .from('user_interests')
          .delete()
          .eq('user_id', user.id)
          .eq('interest', interestId);

        if (error) throw error;
        onInterestsChange(selectedInterests.filter(id => id !== interestId));
      } else {
        // Add interest
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

  return (
    <div className="flex flex-wrap gap-2">
      {interests.map((interest) => (
        <Badge
          key={interest.id}
          variant={selectedInterests.includes(interest.id) ? "default" : "outline"}
          className={`cursor-pointer hover:opacity-80 ${
            loading ? 'opacity-50 pointer-events-none' : ''
          } ${
            selectedInterests.includes(interest.id) 
              ? 'bg-teal-500 hover:bg-teal-600' 
              : 'hover:bg-teal-50'
          }`}
          onClick={() => toggleInterest(interest.id)}
        >
          {interest.label}
        </Badge>
      ))}
    </div>
  );
}
