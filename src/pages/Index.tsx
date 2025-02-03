import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container max-w-6xl mx-auto px-4 py-24 flex flex-col items-center justify-center min-h-screen text-center">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 mb-6 animate-fade-in">
          Master Anything
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto mb-12 animate-fade-in [animation-delay:200ms]">
          Effortlessly learn and remember with our intelligent flashcard system.
          Designed for the way your brain works.
        </p>
        
        <Button 
          size="lg" 
          className="group animate-fade-in [animation-delay:400ms] text-lg"
          onClick={() => console.log("Navigate to dashboard")}
        >
          Get Started
          <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
        </Button>

        <div className="mt-24 flex flex-col md:flex-row gap-12 items-center justify-center text-gray-600 animate-fade-in [animation-delay:600ms]">
          <div className="text-center">
            <h3 className="text-3xl font-bold mb-2">Simple</h3>
            <p className="text-gray-500">Create flashcards in seconds</p>
          </div>
          <div className="text-center">
            <h3 className="text-3xl font-bold mb-2">Smart</h3>
            <p className="text-gray-500">Learn at the perfect pace</p>
          </div>
          <div className="text-center">
            <h3 className="text-3xl font-bold mb-2">Scientific</h3>
            <p className="text-gray-500">Based on proven methods</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;