
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Interest } from '@/types/interests';
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RefreshCw } from "lucide-react";
import { AnimatePresence, motion } from 'framer-motion';
import { useToast } from "@/components/ui/use-toast";

interface Paper {
  id: string;
  title: string;
  authors: string[];
  abstract: string;
  discussion: string;
  publication_date: string;
  interests: Interest[];
}

const DeepDivePage = () => {
  const [userInterests, setUserInterests] = useState<Interest[]>([]);
  const [paper, setPaper] = useState<Paper | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  const loadUserInterests = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth');
        return;
      }

      const { data: userInterestsData, error: interestsError } = await supabase
        .from('user_interests')
        .select('interest')
        .eq('user_id', user.id);

      if (interestsError) {
        throw interestsError;
      }

      if (userInterestsData) {
        setUserInterests(userInterestsData.map(row => row.interest as Interest));
      }
    } catch (error) {
      console.error('Error loading user interests:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load your interests. Please try again."
      });
    }
  };

  const fetchLatestPaper = async () => {
    setLoading(true);
    try {
      if (userInterests.length === 0) {
        toast({
          variant: "destructive",
          title: "No interests selected",
          description: "Please select some interests in your profile to get personalized paper recommendations."
        });
        setLoading(false);
        return;
      }

      const { data, error: functionError } = await supabase.functions.invoke('deep-dive-papers', {
        body: { userInterests }
      });

      if (functionError) {
        throw new Error(functionError.message);
      }

      if (!data) {
        throw new Error('No paper data received');
      }

      setPaper(data);
    } catch (error) {
      console.error('Error fetching paper:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch paper. Please try again later."
      });
      setPaper(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserInterests();
  }, []);

  useEffect(() => {
    if (userInterests.length > 0) {
      fetchLatestPaper();
    } else {
      setLoading(false);
    }
  }, [userInterests]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="container mx-auto py-8 px-4 max-w-4xl"
      >
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
            Deep Dive
          </h1>
          <Button
            onClick={fetchLatestPaper}
            disabled={loading || userInterests.length === 0}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            New Paper
          </Button>
        </div>

        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : paper ? (
          <Card className="bg-white/50 backdrop-blur-sm border-teal-100/20">
            <CardHeader className="space-y-4">
              <CardTitle className="text-2xl text-teal-800">
                {paper.title}
              </CardTitle>
              <CardDescription>
                <div className="text-sm text-gray-600">
                  By {paper.authors.join(', ')}
                </div>
                <div className="text-sm text-gray-500">
                  Published on {new Date(paper.publication_date).toLocaleDateString()}
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-teal-700 mb-2">Abstract</h3>
                <p className="text-gray-700">{paper.abstract}</p>
              </div>
              <ScrollArea className="h-[400px] rounded-md border p-4">
                <div>
                  <h3 className="text-lg font-semibold text-teal-700 mb-2">Key Insights & Discussion</h3>
                  <div 
                    className="prose prose-teal max-w-none"
                    dangerouslySetInnerHTML={{ __html: paper.discussion.replace(/\n/g, '<br/>') }}
                  />
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-gray-500 text-center">
                {userInterests.length === 0 
                  ? "Please select your interests to get personalized paper recommendations."
                  : "No paper found. Try refreshing to get a new recommendation."}
              </p>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default DeepDivePage;
