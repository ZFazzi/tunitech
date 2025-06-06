
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { developerId, cvSummary, technicalSkills, experienceLevel } = await req.json()

    if (!developerId || !cvSummary) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Generate a professional title based on the developer's profile
    const skillsText = Array.isArray(technicalSkills) ? technicalSkills.join(', ') : ''
    const prompt = `Baserat på följande utvecklarprofil, skapa en kort och professionell jobbitel på svenska (max 50 tecken):

Profilbeskrivning: ${cvSummary}
Tekniska färdigheter: ${skillsText}
Erfarenhetsnivå: ${experienceLevel}

Titeln ska vara beskrivande och professionell, till exempel "Senior Fullstack-utvecklare" eller "React-specialist med AI-fokus". Svara endast med titeln, inget annat.`

    // Call OpenAI API (you'll need to add OPENAI_API_KEY as a secret)
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured')
    }

    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 50,
        temperature: 0.7,
      }),
    })

    if (!openaiResponse.ok) {
      throw new Error('Failed to generate title from OpenAI')
    }

    const openaiData = await openaiResponse.json()
    const generatedTitle = openaiData.choices[0]?.message?.content?.trim() || 'Utvecklare'

    // Update the developer record with the generated title
    const { error: updateError } = await supabase
      .from('developers')
      .update({ ai_generated_title: generatedTitle })
      .eq('id', developerId)

    if (updateError) {
      throw updateError
    }

    return new Response(
      JSON.stringify({ title: generatedTitle }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error generating title:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
