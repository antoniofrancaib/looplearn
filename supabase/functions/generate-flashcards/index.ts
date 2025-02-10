
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
    console.log('Generating flashcards for:', title, description)

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a specialized AI tutor focused on creating educational flashcards. Your task is to generate 10 high-quality flashcards based on the given topic.

Each flashcard should follow this format:
Front (Question/Prompt): A concise question, term, or concept to recall.
Back (Answer/Explanation): A short, precise definition, key fact, or formula.

Requirements for the flashcards:
1. Each card should test a single, clear concept
2. Questions should be direct and unambiguous
3. Answers should be concise but complete
4. Content should be factually accurate
5. Avoid overly complex or compound questions
6. Format must be valid JSON with a 'cards' array containing objects with 'front_content' and 'back_content'

Example format:
{
  "cards": [
    {
      "front_content": "What is photosynthesis?",
      "back_content": "The process by which plants convert sunlight, water, and CO2 into glucose and oxygen"
    }
  ]
}`
          },
          {
            role: 'user',
            content: `Create 10 educational flashcards for a deck titled "${title}" with the following description: ${description}. Remember to return valid JSON with exactly 10 cards.`
          }
        ]
      })
    })

    const data = await response.json()
    console.log('OpenAI response:', data)

    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid response from OpenAI')
    }

    const content = data.choices[0].message.content

    // Parse the JSON content from the response
    let flashcardsData
    try {
      flashcardsData = JSON.parse(content)
      if (!Array.isArray(flashcardsData.cards) || flashcardsData.cards.length !== 10) {
        throw new Error('Invalid flashcards format or incorrect number of cards')
      }
    } catch (error) {
      console.error('Error parsing OpenAI response:', error)
      throw new Error('Failed to parse flashcards data')
    }
    
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
