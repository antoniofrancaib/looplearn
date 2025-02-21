
import { Loader2 } from "lucide-react"
import { AnimatePresence } from "framer-motion"
import { useQuery } from "@tanstack/react-query"
import { useExploreCards } from "@/hooks/useExploreCards"
import { ExploreCardView } from "@/components/explore/ExploreCardView"
import { EmptyExploreState } from "@/components/explore/EmptyExploreState"

const Explore = () => {
  const {
    interests,
    loadingInterests,
    loadingCards,
    currentCard,
    handleCardView,
    generateMoreCards,
    generateInitialCards,
  } = useExploreCards()

  // Call generateInitialCards when the component mounts and we have interests
  useQuery({
    queryKey: ['initial-cards', interests?.length],
    queryFn: generateInitialCards,
    enabled: !!interests && interests.length > 0,
  })

  if (loadingInterests) {
    return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>
  }

  if (!interests?.length) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Select Your Interests</h2>
        <p>Please select some interests on the interests page to see personalized flashcards.</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
        Explore
      </h1>

      <AnimatePresence mode="popLayout">
        {loadingCards ? (
          <div className="flex justify-center p-8">
            <Loader2 className="animate-spin" />
          </div>
        ) : currentCard ? (
          <ExploreCardView
            card={currentCard}
            onNext={handleCardView}
          />
        ) : (
          <EmptyExploreState
            onGenerateMore={generateMoreCards}
            isPending={false}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default Explore

