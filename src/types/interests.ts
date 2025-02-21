
export type InterestCategory = 
  | "Core Academics"
  | "Creative Arts"
  | "Lifestyle & Hobbies"
  | "Human Sciences"
  | "Niche Passions";

export type Interest = 
  // Core Academics
  | "science" | "technology" | "history" | "mathematics" | "literature"
  | "physics" | "chemistry" | "biology" | "geography" | "economics"
  | "political_science" | "sociology"
  // Creative Arts
  | "art" | "music" | "cinema" | "dance" | "photography" | "theater"
  | "creative_writing" | "graphic_design" | "fashion_design" | "architecture"
  | "poetry" | "sculpture"
  // Lifestyle & Hobbies
  | "sports" | "travel" | "cooking" | "gaming" | "nature" | "fitness"
  | "gardening" | "diy_crafts" | "fishing" | "hiking" | "yoga" | "board_games"
  // Human Sciences
  | "psychology" | "philosophy" | "business" | "anthropology" | "sociology"
  | "education" | "linguistics" | "ethics" | "leadership" | "communication"
  | "behavioral_economics" | "cultural_studies"
  // Niche Passions
  | "astronomy" | "languages" | "programming" | "environmental_studies"
  | "mythology" | "robotics" | "cryptocurrency" | "artificial_intelligence"
  | "quantum_physics" | "oceanography" | "archaeology" | "paleontology";

export interface InterestOption {
  id: Interest;
  label: string;
  category: InterestCategory;
  defaultSelected: boolean;
}

export const interestCategories: InterestCategory[] = [
  "Core Academics",
  "Creative Arts",
  "Lifestyle & Hobbies",
  "Human Sciences",
  "Niche Passions"
];

