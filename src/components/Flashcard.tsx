
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface FlashcardProps {
  front: string;
  back: string;
  onDifficultySelect: (difficulty: 'forgot' | 'struggled' | 'easy') => void;
}

export const Flashcard = ({ front, back, onDifficultySelect }: FlashcardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <motion.div
        className="cursor-pointer perspective-1000"
        onClick={handleFlip}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="w-full min-h-[200px] p-6 shadow-lg">
          <div className="text-center text-xl">
            {isFlipped ? back : front}
          </div>
        </Card>
      </motion.div>

      <div className="mt-6 flex justify-center space-x-4">
        <Button
          variant="destructive"
          onClick={() => onDifficultySelect('forgot')}
          disabled={!isFlipped}
        >
          Forgot (1 day)
        </Button>
        <Button
          variant="outline"
          onClick={() => onDifficultySelect('struggled')}
          disabled={!isFlipped}
        >
          Struggled (2 days)
        </Button>
        <Button
          className="bg-green-600 hover:bg-green-700"
          onClick={() => onDifficultySelect('easy')}
          disabled={!isFlipped}
        >
          Easy (5 days)
        </Button>
      </div>
    </div>
  );
};
