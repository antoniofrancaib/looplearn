
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import DeckDetail from "./pages/DeckDetail";
import PersonalInfo from "./pages/PersonalInfo";
import Billing from "./pages/Billing";
import NotFound from "./pages/NotFound";
import DashboardLayout from "./components/DashboardLayout";
import InterestsPage from "./pages/Interests";
import Explore from "./pages/Explore";
import { RewardsProvider } from "@/contexts/RewardsContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <RewardsProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/deck/:deckId" element={<DeckDetail />} />
              <Route path="/personal-info" element={<PersonalInfo />} />
              <Route path="/billing" element={<Billing />} />
              <Route path="/interests" element={<InterestsPage />} />
              <Route path="/explore" element={<Explore />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </RewardsProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
