
import { BookOpen, Trophy, BarChart2, Star, Timer } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { StatCard } from "./StatCard";
import { WeekStreak } from "./WeekStreak";
import { UpcomingReviews } from "./UpcomingReviews";

interface StatsListProps {
  sparks: number;
  dailyProgress: {
    completed: number;
    total: number;
  };
  completedDays: Date[];
  timeSpent: number;
  topDeck: {
    name: string;
    timeSpent: number;
  };
}

export const StatsList = ({ 
  sparks, 
  dailyProgress, 
  completedDays, 
  timeSpent, 
  topDeck 
}: StatsListProps) => (
  <div className="space-y-4">
    <StatCard 
      icon={BookOpen} 
      label="Today's Cards" 
      value="15" 
    />
    <StatCard 
      icon={Trophy} 
      label="Streak" 
      value="7 days" 
    />
    <StatCard 
      icon={BarChart2} 
      label="Completion Rate" 
      value="85%" 
    />
    <StatCard 
      icon={Star} 
      label="Sparks" 
      value={sparks}
      pulseKey={sparks} 
    />
    <div className="p-3 rounded-lg bg-white/80 shadow-sm border border-teal-50">
      <p className="text-xs text-gray-500 mb-2">Daily Goal</p>
      <div className="space-y-2">
        <Progress 
          value={(dailyProgress.completed / dailyProgress.total) * 100} 
          className="h-2 [&>div]:bg-teal-500 bg-teal-100"
        />
        <p className="text-sm font-medium text-teal-700">
          {dailyProgress.completed}/{dailyProgress.total} decks
        </p>
      </div>
    </div>

    <WeekStreak completedDays={completedDays} />
    <UpcomingReviews />

    <StatCard 
      icon={Timer} 
      label="Time Spent" 
      value={`${timeSpent} mins`}
      pulseKey={timeSpent}
    />
    <div className="p-3 rounded-lg bg-white/80 shadow-sm border border-teal-50">
      <div className="flex items-center gap-2 mb-1">
        <Star className="h-4 w-4 text-teal-500" />
        <p className="text-xs text-gray-500">Top Deck</p>
      </div>
      <p className="text-xl font-semibold text-teal-600">{topDeck.name}</p>
    </div>
  </div>
);
