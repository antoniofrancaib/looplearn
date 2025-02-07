
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface Card {
  front_content: string;
  back_content: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { title, description } = await req.json()
    console.log('Generating flashcards for:', title, description) // Added logging

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // Fixed model name
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that creates flashcards. Generate flashcard content in JSON format with "cards" array containing objects with "front_content" and "back_content". Keep answers concise.'
          },
          {
            role: 'user',
            content: `Create 5 flashcards for a deck titled "${title}" with the following description: ${description}`
          }
        ]
      })
    })

    const data = await response.json()
    console.log('OpenAI response:', data) // Added logging

    const content = data.choices[0].message.content

    // Parse the JSON content from the response
    const flashcardsData = JSON.parse(content)
    
    return new Response(
      JSON.stringify(flashcardsData),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
