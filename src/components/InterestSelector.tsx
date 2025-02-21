import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

export const interests = [
  { id: 'science', label: 'Science', defaultSelected: true },
  { id: 'tech', label: 'Technology', defaultSelected: true },
  { id: 'history', label: 'History', defaultSelected: false },
  { id: 'art', label: 'Art', defaultSelected: false },
  { id: 'sports', label: 'Sports', defaultSelected: false },
  { id: 'languages', label: 'Languages', defaultSelected: false },
  { id: 'travel', label: 'Travel', defaultSelected: false },
  { id: 'music', label: 'Music', defaultSelected: false },
] as const;

export function InterestSelector({ 
  selectedInterests, 
  onInterestsChange 
}: { 
  selectedInterests: string[],
  onInterestsChange: (interests: string[]) => void 
}) {
  const toggleInterest = (interestId: string) => {
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