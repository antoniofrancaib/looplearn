
import { Button } from "@/components/ui/button";
import { Activity, Heart, Trophy, Users, Compass, Mic, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ProfileMenu } from "@/components/ProfileMenu";

interface SidebarItem {
  title: string;
  icon: typeof Activity;
  description: string;
  url: string;
}

const sidebarItems: SidebarItem[] = [
  {
    title: "Progress",
    icon: Activity,
    description: "Track your learning journey",
    url: "/progress"
  },
  {
    title: "Deep Dive",
    icon: BookOpen,
    description: "Explore academic papers",
    url: "/deep-dive"
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

export const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <div className="hidden md:flex w-[15%] min-w-[200px] border-r border-r-teal-100/20 bg-white">
      <div className="flex flex-col w-full">
        <div className="p-4 border-b border-r-teal-100/20">
          <ProfileMenu className="w-full" />
        </div>
        
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
  );
};
