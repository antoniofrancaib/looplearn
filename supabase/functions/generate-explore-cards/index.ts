
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface GenerateCardParams {
  interest: string
  count: number
  allInterests: string[]
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { interest, count = 3, allInterests } = await req.json() as GenerateCardParams
    const apiKey = Deno.env.get('OPENAI_API_KEY')

    if (!apiKey) {
      throw new Error('OpenAI API key not configured')
    }

    console.log(`Generating ${count} cards for interest: ${interest}`)
    console.log('All interests:', allInterests)

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are a knowledgeable tutor specializing in creating engaging flashcards. 
            The user is interested in: ${allInterests.join(', ')}. 
            Focus on creating interesting, fun facts and educational content that connects to their interests.`
          },
          {
            role: 'user',
            content: `Create ${count} flashcards about ${interest}. Make them engaging and fun! 
            Try to occasionally reference related topics from their other interests: ${allInterests.join(', ')}.
            Return them in this exact JSON format:
            {
              "cards": [
                {
                  "front": "question or concept",
                  "back": "answer or explanation"
                }
              ]
            }`
          }
        ],
        temperature: 0.7
      }),
    })

    const data = await response.json()
    
    if (!response.ok) {
      console.error('OpenAI API error:', data)
      throw new Error('Failed to generate cards: ' + JSON.stringify(data.error))
    }

    let cards
    try {
      cards = JSON.parse(data.choices[0].message.content).cards
    } catch (error) {
      console.error('Error parsing OpenAI response:', error)
      throw new Error('Invalid response format from OpenAI')
    }

    return new Response(JSON.stringify({ cards }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An unexpected error occurred'
      }), 
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
