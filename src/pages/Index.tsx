
import { Button } from "@/components/ui/button";
import { ArrowRight, Brain, Sparkles, Clock, Library } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center px-8 pt-20 text-center">
        <h1 className="animate-fade-in bg-gradient-to-r from-primary to-secondary bg-clip-text text-6xl font-bold text-transparent sm:text-7xl">
          Master Anything with AI
        </h1>
        
        <p className="animate-fade-in [animation-delay:200ms] mt-6 max-w-2xl text-xl text-gray-600">
          Transform your learning journey with AI-powered flashcards. Create personalized study decks instantly and master any subject using proven memory techniques.
        </p>
        
        <Button 
          size="lg" 
          className="group mt-8 animate-fade-in [animation-delay:400ms] text-lg"
          onClick={() => navigate('/auth')}
        >
          Start Learning Now
          <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>

      {/* Features Grid */}
      <div className="mx-auto mt-24 max-w-7xl px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3 animate-fade-in [animation-delay:600ms]">
          <div className="flex flex-col items-center space-y-4 rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
            <Brain className="h-12 w-12 text-primary" />
            <h2 className="text-xl font-bold text-gray-900">AI-Powered Creation</h2>
            <p className="text-center text-gray-600">
              Generate comprehensive flashcard decks instantly with our advanced AI. Save hours of manual creation time.
            </p>
          </div>
          
          <div className="flex flex-col items-center space-y-4 rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
            <Sparkles className="h-12 w-12 text-primary" />
            <h2 className="text-xl font-bold text-gray-900">Smart Learning</h2>
            <p className="text-center text-gray-600">
              Our spaced repetition system adapts to your learning pace, showing cards at the perfect moment for maximum retention.
            </p>
          </div>
          
          <div className="flex flex-col items-center space-y-4 rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
            <Clock className="h-12 w-12 text-primary" />
            <h2 className="text-xl font-bold text-gray-900">Efficient Progress</h2>
            <p className="text-center text-gray-600">
              Learn faster and remember longer with scientifically proven spaced repetition techniques.
            </p>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="mx-auto mt-24 max-w-4xl px-8 pb-20">
        <h2 className="text-center text-3xl font-bold text-gray-900 mb-12">How It Works</h2>
        
        <div className="space-y-12">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 space-y-4">
              <h3 className="text-2xl font-semibold text-gray-900">1. Choose Your Topic</h3>
              <p className="text-gray-600">
                Select any subject you want to master. Our AI understands context and creates perfectly tailored flashcards.
              </p>
            </div>
            <div className="flex-1 flex justify-center">
              <Library className="h-24 w-24 text-primary opacity-80" />
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row-reverse items-center gap-8">
            <div className="flex-1 space-y-4">
              <h3 className="text-2xl font-semibold text-gray-900">2. Study Smart</h3>
              <p className="text-gray-600">
                Review cards using spaced repetition – a scientifically proven technique that shows you information right before you're about to forget it.
              </p>
            </div>
            <div className="flex-1 flex justify-center">
              <Brain className="h-24 w-24 text-primary opacity-80" />
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 space-y-4">
              <h3 className="text-2xl font-semibold text-gray-900">3. Track Progress</h3>
              <p className="text-gray-600">
                Watch your knowledge grow with detailed progress tracking and analytics. Stay motivated as you see your improvement over time.
              </p>
            </div>
            <div className="flex-1 flex justify-center">
              <Sparkles className="h-24 w-24 text-primary opacity-80" />
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <Button 
            size="lg"
            className="group text-lg"
            onClick={() => navigate('/auth')}
          >
            Get Started Free
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>
          <p className="mt-4 text-sm text-gray-500">No credit card required</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
