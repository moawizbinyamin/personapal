import "https://deno.land/x/xhr@0.3.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Message {
  role: string;
  content: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { systemPrompt, messages, personaName } = await req.json();
    const apiKey = Deno.env.get('GEMINI_API_KEY');

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'Gemini API key not configured' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Format messages correctly for Gemini API
    const contents = [
      // System prompt as first user message
      {
        role: "user",
        parts: [{ text: systemPrompt }]
      },
      {
        role: "model", 
        parts: [{ text: "I understand. I'll respond as this persona." }]
      }
    ];

    // Add conversation history with proper role mapping
    messages.forEach((msg: Message) => {
      contents.push({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      });
    });

    console.log('Sending to Gemini API:', JSON.stringify(contents, null, 2));

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents,
          generationConfig: {
            temperature: 0.7,
            topP: 0.8,
            topK: 40,
            maxOutputTokens: 1024,
          },
        }),
      }
    );

    const data = await response.json();
    console.log('Gemini API response:', data);
    
    if (!response.ok) {
      console.error('Gemini API error:', data);
      throw new Error(data.error?.message || 'Failed to generate response');
    }

    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!generatedText || generatedText.trim() === '') {
      console.error('Empty response from Gemini API');
      return new Response(JSON.stringify({ 
        response: "I apologize, but I'm having trouble generating a response right now. Please try again." 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    return new Response(
      JSON.stringify({ response: generatedText.trim() }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in gemini-chat function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});