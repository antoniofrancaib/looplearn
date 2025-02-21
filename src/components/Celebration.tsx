import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { useEffect } from "react";

interface CelebrationProps {
  show: boolean;
  onComplete: () => void;
  sparksEarned: number;
}

export function Celebration({ show, onComplete, sparksEarned }: CelebrationProps) {
  useEffect(() => {
    if (show) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#14b8a6', '#2dd4bf', '#99f6e4'],
      });

      const timer = setTimeout(onComplete, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -20 }}
          className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
        >
          <div className="bg-teal-500 text-white px-8 py-6 rounded-lg shadow-lg text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.5 }}
              className="text-2xl font-bold mb-2"
            >
              Nice Job! 🎉
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-teal-50"
            >
              +{sparksEarned} Sparks
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 