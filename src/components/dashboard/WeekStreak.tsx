
import { Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, subDays, startOfToday, isEqual } from 'date-fns';

interface WeekStreakProps {
  completedDays: Date[];
}

export const WeekStreak = ({ completedDays }: WeekStreakProps) => {
  const last5Days = Array.from({ length: 5 }).map((_, index) => {
    const date = subDays(startOfToday(), 4 - index);
    const isCompleted = completedDays.some(completedDate => 
      isEqual(new Date(completedDate), date)
    );
    return {
      date,
      isCompleted,
      dayLabel: format(date, 'EEE'),
    };
  });

  return (
    <div className="p-3 rounded-lg bg-white/80 shadow-sm border border-teal-50">
      <div className="flex items-center gap-2 mb-3">
        <Trophy className="h-4 w-4 text-teal-500" />
        <p className="text-xs text-gray-500">Week Streak</p>
      </div>
      <div className="flex gap-1 justify-between">
        {last5Days.map(({ date, isCompleted, dayLabel }) => (
          <div key={dayLabel} className="flex flex-col items-center gap-1">
            <div 
              className={cn(
                "w-8 h-8 rounded-md transition-colors",
                isCompleted 
                  ? "bg-teal-500 shadow-sm" 
                  : "bg-gray-100 border border-gray-200"
              )}
            />
            <span className="text-xs text-gray-500">{dayLabel}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
