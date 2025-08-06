import type { Database } from '@/integrations/supabase/types';

// Transform database types to match our app interface
export type PersonaFromDB = Database['public']['Tables']['personas']['Row'];

export interface Persona {
  id: string;
  name: string;
  title: string;
  description: string;
  personality: string[];
  tone: string;
  avatar: string;
  color: string;
  system_prompt: string;
  example_dialogues: Array<{
    user: string;
    assistant: string;
  }>;
  user_id?: string;
}

// Helper to transform database persona to app persona
export const transformPersona = (dbPersona: PersonaFromDB): Persona => ({
  id: dbPersona.id,
  name: dbPersona.name,
  title: dbPersona.title || '',
  description: dbPersona.description || '',
  personality: (dbPersona.personality as string[]) || [],
  tone: dbPersona.tone || '',
  avatar: dbPersona.avatar || '',
  color: dbPersona.color || '',
  system_prompt: dbPersona.system_prompt || '',
  example_dialogues: (dbPersona.example_dialogues as Array<{user: string; assistant: string}>) || [],
  user_id: dbPersona.user_id || undefined,
});