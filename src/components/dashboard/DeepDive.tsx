
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshCw, BookOpen, FileText, ExternalLink } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface AcademicPaper {
  id: string;
  title: string;
  authors: string[];
  abstract: string;
  discussion: string;
  interests: string[];
  publication_date: string;
  created_at: string;
}

export function DeepDive() {
  const { toast } = useToast();
  
  const { data: paper, isLoading, refetch, isError } = useQuery<AcademicPaper>({
    queryKey: ['academic-paper'],
    queryFn: async () => {
      const response = await supabase.functions.invoke('deep-dive-papers', {
        body: { userInterests: [] }
      });

      if (response.error) {
        throw new Error('Failed to fetch paper');
      }

      return response.data;
    },
  });

  if (isError) {
    return (
      <Card className="bg-destructive/10">
        <CardContent className="pt-6">
          <div className="text-center text-destructive">
            Unable to load academic paper. Please try again later.
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6 space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!paper) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            No paper available. Try refreshing to see a new paper.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div className="space-y-1.5">
          <CardTitle className="text-xl font-semibold leading-tight">
            {paper.title}
          </CardTitle>
          <CardDescription>
            By {paper.authors.join(', ')}
            <br />
            Published on {new Date(paper.publication_date).toLocaleDateString()}
          </CardDescription>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => refetch()}
          className="shrink-0"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div>
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
            <BookOpen className="h-4 w-4" />
            Abstract
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {paper.abstract}
          </p>
        </div>

        <ScrollArea className="h-[300px]">
          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2 sticky top-0 bg-background py-2">
              <FileText className="h-4 w-4" />
              Key Insights & Discussion
            </div>
            <div className="space-y-4">
              {paper.discussion.split('\n\n').map((paragraph, index) => (
                <p key={index} className="text-sm leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </ScrollArea>

        <div className="pt-4 flex justify-end">
          <Button variant="outline" size="sm" className="gap-2">
            <ExternalLink className="h-4 w-4" />
            Read Full Paper
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
