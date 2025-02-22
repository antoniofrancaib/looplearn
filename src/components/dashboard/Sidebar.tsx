
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  BarChart2,
  BookOpen,
  Compass,
  Glasses,
  Home,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const Sidebar = () => {
  const location = useLocation();

  const links = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/explore", label: "Explore", icon: Compass },
    { href: "/progress", label: "Progress", icon: BarChart2 },
    { href: "/deep-dive", label: "Deep Dive", icon: Glasses },
    { href: "/interests", label: "Interests", icon: BookOpen },
    { href: "/personal-info", label: "Settings", icon: Settings },
  ];

  return (
    <aside className="hidden md:flex h-screen w-[70px] flex-col items-center justify-center border-r bg-white/50 backdrop-blur-sm">
      <nav className="space-y-2">
        {links.map(({ href, label, icon: Icon }) => (
          <Tooltip key={href} delayDuration={0}>
            <TooltipTrigger asChild>
              <Button
                asChild
                variant="ghost"
                size="icon"
                className={cn(
                  "h-10 w-10",
                  location.pathname === href &&
                    "bg-teal-100/50 text-teal-600 hover:bg-teal-100/75 hover:text-teal-600"
                )}
              >
                <Link to={href}>
                  <Icon className="h-5 w-5" />
                  <span className="sr-only">{label}</span>
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className="border-0">
              {label}
            </TooltipContent>
          </Tooltip>
        ))}
      </nav>
    </aside>
  );
};
