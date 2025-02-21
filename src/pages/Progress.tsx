
import React, { useState, useEffect } from "react";
import { Brain, Clock, Trophy, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { StatCard } from "@/components/stats/StatCard";
import { WeeklyProgressChart } from "@/components/charts/WeeklyProgressChart";
import { SubjectDistribution } from "@/components/charts/SubjectDistribution";
import { MasteryProgress } from "@/components/progress/MasteryProgress";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

interface LearningStats {
  totalCards: number;
  completedReviews: number;
  averageScore: number;
  streakDays: number;
  timeSpent: number;
  subjects: { name: string; count: number }[];
  weeklyProgress: { day: string; reviews: number }[];
}

const ProgressPage = () => {
  const [stats, setStats] = useState<LearningStats>({
    totalCards: 0,
    completedReviews: 0,
    averageScore: 0,
    streakDays: 7,
    timeSpent: 0,
    subjects: [],
    weeklyProgress: []
  });

  useEffect(() => {
    const fetchLearningStats = async () => {
      const { data: cardsData, error: cardsError } = await supabase
        .from('cards')
        .select('*');

      if (!cardsError && cardsData) {
        const totalCards = cardsData.length;
        const completedReviews = cardsData.filter(card => card.review_count > 0).length;
        
        setStats({
          totalCards,
          completedReviews,
          averageScore: 85,
          streakDays: 7,
          timeSpent: 120,
          subjects: [
            { name: "Spanish", count: 45 },
            { name: "History", count: 30 },
            { name: "Science", count: 25 },
            { name: "Math", count: 20 },
            { name: "Geography", count: 15 }
          ],
          weeklyProgress: [
            { day: "Mon", reviews: 20 },
            { day: "Tue", reviews: 25 },
            { day: "Wed", reviews: 15 },
            { day: "Thu", reviews: 30 },
            { day: "Fri", reviews: 22 },
            { day: "Sat", reviews: 18 },
            { day: "Sun", reviews: 28 }
          ]
        });
      }
    };

    fetchLearningStats();
  }, []);

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Learning Progress</h1>
        <p className="text-gray-500">Track your learning journey and achievements</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={Brain} 
          label="Total Cards" 
          value={stats.totalCards} 
          color="bg-blue-500"
        />
        <StatCard 
          icon={Zap} 
          label="Reviews Completed" 
          value={stats.completedReviews} 
          color="bg-green-500"
        />
        <StatCard 
          icon={Trophy} 
          label="Current Streak" 
          value={`${stats.streakDays} days`} 
          color="bg-yellow-500"
        />
        <StatCard 
          icon={Clock} 
          label="Time Spent" 
          value={`${stats.timeSpent} mins`} 
          color="bg-purple-500"
        />
      </div>

      <WeeklyProgressChart data={stats.weeklyProgress} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SubjectDistribution subjects={stats.subjects} colors={COLORS} />
        <MasteryProgress 
          averageScore={stats.averageScore}
          subjects={stats.subjects}
          totalCards={stats.totalCards}
        />
      </div>
    </div>
  );
};

export default ProgressPage;
