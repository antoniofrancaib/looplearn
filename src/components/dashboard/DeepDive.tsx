
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Interest } from "@/types/interests";

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

export function DeepDive({ userInterests }: { userInterests: Interest[] }) {
  const { data: paper, isLoading } = useQuery<AcademicPaper | null>({
    queryKey: ['academic-paper', userInterests],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('academic_papers')
        .select()
        .overlaps('interests', userInterests)
        .limit(1)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return (
      <div className="space-y-4 p-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!paper) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        No relevant papers found for your interests. Try updating your interests to see more content.
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-4rem)]">
      <Card className="border-none shadow-none">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">{paper.title}</CardTitle>
          <div className="text-sm text-muted-foreground">
            By {paper.authors.join(', ')}
          </div>
          <div className="text-xs text-muted-foreground">
            Published on {new Date(paper.publication_date).toLocaleDateString()}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm font-medium">Abstract</div>
          <p className="text-sm text-muted-foreground">{paper.abstract}</p>
          
          <div className="text-sm font-medium mt-6">Discussion</div>
          {paper.discussion.split('\n').map((paragraph, index) => (
            <p key={index} className="text-sm text-muted-foreground">
              {paragraph}
            </p>
          ))}
        </CardContent>
      </Card>
    </ScrollArea>
  );
}
