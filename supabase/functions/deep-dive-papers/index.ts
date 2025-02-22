
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const supabase = createClient(supabaseUrl!, supabaseServiceRoleKey!);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Edge function called with request:", req);
    const { userInterests } = await req.json();
    
    if (!userInterests || userInterests.length === 0) {
      throw new Error('No interests provided');
    }

    console.log("User interests:", userInterests);
    
    // First, use GPT to search for relevant papers
    const searchResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a research assistant tasked with finding and analyzing academic papers. Return the result as JSON with title, authors (as array), abstract, and publication_date fields.'
          },
          {
            role: 'user',
            content: `Find a recent academic paper related to one of these topics: ${userInterests.join(', ')}. Focus on papers with mathematical content. Return a single paper's details.`
          }
        ],
      }),
    });

    if (!searchResponse.ok) {
      const errorData = await searchResponse.json();
      console.error("OpenAI search error:", errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const searchData = await searchResponse.json();
    console.log("OpenAI search response:", searchData);
    
    const paperInfo = JSON.parse(searchData.choices[0].message.content);

    // Now, generate a detailed summary with mathematical insights
    const summaryResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a mathematics and science expert. Create detailed summaries that preserve mathematical rigor while making complex topics accessible.'
          },
          {
            role: 'user',
            content: `Create a detailed summary of this paper, preserving mathematical formulas and key insights:\nTitle: ${paperInfo.title}\nAbstract: ${paperInfo.abstract}`
          }
        ],
      }),
    });

    if (!summaryResponse.ok) {
      const errorData = await summaryResponse.json();
      console.error("OpenAI summary error:", errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const summaryData = await summaryResponse.json();
    console.log("OpenAI summary response:", summaryData);
    
    const discussion = summaryData.choices[0].message.content;

    // Save to database
    const { data: savedPaper, error: dbError } = await supabase
      .from('academic_papers')
      .insert([{
        ...paperInfo,
        discussion,
        interests: userInterests,
      }])
      .select()
      .single();

    if (dbError) {
      console.error("Database error:", dbError);
      throw dbError;
    }

    return new Response(JSON.stringify(savedPaper), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in deep-dive-papers function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An error occurred while processing your request'
      }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
