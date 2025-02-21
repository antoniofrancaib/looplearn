
import { Outlet } from "react-router-dom";
import { ProfileMenu } from "./ProfileMenu";
import { Button } from "@/components/ui/button";
import { Menu, BarChart2, Home, Library, Settings, Star, Timer, Trophy, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useRewards } from "@/contexts/RewardsContext";
import { Progress } from "@/components/ui/progress";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { motion } from "framer-motion";

const DashboardLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { sparks, dailyProgress } = useRewards();
  const [timeSpent, setTimeSpent] = useState(0);
  const [topDeck, setTopDeck] = useState({ name: "French Basics", timeSpent: 45 });

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
            className="h-2 bg-teal-100"
            indicatorClassName="bg-teal-500"
          />
          <p className="text-sm font-medium text-teal-700">
            {dailyProgress.completed}/{dailyProgress.total} decks
          </p>
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
              <Button variant="ghost" className="justify-start gap-2 w-full">
                <Home className="h-4 w-4" /> Home
              </Button>
              <Button variant="ghost" className="justify-start gap-2 w-full">
                <Library className="h-4 w-4" /> My Decks
              </Button>
              <Button variant="ghost" className="justify-start gap-2 w-full">
                <Star className="h-4 w-4" /> Favorites
              </Button>
              <Button variant="ghost" className="justify-start gap-2 w-full">
                <Settings className="h-4 w-4" /> Settings
              </Button>
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
