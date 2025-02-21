
import { Outlet } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useState, useEffect } from "react";
import { useRewards } from "@/contexts/RewardsContext";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ProfileMenu } from "./ProfileMenu";
import { StatsList } from "./dashboard/StatsList";
import { Sidebar } from "./dashboard/Sidebar";

const DashboardLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { dailyProgress } = useRewards();
  const [completedDays, setCompletedDays] = useState<Date[]>([]);

  // Fetch user activity data for the last 7 days
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
      } else if (error) {
        console.error('Error fetching user activity:', error);
      }
    };

    fetchUserActivity();
  }, []);

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
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 w-[70%] min-h-screen p-8 dashboard-texture">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>

        {/* Right Sidebar - Quick Stats */}
        <aside className="hidden md:block w-[15%] min-w-[200px] border-l border-l-teal-100/20 bg-white/50 backdrop-blur-sm">
          <div className="sticky top-0 p-4 h-screen overflow-y-auto scrollbar-hide bg-gradient-to-b from-teal-50/20 to-white/20 border-l-2 border-gradient-to-b from-teal-400/20 to-blue-400/20">
            <h3 className="text-sm font-semibold mb-4">Quick Stats</h3>
            <StatsList 
              dailyProgress={dailyProgress}
              completedDays={completedDays}
            />
          </div>
        </aside>

        {/* Mobile Stats Sheet */}
        <Sheet>
          <SheetTrigger asChild className="fixed bottom-4 right-4 md:hidden">
            <Button size="lg" className="rounded-full shadow-lg bg-teal-500 hover:bg-teal-600">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent className="w-[300px] sm:w-[400px] bg-white/95 backdrop-blur-sm">
            <h2 className="text-lg font-semibold mb-4">Quick Stats</h2>
            <StatsList 
              dailyProgress={dailyProgress}
              completedDays={completedDays}
            />
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default DashboardLayout;
