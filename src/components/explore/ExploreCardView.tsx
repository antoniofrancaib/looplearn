
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Flashcard } from "@/components/Flashcard"
import type { ExploreCard } from "@/hooks/useExploreCards"

interface ExploreCardViewProps {
  card: ExploreCard
  onNext: (cardId: string) => void
}

export const ExploreCardView = ({ card, onNext }: ExploreCardViewProps) => {
  return (
    <motion.div
      key={card.id}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Card className="overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            Topic: {card.interest}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Flashcard
            front={card.front_content}
            back={card.back_content}
            onNext={() => onNext(card.id)}
          />
        </CardContent>
      </Card>
    </motion.div>
  )
}

