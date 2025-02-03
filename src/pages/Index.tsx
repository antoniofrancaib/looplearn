import { useState } from "react";
import { Flashcard } from "@/components/Flashcard";
import { StudyProgress } from "@/components/StudyProgress";

// Sample flashcards data - in a real app, this would come from a database
const sampleFlashcards = [
  {
    id: 1,
    front: "What is the capital of France?",
    back: "Paris",
  },
  {
    id: 2,
    front: "What is the largest planet in our solar system?",
    back: "Jupiter",
  },
  {
    id: 3,
    front: "Who painted the Mona Lisa?",
    back: "Leonardo da Vinci",
  },
];

const Index = () => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);

  const handleResult = (isCorrect: boolean) => {
    if (isCorrect) {
      setCorrect(prev => prev + 1);
    }
    setTotal(prev => prev + 1);
    
    // Move to next card after a short delay
    setTimeout(() => {
      setCurrentCardIndex((prev) => (prev + 1) % sampleFlashcards.length);
    }, 1000);
  };

  const currentCard = sampleFlashcards[currentCardIndex];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="container py-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-primary">
          Flashcard Study
        </h1>
        
        <StudyProgress correct={correct} total={total} />
        
        <div className="mt-8">
          <Flashcard
            front={currentCard.front}
            back={currentCard.back}
            onResult={handleResult}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;