import { Outlet } from "react-router-dom";
import { ProfileMenu } from "./ProfileMenu";
import { Button } from "@/components/ui/button";
import { Menu, BarChart2, Home, Library, Settings, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useRewards } from "@/contexts/RewardsContext";
import { Sparkles } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const DashboardLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { sparks, dailyProgress } = useRewards();

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
        <aside className="hidden md:block w-[15%] min-w-[200px] border-l border-l-teal-100/20 bg-white/50 backdrop-blur-sm p-4">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <BarChart2 className="h-4 w-4" /> Quick Stats
          </h3>
          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-white/80 shadow-sm border border-teal-50">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="h-4 w-4 text-teal-500" />
                <p className="text-xs text-gray-500">Sparks</p>
              </div>
              <p className="text-xl font-semibold text-teal-600">{sparks}</p>
            </div>
            <div className="p-3 rounded-lg bg-white/80 shadow-sm border border-teal-50">
              <p className="text-xs text-gray-500 mb-2">Today's Goal</p>
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
            <div className="p-3 rounded-lg bg-white/80 shadow-sm border border-teal-50">
              <p className="text-xs text-gray-500">Today's Cards</p>
              <p className="text-xl font-semibold">15</p>
            </div>
            <div className="p-3 rounded-lg bg-white/80 shadow-sm border border-teal-50">
              <p className="text-xs text-gray-500">Streak</p>
              <p className="text-xl font-semibold">7 days</p>
            </div>
            <div className="p-3 rounded-lg bg-white/80 shadow-sm border border-teal-50">
              <p className="text-xs text-gray-500">Completion Rate</p>
              <p className="text-xl font-semibold">85%</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default DashboardLayout;
