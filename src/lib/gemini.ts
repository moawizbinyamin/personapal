import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error('VITE_GEMINI_API_KEY is required. Please add your Gemini API key to your environment variables.');
}

const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const generatePersonaResponse = async (
  systemPrompt: string,
  messages: Message[],
  personaName: string
): Promise<string> => {
  if (!genAI) {
    throw new Error('Gemini API key is required. Please add VITE_GEMINI_API_KEY to your environment variables.');
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Construct the full conversation context
    const conversationHistory = messages
      .map((msg) => `${msg.role === 'user' ? 'User' : personaName}: ${msg.content}`)
      .join('\n');

    const prompt = `${systemPrompt}

Previous conversation:
${conversationHistory}

User: ${messages[messages.length - 1]?.content || ''}

${personaName}:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating response:', error);
    throw new Error('Failed to generate AI response. Please check your Gemini API key and try again.');
  }
};

export const generateSystemPrompt = async (
  name: string,
  title: string,
  description: string,
  personality: string[],
  tone: string
): Promise<string> => {
  if (!genAI) {
    throw new Error('Gemini API key is required. Please add VITE_GEMINI_API_KEY to your environment variables.');
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `Create a detailed system prompt for an AI persona with these characteristics:

Name: ${name}
Title: ${title}
Description: ${description}
Personality traits: ${personality.join(', ')}
Tone: ${tone}

The system prompt should:
1. Define the persona's role and character
2. Describe their communication style and approach
3. Include specific behavioral guidelines
4. Be detailed enough to create consistent responses
5. Be written in second person ("You are...")

Generate a comprehensive system prompt:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating system prompt:', error);
    throw new Error('Failed to generate system prompt. Please check your Gemini API key and try again.');
  }
};