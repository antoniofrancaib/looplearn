
import { BookOpen, Trophy } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { StatCard } from "./StatCard";
import { WeekStreak } from "./WeekStreak";
import { UpcomingReviews } from "./UpcomingReviews";

interface StatsListProps {
  dailyProgress: {
    completed: number;
    total: number;
  };
  completedDays: Date[];
}

export const StatsList = ({ 
  dailyProgress, 
  completedDays,
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
  </div>
);
