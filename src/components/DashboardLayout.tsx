import { Outlet, useNavigate } from "react-router-dom";
import { ProfileMenu } from "./ProfileMenu";
import { Button } from "@/components/ui/button";
import { BarChart2, Activity, Trophy, Users, Compass, Mic, Menu, Home, Library, Settings, Star, Timer, BookOpen, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useRewards } from "@/contexts/RewardsContext";
import { Progress } from "@/components/ui/progress";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { motion } from "framer-motion";
import { format, addDays, subDays, startOfToday, isEqual } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { supabase } from "@/integrations/supabase/client";

const DashboardLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { sparks, dailyProgress } = useRewards();
  const [timeSpent, setTimeSpent] = useState(0);
  const [topDeck, setTopDeck] = useState({ name: "French Basics", timeSpent: 45 });
  const [completedDays, setCompletedDays] = useState<Date[]>([]);
  const navigate = useNavigate();

  // Generate mock data for the frequency plot
  const upcomingReviews = Array.from({ length: 5 }).map((_, index) => ({
    date: format(addDays(new Date(), index), 'MMM dd'),
    cards: Math.floor(Math.random() * 20) + 5,
  }));

  // Fetch user activity data for the last 7 days
  useEffect(() => {
    const fetchUserActivity = async () => {
      const sevenDaysAgo = subDays(new Date(), 7).toISOString();
      
      const { data, error } = await supabase
        .from('user_daily_activity')
        .select('activity_date')
        .gte('activity_date', sevenDaysAgo)
        .order('activity_date', { ascending: true });

      if (!error && data) {
        const activityDates = data.map(activity => new Date(activity.activity_date));
        setCompletedDays(activityDates);
      } else if (error) {
        console.error('Error fetching user activity:', error);
      }
    };

    fetchUserActivity();
  }, []);

  // Generate last 5 days array for streak visualization
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

  // Simulate time tracking (in a real app, this would be actual tracking)
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const StatCard = ({ icon: Icon, label, value, pulseKey }: { 
    icon: React.ElementType, 
    label: string, 
    value: string | number,
    pulseKey?: number | string 
  }) => (
    <motion.div 
      key={pulseKey}
      initial={{ scale: 1 }}
      animate={pulseKey ? { scale: [1, 1.02, 1] } : {}}
      className="p-3 rounded-lg bg-white/80 shadow-sm border border-teal-50 hover:border-teal-200 transition-colors"
    >
      <div className="flex items-center gap-2 mb-1">
        <Icon className="h-4 w-4 text-teal-500" />
        <p className="text-xs text-gray-500">{label}</p>
      </div>
      <p className="text-xl font-semibold text-teal-600">{value}</p>
    </motion.div>
  );

  const WeekStreak = () => (
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

  const StatsList = () => (
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

      {/* Week Streak */}
      <WeekStreak />

      {/* Frequency Plot */}
      <div className="p-3 rounded-lg bg-white/80 shadow-sm border border-teal-50">
        <h3 className="text-sm font-semibold mb-2 text-gray-700">Upcoming Reviews</h3>
        <div className="h-[150px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={upcomingReviews} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis 
                dataKey="date" 
                stroke="#374151"
                fontSize={10}
                tickSize={5}
              />
              <YAxis 
                stroke="#374151"
                fontSize={10}
                tickSize={5}
              />
              <Tooltip />
              <Bar 
                dataKey="cards" 
                fill="#14b8a6" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

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

  const sidebarItems = [
    {
      title: "Progress",
      icon: Activity,
      description: "Track your learning journey",
      url: "/progress"
    },
    {
      title: "Interests",
      icon: Heart,
      description: "Manage your learning interests",
      url: "/interests"
    },
    {
      title: "Challenges",
      icon: Trophy,
      description: "Complete tasks, earn rewards",
      url: "/challenges"
    },
    {
      title: "Friends",
      icon: Users,
      description: "Connect and compete",
      url: "/friends"
    },
    {
      title: "Explore",
      icon: Compass,
      description: "Discover trending decks",
      url: "/explore"
    },
    {
      title: "Voice Hub",
      icon: Mic,
      description: "Voice-powered features",
      url: "/voice"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b bg-white/80 backdrop-blur-sm">
        <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(true)}>
          <Menu className="h-6 w-6" />
        </Button>
        <ProfileMenu />
      </div>

      <div className="flex">
        {/* Left Sidebar - Navigation */}
        <div className="hidden md:flex w-[15%] min-w-[200px] border-r border-r-teal-100/20 bg-white">
          <div className="flex flex-col w-full">
            {/* Profile Section at Top */}
            <div className="p-4 border-b border-r-teal-100/20">
              <ProfileMenu className="w-full" />
            </div>
            
            {/* Navigation Links */}
            <div className="flex flex-col gap-2 p-4">
              {sidebarItems.map((item) => (
                <Button
                  key={item.title}
                  variant="ghost"
                  className="justify-start gap-2 w-full group hover:bg-teal-50/50"
                  onClick={() => navigate(item.url)}
                >
                  <item.icon className="h-4 w-4 text-teal-600 group-hover:text-teal-700" />
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-medium">{item.title}</span>
                    <span className="text-xs text-gray-500 hidden group-hover:block">
                      {item.description}
                    </span>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 w-[70%] min-h-screen p-8 dashboard-texture">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>

        {/* Right Sidebar - Quick Stats */}
        <aside className="hidden md:block w-[15%] min-w-[200px] border-l border-l-teal-100/20 bg-white/50 backdrop-blur-sm">
          <div className="sticky top-0 p-4 h-screen overflow-y-auto scrollbar-hide bg-gradient-to-b from-teal-50/20 to-white/20 border-l-2 border-gradient-to-b from-teal-400/20 to-blue-400/20">
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
              <BarChart2 className="h-4 w-4" /> Quick Stats
            </h3>
            <StatsList />
          </div>
        </aside>

        {/* Mobile Stats Sheet */}
        <Sheet>
          <SheetTrigger asChild className="fixed bottom-4 right-4 md:hidden">
            <Button size="lg" className="rounded-full shadow-lg bg-teal-500 hover:bg-teal-600">
              <BarChart2 className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent className="w-[300px] sm:w-[400px] bg-white/95 backdrop-blur-sm">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <BarChart2 className="h-5 w-5" /> Quick Stats
            </h2>
            <StatsList />
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default DashboardLayout;
