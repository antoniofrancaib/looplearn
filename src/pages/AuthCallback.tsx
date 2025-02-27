
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const AuthCallback = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleAuthCallback = async () => {
      console.log("Auth callback started", window.location.href);
      try {
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
          console.log("Redirecting to dashboard");
          navigate("/dashboard");
        } else {
          console.log("No session found, redirecting to auth");
          navigate("/auth");
        }
      } catch (error: any) {
        console.error("Auth callback catch error:", error);
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
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-lg">Completing sign in...</p>
    </div>
  );
};

export default AuthCallback;
