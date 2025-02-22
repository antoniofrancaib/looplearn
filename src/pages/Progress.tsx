
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, BookOpen, Calendar, Target } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { WeekStreak } from "@/components/dashboard/WeekStreak";
import { UpcomingReviews } from "@/components/dashboard/UpcomingReviews";
import { useRewards } from "@/contexts/RewardsContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const ProgressPage = () => {
  const { dailyProgress } = useRewards();
  const [completedDays, setCompletedDays] = useState<Date[]>([]);

  // Fetch user activity data for streak
  useEffect(() => {
    const fetchUserActivity = async () => {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const { data, error } = await supabase
        .from('user_daily_activity')
        .select('activity_date')
        .gte('activity_date', sevenDaysAgo.toISOString())
        .order('activity_date', { ascending: true });

      if (!error && data) {
        const activityDates = data.map(activity => new Date(activity.activity_date));
        setCompletedDays(activityDates);
      }
    };

    fetchUserActivity();
  }, []);

  return (
    <div className="container max-w-7xl mx-auto p-6 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Learning Progress</h1>
        <p className="text-muted-foreground">
          Track your learning journey and achievements
        </p>
      </div>

      {/* Daily Progress Section */}
      <Card className="p-6 bg-gradient-to-br from-teal-50 to-blue-50 border-teal-100">
        <CardContent className="p-0 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-teal-800">Daily Progress</h2>
            <span className="text-sm text-teal-600 font-medium">
              {dailyProgress.completed}/{dailyProgress.total} decks
            </span>
          </div>
          <Progress 
            value={(dailyProgress.completed / dailyProgress.total) * 100} 
            className="h-3 [&>div]:bg-teal-500"
          />
        </CardContent>
      </Card>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          icon={BookOpen} 
          label="Today's Cards" 
          value="15"
        />
        <StatCard 
          icon={Trophy} 
          label="Current Streak" 
          value="7 days"
        />
        <StatCard 
          icon={Calendar} 
          label="Study Sessions" 
          value="124"
        />
        <StatCard 
          icon={Target} 
          label="Cards Mastered" 
          value="486"
        />
      </div>

      {/* Detailed Stats Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white/80">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Weekly Activity</h3>
            <WeekStreak completedDays={completedDays} />
          </CardContent>
        </Card>

        <Card className="bg-white/80">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Upcoming Reviews</h3>
            <UpcomingReviews />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProgressPage;
