
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const AuthCallback = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [message, setMessage] = useState("Completing sign in...");

  useEffect(() => {
    const handleAuthCallback = async () => {
      console.log("Auth callback started", window.location.href);
      
      // Get the stored origin for comparison
      const storedOrigin = localStorage.getItem('auth_origin');
      console.log("Original auth origin:", storedOrigin);
      console.log("Current origin:", window.location.origin);
      
      try {
        // Get the hash from the URL if present
        const hashParams = window.location.hash;
        if (hashParams) {
          console.log("Hash params detected:", hashParams);
        }
        
        // Check the query params
        const urlParams = new URLSearchParams(window.location.search);
        const errorParam = urlParams.get('error');
        const errorDescriptionParam = urlParams.get('error_description');
        
        if (errorParam) {
          console.error("URL error params:", errorParam, errorDescriptionParam);
          throw new Error(errorDescriptionParam || errorParam);
        }
        
        // Get the current session
        const { data: { session }, error } = await supabase.auth.getSession();
      
        if (error) {
          console.error("Auth callback error:", error);
          toast({
            variant: "destructive",
            title: "Authentication error",
            description: error.message,
          });
          navigate("/auth");
          return;
        }

        if (session) {
          console.log("Session found:", session.user.id);
          
          // Check if there's a redirect path in localStorage
          const redirectPath = localStorage.getItem('auth_redirect_path') || '/dashboard';
          localStorage.removeItem('auth_redirect_path'); // Clean up
          localStorage.removeItem('auth_origin'); // Clean up
          
          console.log("Redirecting to:", redirectPath);
          toast({
            title: "Successfully signed in",
            description: "Welcome back!",
          });
          navigate(redirectPath);
        } else {
          console.log("No session found, redirecting to auth");
          setMessage("No session found. Redirecting to login...");
          navigate("/auth");
        }
      } catch (error: any) {
        console.error("Auth callback catch error:", error);
        setMessage("Authentication error. Redirecting to login...");
        toast({
          variant: "destructive",
          title: "Authentication error",
          description: error.message,
        });
        navigate("/auth");
      }
    };

    handleAuthCallback();
  }, [navigate, toast]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-primary"></div>
      <p className="text-lg">{message}</p>
    </div>
  );
};

export default AuthCallback;
