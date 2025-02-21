
import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

interface FlashcardProps {
  front: string;
  back: string;
  onNext: () => void;
}

export const Flashcard = ({ front, back, onNext }: FlashcardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleClick = () => {
    if (isFlipped) {
      setIsFlipped(false);
      onNext();
    } else {
      setIsFlipped(true);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <div className="relative h-[200px]" style={{ perspective: "1000px" }}>
        <motion.div
          className="w-full h-full cursor-pointer absolute"
          onClick={handleClick}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6 }}
          style={{ 
            transformStyle: "preserve-3d",
          }}
        >
          <Card className={`w-full h-full p-6 shadow-lg absolute backface-hidden ${!isFlipped ? 'visible' : 'invisible'}`}>
            <div className="text-center text-xl">
              {front}
            </div>
          </Card>

          <Card className={`w-full h-full p-6 shadow-lg absolute backface-hidden ${isFlipped ? 'visible' : 'invisible'}`}
               style={{ 
                 transform: "rotateY(180deg)",
               }}>
            <div className="text-center text-xl">
              {back}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
