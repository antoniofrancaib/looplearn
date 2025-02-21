import { createContext, useContext, useState, useEffect } from "react";

interface RewardsContextType {
  sparks: number;
  addSparks: (amount: number) => void;
  dailyProgress: {
    completed: number;
    total: number;
  };
  completeDeck: (deckId: string) => void;
}

const RewardsContext = createContext<RewardsContextType | undefined>(undefined);

export function RewardsProvider({ children }: { children: React.ReactNode }) {
  const [sparks, setSparks] = useState(0);
  const [dailyProgress, setDailyProgress] = useState({ completed: 0, total: 3 });

  const addSparks = (amount: number) => {
    setSparks((current) => current + amount);
  };

  const completeDeck = (deckId: string) => {
    setDailyProgress((current) => ({
      ...current,
      completed: Math.min(current.completed + 1, current.total),
    }));
    addSparks(50);
  };

  return (
    <RewardsContext.Provider
      value={{
        sparks,
        addSparks,
        dailyProgress,
        completeDeck,
      }}
    >
      {children}
    </RewardsContext.Provider>
  );
}

export const useRewards = () => {
  const context = useContext(RewardsContext);
  if (context === undefined) {
    throw new Error("useRewards must be used within a RewardsProvider");
  }
  return context;
}; 