
import { Badge } from "@/components/ui/badge";
import { Interest } from "@/types/interests";

interface InterestBadgeProps {
  id: Interest;
  label: string;
  isSelected: boolean;
  isLoading: boolean;
  onClick: () => void;
}

export function InterestBadge({ 
  id, 
  label, 
  isSelected, 
  isLoading, 
  onClick 
}: InterestBadgeProps) {
  return (
    <Badge
      key={id}
      variant={isSelected ? "default" : "outline"}
      className={`cursor-pointer hover:opacity-80 ${
        isLoading ? 'opacity-50 pointer-events-none' : ''
      } ${
        isSelected 
          ? 'bg-teal-500 hover:bg-teal-600' 
          : 'hover:bg-teal-50'
      }`}
      onClick={onClick}
    >
      {label}
    </Badge>
  );
}
