
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Configuration, OpenAIApi } from 'https://esm.sh/openai@3.2.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  try {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
      return new Response('ok', { headers: corsHeaders })
    }

    const { interest, count, allInterests } = await req.json()
    const openAiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openAiKey) {
      throw new Error('OPENAI_API_KEY is not set')
    }

    const configuration = new Configuration({ apiKey: openAiKey })
    const openai = new OpenAIApi(configuration)

    const interestsContext = allInterests?.join(', ') || interest

    const prompt = `Create ${count} unique flashcards about ${interest}. Consider the user's other interests for context: ${interestsContext}.
    Each flashcard should have a clear question or concept on the front and a concise, informative answer on the back.
    Format as JSON array: [{"front": "front content", "back": "back content"}]`

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that creates educational flashcards."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
    })

    const responseText = completion.data.choices[0].message?.content
    if (!responseText) {
      throw new Error('No response from OpenAI')
    }

    const cards = JSON.parse(responseText)

    return new Response(
      JSON.stringify({ cards }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
