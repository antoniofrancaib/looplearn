import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, X } from "lucide-react";

interface FlashcardProps {
  front: string;
  back: string;
  onResult: (correct: boolean) => void;
}

export const Flashcard = ({ front, back, onResult }: FlashcardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);

  const handleFlip = () => {
    if (!isAnswered) {
      setIsFlipped(!isFlipped);
    }
  };

  const handleAnswer = (correct: boolean) => {
    setIsAnswered(true);
    onResult(correct);
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
          variant="outline"
          className="bg-red-50 hover:bg-red-100"
          onClick={() => handleAnswer(false)}
          disabled={!isFlipped || isAnswered}
        >
          <X className="mr-2 h-4 w-4" />
          Incorrect
        </Button>
        <Button
          className="bg-success hover:bg-success/90"
          onClick={() => handleAnswer(true)}
          disabled={!isFlipped || isAnswered}
        >
          <Check className="mr-2 h-4 w-4" />
          Correct
        </Button>
      </div>
    </div>
  );
};