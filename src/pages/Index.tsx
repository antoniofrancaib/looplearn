import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
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
      
      <Dialog>
        <DialogTrigger asChild>
          <Button 
            size="lg" 
            className="group mt-8 animate-fade-in [animation-delay:400ms] text-lg"
          >
            Get Started
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl">Welcome</DialogTitle>
            <DialogDescription className="text-center">
              Choose how you'd like to continue
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <Button variant="outline" className="w-full" onClick={() => navigate('/dashboard')}>
              Sign In
            </Button>
            <Button className="w-full" onClick={() => console.log("Sign up")}>
              Sign Up
            </Button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            <Button variant="outline" className="w-full" onClick={() => console.log("Google sign in")}>
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Continue with Google
            </Button>
          </div>
        </DialogContent>
      </Dialog>

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