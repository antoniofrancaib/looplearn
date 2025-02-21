
import { Interest, interests, interestCategories } from "@/types/interests";
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
    <div className="space-y-8">
      {interestCategories.map((category) => (
        <div key={category} className="space-y-3">
          <h3 className="text-lg font-semibold text-teal-800">{category}</h3>
          <div className="flex flex-wrap gap-2">
            {interests
              .filter((interest) => interest.category === category)
              .map((interest) => (
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
        </div>
      ))}
    </div>
  );
}

export type { Interest };
export { interests };
