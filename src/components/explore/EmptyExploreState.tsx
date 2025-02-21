
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { motion } from "framer-motion"

interface EmptyExploreStateProps {
  onGenerateMore: () => void
  isPending: boolean
}

export const EmptyExploreState = ({ onGenerateMore, isPending }: EmptyExploreStateProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center p-8 space-y-4"
    >
      <p className="text-lg text-gray-600">No more cards to explore!</p>
      <Button
        onClick={onGenerateMore}
        disabled={isPending}
        className="bg-gradient-to-r from-teal-600 to-blue-600 text-white"
      >
        <Plus className="h-4 w-4 mr-2" />
        Generate 5 More Cards
      </Button>
    </motion.div>
  )
}

