import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookmarkPlus } from "lucide-react";
import { useState } from "react";

interface FeedCard {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export function PersonalizedFeed({ 
  selectedInterests 
}: { 
  selectedInterests: string[] 
}) {
  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set());
  
  // Mock data - in real app, fetch based on interests
  const feedCards: FeedCard[] = [
    {
      id: '1',
      question: 'Did you know octopuses have three hearts?',
      answer: 'Two pump blood to the gills, while the third circulates it to the rest of the body.',
      category: 'science'
    },
    {
      id: '2',
      question: 'What programming language was created by Brendan Eich in 10 days?',
      answer: 'JavaScript was created in May 1995 for the Netscape Navigator web browser.',
      category: 'tech'
    },
    // Add more cards...
  ];

  const toggleCard = (cardId: string) => {
    const newFlipped = new Set(flippedCards);
    if (newFlipped.has(cardId)) {
      newFlipped.delete(cardId);
    } else {
      newFlipped.add(cardId);
    }
    setFlippedCards(newFlipped);
  };

  return (
    <div className="space-y-4">
      {feedCards
        .filter(card => selectedInterests.includes(card.category))
        .map(card => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="relative"
          >
            <Card
              className="overflow-hidden cursor-pointer group"
              onClick={() => toggleCard(card.id)}
            >
              <motion.div
                className="p-6"
                animate={{ rotateX: flippedCards.has(card.id) ? 180 : 0 }}
                transition={{ duration: 0.6, type: "spring" }}
                style={{ transformStyle: "preserve-3d" }}
              >
                <div
                  className={`transform ${
                    flippedCards.has(card.id) ? "rotate-x-180" : ""
                  }`}
                >
                  <p className="text-lg font-medium">
                    {flippedCards.has(card.id) ? card.answer : card.question}
                  </p>
                </div>
              </motion.div>
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="sm"
                  className="bg-teal-500 hover:bg-teal-600 text-white shadow-teal-200/50"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle save to deck
                  }}
                >
                  <BookmarkPlus className="w-4 h-4 mr-2" />
                  Save to Deck
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
    </div>
  );
} 