
import { useState } from "react";
import { motion, PanInfo } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface FlashcardProps {
  front: string;
  back: string;
  onNext?: () => void;
  onDifficultySelect?: (difficulty: 'forgot' | 'struggled' | 'easy') => void;
}

export const Flashcard = ({ front, back, onNext, onDifficultySelect }: FlashcardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleDragStart = (event: any, info: PanInfo) => {
    setDragStart({ x: info.point.x, y: info.point.y });
  };

  const handleDragEnd = (event: any, info: PanInfo) => {
    const dragDistance = Math.abs(info.point.x - dragStart.x);
    const dragThreshold = 50; // minimum distance to trigger action

    if (dragDistance > dragThreshold) {
      if (isFlipped) {
        // If card is flipped, swiping will go to next card
        setIsFlipped(false);
        onNext?.();
      } else {
        // If card is not flipped, swiping will flip it
        setIsFlipped(true);
      }
    }
  };

  const handleTap = () => {
    if (!onDifficultySelect) {
      if (isFlipped) {
        setIsFlipped(false);
        onNext?.();
      } else {
        setIsFlipped(true);
      }
    } else {
      setIsFlipped(!isFlipped);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <div className="relative h-[200px]" style={{ perspective: "1000px" }}>
        <motion.div
          className="w-full h-full cursor-pointer absolute"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6 }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onTap={handleTap}
          style={{ 
            transformStyle: "preserve-3d",
          }}
        >
          <Card className={`w-full h-full p-6 shadow-lg absolute backface-hidden ${!isFlipped ? 'visible' : 'invisible'}`}>
            <div className="text-center text-xl">
              {front}
            </div>
          </Card>

          <Card 
            className={`w-full h-full p-6 shadow-lg absolute backface-hidden ${isFlipped ? 'visible' : 'invisible'}`}
            style={{ 
              transform: "rotateY(180deg)",
            }}
          >
            <div className="text-center text-xl mb-4">
              {back}
            </div>
            
            {onDifficultySelect && isFlipped && (
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDifficultySelect('forgot');
                  }}
                >
                  Forgot
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDifficultySelect('struggled');
                  }}
                >
                  Struggled
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  className="bg-teal-500 hover:bg-teal-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDifficultySelect('easy');
                  }}
                >
                  Easy
                </Button>
              </div>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
