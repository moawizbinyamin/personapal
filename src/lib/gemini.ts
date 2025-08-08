import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  throw new Error('VITE_GEMINI_API_KEY is not configured. Please add your Gemini API key to the .env file.');
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function generateResponse(
  systemPrompt: string,
  messages: ChatMessage[],
  personaName: string
): Promise<string> {
  try {
    // Combine system prompt with conversation history
    const prompt = `You are ${personaName}. ${systemPrompt}

Conversation history:
${messages.map(msg => `${msg.role === 'user' ? 'Human' : personaName}: ${msg.content}`).join('\n')}

Please respond as ${personaName} in character. Keep your response engaging and true to your personality.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return text;
  } catch (error) {
    console.error('Error generating AI response:', error);
    throw new Error('Failed to generate AI response. Please try again.');
  }
}
