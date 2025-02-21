
export type Interest = 
  | "science" 
  | "tech" 
  | "history" 
  | "art" 
  | "sports" 
  | "languages" 
  | "travel" 
  | "music"
  | "cooking"
  | "photography"
  | "literature"
  | "gaming"
  | "nature"
  | "business"
  | "psychology"
  | "philosophy"
  | "cinema"
  | "dance"
  | "astronomy"
  | "mathematics";

export interface InterestOption {
  id: Interest;
  label: string;
  defaultSelected: boolean;
}

export const interests: ReadonlyArray<InterestOption> = [
  { id: 'science', label: 'Science', defaultSelected: true },
  { id: 'tech', label: 'Technology', defaultSelected: true },
  { id: 'history', label: 'History', defaultSelected: false },
  { id: 'art', label: 'Art', defaultSelected: false },
  { id: 'sports', label: 'Sports', defaultSelected: false },
  { id: 'languages', label: 'Languages', defaultSelected: false },
  { id: 'travel', label: 'Travel', defaultSelected: false },
  { id: 'music', label: 'Music', defaultSelected: false },
  { id: 'cooking', label: 'Cooking', defaultSelected: false },
  { id: 'photography', label: 'Photography', defaultSelected: false },
  { id: 'literature', label: 'Literature', defaultSelected: false },
  { id: 'gaming', label: 'Gaming', defaultSelected: false },
  { id: 'nature', label: 'Nature', defaultSelected: false },
  { id: 'business', label: 'Business', defaultSelected: false },
  { id: 'psychology', label: 'Psychology', defaultSelected: false },
  { id: 'philosophy', label: 'Philosophy', defaultSelected: false },
  { id: 'cinema', label: 'Cinema', defaultSelected: false },
  { id: 'dance', label: 'Dance', defaultSelected: false },
  { id: 'astronomy', label: 'Astronomy', defaultSelected: false },
  { id: 'mathematics', label: 'Mathematics', defaultSelected: false },
] as const;