export const interests: ReadonlyArray<InterestOption> = [
  // Core Academics
  { id: 'science', label: 'Science', category: 'Core Academics', defaultSelected: true },
  { id: 'technology', label: 'Technology', category: 'Core Academics', defaultSelected: true },
  { id: 'history', label: 'History', category: 'Core Academics', defaultSelected: false },
  { id: 'mathematics', label: 'Mathematics', category: 'Core Academics', defaultSelected: false },
  { id: 'literature', label: 'Literature', category: 'Core Academics', defaultSelected: false },
  { id: 'physics', label: 'Physics', category: 'Core Academics', defaultSelected: false },
  { id: 'chemistry', label: 'Chemistry', category: 'Core Academics', defaultSelected: false },
  { id: 'biology', label: 'Biology', category: 'Core Academics', defaultSelected: false },
  { id: 'geography', label: 'Geography', category: 'Core Academics', defaultSelected: false },
  { id: 'economics', label: 'Economics', category: 'Core Academics', defaultSelected: false },
  { id: 'political_science', label: 'Political Science', category: 'Core Academics', defaultSelected: false },
  { id: 'sociology', label: 'Sociology', category: 'Core Academics', defaultSelected: false },

  // Creative Arts
  { id: 'art', label: 'Art', category: 'Creative Arts', defaultSelected: false },
  { id: 'music', label: 'Music', category: 'Creative Arts', defaultSelected: false },
  { id: 'cinema', label: 'Cinema', category: 'Creative Arts', defaultSelected: false },
  { id: 'dance', label: 'Dance', category: 'Creative Arts', defaultSelected: false },
  { id: 'photography', label: 'Photography', category: 'Creative Arts', defaultSelected: false },
  { id: 'theater', label: 'Theater', category: 'Creative Arts', defaultSelected: false },
  { id: 'creative_writing', label: 'Writing (Creative)', category: 'Creative Arts', defaultSelected: false },
  { id: 'graphic_design', label: 'Graphic Design', category: 'Creative Arts', defaultSelected: false },
  { id: 'fashion_design', label: 'Fashion Design', category: 'Creative Arts', defaultSelected: false },
  { id: 'architecture', label: 'Architecture', category: 'Creative Arts', defaultSelected: false },
  { id: 'poetry', label: 'Poetry', category: 'Creative Arts', defaultSelected: false },
  { id: 'sculpture', label: 'Sculpture', category: 'Creative Arts', defaultSelected: false },

  // Lifestyle & Hobbies
  { id: 'sports', label: 'Sports', category: 'Lifestyle & Hobbies', defaultSelected: false },
  { id: 'travel', label: 'Travel', category: 'Lifestyle & Hobbies', defaultSelected: false },
  { id: 'cooking', label: 'Cooking', category: 'Lifestyle & Hobbies', defaultSelected: false },
  { id: 'gaming', label: 'Gaming', category: 'Lifestyle & Hobbies', defaultSelected: false },
  { id: 'nature', label: 'Nature', category: 'Lifestyle & Hobbies', defaultSelected: false },
  { id: 'fitness', label: 'Fitness', category: 'Lifestyle & Hobbies', defaultSelected: false },
  { id: 'gardening', label: 'Gardening', category: 'Lifestyle & Hobbies', defaultSelected: false },
  { id: 'diy_crafts', label: 'DIY Crafts', category: 'Lifestyle & Hobbies', defaultSelected: false },
  { id: 'fishing', label: 'Fishing', category: 'Lifestyle & Hobbies', defaultSelected: false },
  { id: 'hiking', label: 'Hiking', category: 'Lifestyle & Hobbies', defaultSelected: false },
  { id: 'yoga', label: 'Yoga', category: 'Lifestyle & Hobbies', defaultSelected: false },
  { id: 'board_games', label: 'Board Games', category: 'Lifestyle & Hobbies', defaultSelected: false },

  // Human Sciences
  { id: 'psychology', label: 'Psychology', category: 'Human Sciences', defaultSelected: false },
  { id: 'philosophy', label: 'Philosophy', category: 'Human Sciences', defaultSelected: false },
  { id: 'business', label: 'Business', category: 'Human Sciences', defaultSelected: false },
  { id: 'anthropology', label: 'Anthropology', category: 'Human Sciences', defaultSelected: false },
  { id: 'sociology', label: 'Sociology', category: 'Human Sciences', defaultSelected: false },
  { id: 'education', label: 'Education', category: 'Human Sciences', defaultSelected: false },
  { id: 'linguistics', label: 'Linguistics', category: 'Human Sciences', defaultSelected: false },
  { id: 'ethics', label: 'Ethics', category: 'Human Sciences', defaultSelected: false },
  { id: 'leadership', label: 'Leadership', category: 'Human Sciences', defaultSelected: false },
  { id: 'communication', label: 'Communication', category: 'Human Sciences', defaultSelected: false },
  { id: 'behavioral_economics', label: 'Behavioral Economics', category: 'Human Sciences', defaultSelected: false },
  { id: 'cultural_studies', label: 'Cultural Studies', category: 'Human Sciences', defaultSelected: false },

  // Niche Passions
  { id: 'astronomy', label: 'Astronomy', category: 'Niche Passions', defaultSelected: false },
  { id: 'languages', label: 'Languages', category: 'Niche Passions', defaultSelected: false },
  { id: 'programming', label: 'Programming', category: 'Niche Passions', defaultSelected: false },
  { id: 'environmental_studies', label: 'Environmental Studies', category: 'Niche Passions', defaultSelected: false },
  { id: 'mythology', label: 'Mythology', category: 'Niche Passions', defaultSelected: false },
  { id: 'robotics', label: 'Robotics', category: 'Niche Passions', defaultSelected: false },
  { id: 'cryptocurrency', label: 'Cryptocurrency', category: 'Niche Passions', defaultSelected: false },
  { id: 'artificial_intelligence', label: 'Artificial Intelligence', category: 'Niche Passions', defaultSelected: false },
  { id: 'quantum_physics', label: 'Quantum Physics', category: 'Niche Passions', defaultSelected: false },
  { id: 'oceanography', label: 'Oceanography', category: 'Niche Passions', defaultSelected: false },
  { id: 'archaeology', label: 'Archaeology', category: 'Niche Passions', defaultSelected: false },
  { id: 'paleontology', label: 'Paleontology', category: 'Niche Passions', defaultSelected: false },
] as const;
