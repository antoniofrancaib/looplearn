
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-white p-8 text-center">
      <h1 className="animate-fade-in bg-gradient-to-r from-primary to-secondary bg-clip-text text-6xl font-bold text-transparent sm:text-7xl">
        Master Anything
      </h1>
      
      <p className="animate-fade-in [animation-delay:200ms] mt-4 max-w-lg text-gray-600 md:text-lg">
        Designed for the way your brain works.
      </p>
      
      <Button 
        size="lg" 
        className="group mt-8 animate-fade-in [animation-delay:400ms] text-lg"
        onClick={() => navigate('/auth')}
      >
        Get Started
        <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
      </Button>

      <div className="mt-24 grid grid-cols-1 gap-12 md:grid-cols-3 animate-fade-in [animation-delay:600ms]">
        <div className="flex flex-col items-center space-y-2">
          <h2 className="text-xl font-bold text-gray-900">Simple</h2>
          <p className="text-gray-600">Create flashcards in seconds</p>
        </div>
        <div className="flex flex-col items-center space-y-2">
          <h2 className="text-xl font-bold text-gray-900">Smart</h2>
          <p className="text-gray-600">Learn at the perfect pace</p>
        </div>
        <div className="flex flex-col items-center space-y-2">
          <h2 className="text-xl font-bold text-gray-900">Scientific</h2>
          <p className="text-gray-600">Based on proven methods</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
