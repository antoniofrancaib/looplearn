
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { Brain, Calendar, Clock, Trophy, Zap } from "lucide-react";

interface LearningStats {
  totalCards: number;
  completedReviews: number;
  averageScore: number;
  streakDays: number;
  timeSpent: number;
  subjects: { name: string; count: number }[];
  weeklyProgress: { day: string; reviews: number }[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const Progress = () => {
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
        // Calculate stats from cards data
        const totalCards = cardsData.length;
        const completedReviews = cardsData.filter(card => card.review_count > 0).length;
        
        // Mock data for demonstration - in a real app, this would come from actual user data
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

  const StatCard = ({ icon: Icon, label, value, color }: { 
    icon: React.ElementType;
    label: string;
    value: string | number;
    color: string;
  }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          <div className={`p-3 rounded-full ${color}`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="text-sm text-gray-500">{label}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Learning Progress</h1>
        <p className="text-gray-500">Track your learning journey and achievements</p>
      </div>

      {/* Key Stats */}
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

      {/* Weekly Progress Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Review Activity</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.weeklyProgress}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="reviews" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Subject Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Subject Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.subjects}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="count"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {stats.subjects.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mastery Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Overall Progress</span>
                <span>{stats.averageScore}%</span>
              </div>
              <Progress value={stats.averageScore} className="h-2" />
            </div>
            {stats.subjects.map((subject, index) => (
              <div key={subject.name} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{subject.name}</span>
                  <span>{Math.round((subject.count / stats.totalCards) * 100)}%</span>
                </div>
                <Progress 
                  value={Math.round((subject.count / stats.totalCards) * 100)} 
                  className="h-2"
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Progress;
