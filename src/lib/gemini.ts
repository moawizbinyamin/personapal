import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.warn('Gemini API key not found. Using demo mode.');
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
    // Fallback to simulated responses if no API key
    return getSimulatedResponse(personaName);
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
    return getSimulatedResponse(personaName);
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
    return `You are ${name}, a ${title.toLowerCase()}. ${description} You have a ${tone} tone and embody these traits: ${personality.join(', ')}.`;
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
    return `You are ${name}, a ${title.toLowerCase()}. ${description} You have a ${tone} tone and embody these traits: ${personality.join(', ')}.`;
  }
};

const getSimulatedResponse = (personaName: string): string => {
  const responses: Record<string, string[]> = {
    Maya: [
      "That sounds really meaningful to you. Tell me more about how that makes you feel? 💕",
      "I can hear the emotion in your words. You're being so brave by sharing this with me.",
      "That's such a beautiful way to look at it! I love how thoughtful you are about these things.",
      "I'm here for you, and I want you to know that your feelings are completely valid."
    ],
    Theo: [
      "That's a fascinating perspective. Have you considered how this might relate to the broader question of human purpose?",
      "Your question touches on something philosophers have pondered for centuries. What draws you to think about this?",
      "This reminds me of what Marcus Aurelius once wrote... How do you think that applies to your situation?",
      "There's wisdom in your uncertainty. Sometimes the questions are more valuable than the answers."
    ],
    Blaze: [
      "YES! That's the spirit I love to hear! 🔥 You've got this, champion!",
      "That's EXACTLY the kind of mindset that creates real change! I'm so proud of you!",
      "Every small step counts! You're building momentum and that's what matters! 💪",
      "I believe in you 100%! Let's channel that energy into something amazing!"
    ],
    Nia: [
      "Oh, that sounds absolutely delicious! I love how creative you're being in the kitchen! 🍳",
      "That's such a wonderful approach to cooking! Food really is about bringing joy and nourishment.",
      "I'm so excited about this! Cooking is one of life's greatest pleasures, don't you think?",
      "That reminds me of a technique my grandmother used to use... let me share that with you!"
    ]
  };

  const personaResponses = responses[personaName] || [
    "That's really interesting! Tell me more about that.",
    "I love hearing your perspective on this.",
    "What an insightful thing to share with me!",
    "That's given me something wonderful to think about."
  ];

  return personaResponses[Math.floor(Math.random() * personaResponses.length)];
};