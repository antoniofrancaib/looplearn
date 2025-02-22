
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { supabaseClient } from "../_shared/supabaseClient.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userInterests } = await req.json();
    
    // First, use GPT to search for relevant papers
    const searchResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are a research assistant tasked with finding and analyzing academic papers. Return the result as JSON with title, authors, abstract, and publication_date fields.'
          },
          {
            role: 'user',
            content: `Find a recent academic paper related to one of these topics: ${userInterests.join(', ')}. Focus on papers with mathematical content. Return a single paper's details.`
          }
        ],
      }),
    });

    const searchData = await searchResponse.json();
    const paperInfo = JSON.parse(searchData.choices[0].message.content);

    // Now, generate a detailed summary with mathematical insights
    const summaryResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
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

    const summaryData = await summaryResponse.json();
    const discussion = summaryData.choices[0].message.content;

    // Save to database
    const { data: savedPaper, error } = await supabaseClient
      .from('academic_papers')
      .insert([{
        ...paperInfo,
        discussion,
        interests: userInterests,
      }])
      .select()
      .single();

    if (error) throw error;

    return new Response(JSON.stringify(savedPaper), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in deep-dive-papers function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
