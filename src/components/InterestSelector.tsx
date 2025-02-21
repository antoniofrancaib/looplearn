
import { Interest, interests } from "@/types/interests";
import { InterestBadge } from "./interests/InterestBadge";
import { useInterests } from "@/hooks/useInterests";

interface InterestSelectorProps {
  selectedInterests: Interest[];
  onInterestsChange: (interests: Interest[]) => void;
}

export function InterestSelector({ 
  selectedInterests, 
  onInterestsChange 
}: InterestSelectorProps) {
  const { loading, toggleInterest } = useInterests(selectedInterests, onInterestsChange);

  return (
    <div className="flex flex-wrap gap-2">
      {interests.map((interest) => (
        <InterestBadge
          key={interest.id}
          id={interest.id}
          label={interest.label}
          isSelected={selectedInterests.includes(interest.id)}
          isLoading={loading}
          onClick={() => toggleInterest(interest.id)}
        />
      ))}
    </div>
  );
}

export type { Interest };
export { interests };
