import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Clock, Layout } from "lucide-react";
import { useRef, useState } from "react";

interface DeckPreviewProps {
  deck: {
    id: string;
    title: string;
    description: string | null;
    card_count: number;
    progress: number;
  };
  onSelect: (deckId: string) => void;
}

const DeckPreview = ({ deck, onSelect }: DeckPreviewProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="relative"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
    >
      <Card
        className="w-[300px] p-6 cursor-pointer bg-gradient-to-br from-teal-500 to-teal-600 text-white overflow-visible"
        onClick={() => onSelect(deck.id)}
      >
        <h3 className="text-xl font-bold mb-2">{deck.title}</h3>
        <div className="space-y-4">
          <Progress 
            value={deck.progress} 
            className="h-2 bg-white/20" 
            indicatorClassName="bg-white" 
          />
          <div className="flex items-center justify-between text-sm text-teal-50">
            <div className="flex items-center gap-1">
              <Layout className="h-4 w-4" />
              <span>{deck.card_count} cards</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>~{Math.ceil(deck.card_count * 0.5)} mins</span>
            </div>
          </div>
        </div>

        {/* Holographic Preview */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              className="absolute -top-20 left-1/2 -translate-x-1/2 flex gap-2 pointer-events-none"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-32 h-48 bg-white rounded-lg shadow-lg"
                  initial={{ rotate: 0 }}
                  animate={{
                    rotate: [-15 + (i * 15), -10 + (i * 15)],
                    y: [0, -5, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse",
                    delay: i * 0.1,
                  }}
                  style={{
                    boxShadow: "0 0 20px rgba(45, 212, 191, 0.3)",
                    transform: `translateX(${(i - 1) * 30}px) translateZ(${i * 10}px)`,
                  }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
};

export function DeckCarousel({ decks, onDeckSelect }: {
  decks: Array<{
    id: string;
    title: string;
    description: string | null;
    card_count: number;
    progress: number;
  }>;
  onDeckSelect: (deckId: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = () => setIsDragging(true);
  const handleDragEnd = () => {
    setTimeout(() => setIsDragging(false), 0);
  };

  return (
    <div className="relative group">
      <div
        ref={containerRef}
        className="overflow-x-auto pb-8 pt-20 -mt-20 scrollbar-hide"
      >
        <motion.div
          className="flex gap-4 px-4"
          drag="x"
          dragConstraints={containerRef}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          {decks.map((deck) => (
            <DeckPreview
              key={deck.id}
              deck={deck}
              onSelect={(deckId) => !isDragging && onDeckSelect(deckId)}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
} 