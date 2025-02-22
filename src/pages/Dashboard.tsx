
import { useState } from "react";
import { NewDeckDialog } from "@/components/NewDeckDialog";
import { PersonalizedFeed } from "@/components/PersonalizedFeed";
import { AllDecksGrid } from "@/components/AllDecksGrid";
import { DashboardActions } from "@/components/dashboard/DashboardActions";
import { ActiveDecks } from "@/components/dashboard/ActiveDecks";
import { useDashboardData } from "@/hooks/useDashboardData";
import { DeepDive } from "@/components/dashboard/DeepDive";

const Dashboard = () => {
  const [newDeckDialogOpen, setNewDeckDialogOpen] = useState(false);
  const {
    decks,
    selectedDecks,
    handleSelectedDecksChange,
  } = useDashboardData();

  return (
    <div className="space-y-8">
      {/* Personalized Feed */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Your Personal Feed</h2>
        <PersonalizedFeed selectedInterests={[]} />
      </div>

      {/* Create New Deck and Review Today Buttons */}
      <DashboardActions onNewDeckClick={() => setNewDeckDialogOpen(true)} />

      {/* Deep Dive Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Deep Dive</h2>
        <DeepDive />
      </div>

      {/* Active Decks */}
      <ActiveDecks 
        decks={decks}
        selectedDecks={selectedDecks}
      />

      {/* All Decks Grid */}
      <AllDecksGrid 
        decks={decks.map(deck => ({
          ...deck,
          progress: Math.floor(Math.random() * 100),
        }))} 
        selectedDecks={selectedDecks}
        onSelectedDecksChange={handleSelectedDecksChange}
      />

      <NewDeckDialog 
        open={newDeckDialogOpen} 
        onOpenChange={setNewDeckDialogOpen}
      />
    </div>
  );
};

export default Dashboard;
