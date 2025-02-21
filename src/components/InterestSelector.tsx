
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

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
  const toggleInterest = (interestId: Interest) => {
    if (selectedInterests.includes(interestId)) {
      onInterestsChange(selectedInterests.filter(id => id !== interestId));
    } else {
      onInterestsChange([...selectedInterests, interestId]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {interests.map((interest) => (
        <Badge
          key={interest.id}
          variant={selectedInterests.includes(interest.id) ? "default" : "outline"}
          className={`cursor-pointer hover:opacity-80 ${
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
