
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, Brain, Sparkles, Smartphone,
  Menu, X, Book, GitBranch, ArrowUpRight
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="grid-overlay" />
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-primary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="text-2xl font-bold text-destructive">
              LoopLearn
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              {["Home", "Features", "Pricing", "Blog", "Support"].map((item) => (
                <button 
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase())}
                  className="nav-link"
                >
                  {item}
                </button>
              ))}
              <Button 
                onClick={() => navigate('/auth')}
                className="bg-primary hover:bg-primary/90 text-white"
              >
                Get Started
              </Button>
            </div>
            
            <button 
              className="md:hidden text-primary"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 space-y-4">
          {["Home", "Features", "Pricing", "Blog", "Support"].map((item) => (
            <button
              key={item}
              onClick={() => scrollToSection(item.toLowerCase())}
              className="block w-full text-left nav-link"
            >
              {item}
            </button>
          ))}
          <Button 
            onClick={() => navigate('/auth')}
            className="w-full bg-primary hover:bg-primary/90 text-white mt-4"
          >
            Get Started
          </Button>
        </div>
      </div>

      {/* Hero Section */}
      <section className="min-h-[80vh] flex items-center justify-center relative px-4 pt-16">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="hero-heading">
            LoopLearn, Your Brain, <br />
            Reimagined.
          </h1>
          <p className="hero-subheading">
            Master anything, anywhere, with effortless flashcards.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              size="lg"
              className="hero-button group"
              onClick={() => navigate('/auth')}
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <button 
              onClick={() => scrollToSection('features')}
              className="text-white hover:text-primary transition-colors duration-300 underline-offset-4 hover:underline"
            >
              Learn More
            </button>
          </div>
        </div>

        {/* Orbiting Avatars */}
        <div className="absolute inset-0 pointer-events-none">
          {[1, 2, 3, 4].map((i) => (
            <div 
              key={i}
              className={`avatar-orbit avatar-orbit-${i}`}
              style={{
                left: `${50 + (i * 10)}%`,
                top: `${50 + (i * 5)}%`,
              }}
            />
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-7xl mx-auto space-y-20">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-full md:w-1/2 feature-block">
              <Book className="h-12 w-12 text-primary mb-6" />
              <h2 className="text-3xl font-bold text-white mb-4">Instant Flashcards</h2>
              <p className="text-gray-400">
                Generate comprehensive flashcard decks instantly with our advanced AI. 
                Save hours of manual creation time.
              </p>
            </div>
            <div className="w-full md:w-1/2" />
          </div>

          <div className="flex flex-col md:flex-row-reverse items-center gap-8">
            <div className="w-full md:w-1/2 feature-block">
              <Brain className="h-12 w-12 text-primary mb-6" />
              <h2 className="text-3xl font-bold text-white mb-4">Personalized Learning</h2>
              <p className="text-gray-400">
                Our spaced repetition system adapts to your learning pace, showing cards 
                at the perfect moment for maximum retention.
              </p>
            </div>
            <div className="w-full md:w-1/2" />
          </div>

          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-full md:w-1/2 feature-block">
              <Smartphone className="h-12 w-12 text-primary mb-6" />
              <h2 className="text-3xl font-bold text-white mb-4">On-the-Go Mastery</h2>
              <p className="text-gray-400">
                Learn anywhere, anytime. Your flashcards sync across all devices, 
                making it easy to study whenever inspiration strikes.
              </p>
            </div>
            <div className="w-full md:w-1/2" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t border-primary/20 py-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between">
          <div className="text-sm text-gray-400">
            © 2024 LoopLearn. All rights reserved.
          </div>
          <div className="flex items-center space-x-6 mt-4 sm:mt-0">
            {['Contact', 'Privacy', 'Terms'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-sm text-white hover:text-primary transition-colors duration-300 
                         hover:underline underline-offset-4"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
