import { Button } from "@/components/ui/button";
import { 
  ArrowRight, Brain, Sparkles, Clock, Library, Globe, BookOpen, 
  Briefcase, Computer, Music, Atom, Wand2, Lightbulb, BarChart3, Smartphone, Menu 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

const Index = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false); // Close mobile menu after clicking
  };

  const navItems = [
    { label: 'Home', section: 'home' },
    { label: 'How It Works', section: 'how-it-works' },
    { label: 'Use Cases', section: 'use-cases' },
    { label: 'Features', section: 'features' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Navigation Menu */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="text-xl font-bold text-primary">
              LoopLearn
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center justify-center space-x-8">
              {navItems.map((item) => (
                <button 
                  key={item.section}
                  onClick={() => scrollToSection(item.section)} 
                  className="text-gray-700 hover:text-primary transition-colors"
                >
                  {item.label}
                </button>
              ))}
              <Button 
                variant="ghost" 
                onClick={() => navigate('/auth')}
                className="text-gray-700 hover:text-primary"
              >
                Login
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" className="relative">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-white/95 backdrop-blur-sm">
                <div className="flex flex-col gap-4 mt-8">
                  {navItems.map((item) => (
                    <button
                      key={item.section}
                      onClick={() => scrollToSection(item.section)}
                      className="flex items-center space-x-2 text-lg text-gray-700 hover:text-primary transition-colors py-2"
                    >
                      {item.label}
                    </button>
                  ))}
                  <Button 
                    onClick={() => {
                      navigate('/auth');
                      setIsMobileMenuOpen(false);
                    }}
                    className="mt-4"
                  >
                    Login
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div id="home" className="flex flex-col items-center justify-center px-8 pt-32 text-center">
        <h1 className="animate-fade-in bg-gradient-to-r from-primary to-secondary bg-clip-text text-6xl font-bold text-transparent sm:text-7xl">
          Learning, Reimagined.
        </h1>
        
        <p className="animate-fade-in [animation-delay:200ms] mt-6 max-w-2xl text-xl text-gray-600">
          Boost Your Brainpower with Science-Backed Flashcards
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
            <Clock className="h-12 w-12 text-primary" />
            <h2 className="text-xl font-bold text-gray-900">Spaced Repetition</h2>
            <p className="text-center text-gray-600">
              Review flashcards at increasing intervals to fight forgetting, ensuring long-lasting retention.
            </p>
          </div>
          
          <div className="flex flex-col items-center space-y-4 rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
            <Brain className="h-12 w-12 text-primary" />
            <h2 className="text-xl font-bold text-gray-900">Active Recall</h2>
            <p className="text-center text-gray-600">
              Test yourself to retrieve info, strengthening memory and boosting retention with our flashcards.
            </p>
          </div>
          
          <div className="flex flex-col items-center space-y-4 rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
            <Sparkles className="h-12 w-12 text-primary" />
            <h2 className="text-xl font-bold text-gray-900">Interleaving</h2>
            <p className="text-center text-gray-600">
              Mix different topics or skills during study sessions to enhance problem-solving and retention with our flashcards.
            </p>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div id="how-it-works" className="mx-auto mt-24 max-w-4xl px-8 pb-20">
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

      {/* Use Cases Section */}
      <div id="use-cases" className="mx-auto mt-24 max-w-7xl px-8">
        <h2 className="text-center text-3xl font-bold text-gray-900 mb-4">What Can You Use LoopLearn For?</h2>
        <p className="text-center text-xl text-gray-600 mb-12">
          From students to professionals, our AI flashcards help you master anything faster.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center space-y-4 p-6 rounded-lg border border-gray-100 bg-white shadow-sm">
            <BookOpen className="h-12 w-12 text-primary" />
            <h3 className="text-xl font-bold text-gray-900">Study for exams</h3>
            <p className="text-center text-gray-600">
              Prepare for school, college, or competitive exams with AI-generated study decks.
            </p>
          </div>

          <div className="flex flex-col items-center space-y-4 p-6 rounded-lg border border-gray-100 bg-white shadow-sm">
            <Globe className="h-12 w-12 text-primary" />
            <h3 className="text-xl font-bold text-gray-900">Learn a New Language</h3>
            <p className="text-center text-gray-600">
              Master vocabulary, grammar, and phrases in any language with smart flashcards.
            </p>
          </div>

          <div className="flex flex-col items-center space-y-4 p-6 rounded-lg border border-gray-100 bg-white shadow-sm">
            <Briefcase className="h-12 w-12 text-primary" />
            <h3 className="text-xl font-bold text-gray-900">Work & Career Growth</h3>
            <p className="text-center text-gray-600">
              Enhance professional skills, remember key concepts, and prepare for certifications.
            </p>
          </div>

          <div className="flex flex-col items-center space-y-4 p-6 rounded-lg border border-gray-100 bg-white shadow-sm">
            <Computer className="h-12 w-12 text-primary" />
            <h3 className="text-xl font-bold text-gray-900">Coding & Tech Skills</h3>
            <p className="text-center text-gray-600">
              Learn programming languages, algorithms, and key technical concepts faster.
            </p>
          </div>

          <div className="flex flex-col items-center space-y-4 p-6 rounded-lg border border-gray-100 bg-white shadow-sm">
            <Music className="h-12 w-12 text-primary" />
            <h3 className="text-xl font-bold text-gray-900">Music & Creative Skills</h3>
            <p className="text-center text-gray-600">
              Improve your music theory, chords, or creative knowledge with structured flashcards.
            </p>
          </div>

          <div className="flex flex-col items-center space-y-4 p-6 rounded-lg border border-gray-100 bg-white shadow-sm">
            <Atom className="h-12 w-12 text-primary" />
            <h3 className="text-xl font-bold text-gray-900">Science & Engineering Concepts</h3>
            <p className="text-center text-gray-600">
              Master scientific formulas, physics principles, and engineering concepts with AI-powered flashcards.
            </p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="mx-auto mt-24 max-w-7xl px-8 pb-20">
        <h2 className="text-center text-3xl font-bold text-gray-900 mb-4">Why Choose LoopLearn?</h2>
        <p className="text-center text-xl text-gray-600 mb-12">
          Enhance your learning with smart, AI-driven flashcards that adapt to your pace.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="flex flex-col items-center space-y-4 p-6 rounded-lg border border-gray-100 bg-white shadow-sm">
            <Wand2 className="h-12 w-12 text-primary" />
            <p className="text-center text-gray-600">
              Generate flashcards instantly with AI, saving hours of manual work
            </p>
          </div>

          <div className="flex flex-col items-center space-y-4 p-6 rounded-lg border border-gray-100 bg-white shadow-sm">
            <Lightbulb className="h-12 w-12 text-primary" />
            <p className="text-center text-gray-600">
              Use scientifically proven spaced repetition to boost memory retention.
            </p>
          </div>

          <div className="flex flex-col items-center space-y-4 p-6 rounded-lg border border-gray-100 bg-white shadow-sm">
            <BarChart3 className="h-12 w-12 text-primary" />
            <p className="text-center text-gray-600">
              Monitor your learning journey with insights and analytics that help you improve.
            </p>
          </div>

          <div className="flex flex-col items-center space-y-4 p-6 rounded-lg border border-gray-100 bg-white shadow-sm">
            <Smartphone className="h-12 w-12 text-primary" />
            <p className="text-center text-gray-600">
              Access your flashcards anywhere, anytime, on any device.
            </p>
          </div>
        </div>

        <div className="text-center bg-gray-50 rounded-lg p-8">
          <Button 
            size="lg"
            className="group text-lg"
            onClick={() => navigate('/auth')}
          >
            Start Learning Now
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
