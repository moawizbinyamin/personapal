import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

// In Lovable's native Supabase integration, these values are provided automatically
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          created_at: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
        };
        Insert: {
          id: string;
          created_at?: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
        };
      };
      personas: {
        Row: {
          id: string;
          created_at: string;
          name: string;
          title: string;
          description: string;
          personality: string[];
          tone: string;
          avatar: string;
          color: string;
          system_prompt: string;
          example_dialogues: any;
          user_id: string | null;
          is_public: boolean;
        };
        Insert: {
          id?: string;
          created_at?: string;
          name: string;
          title: string;
          description: string;
          personality: string[];
          tone: string;
          avatar: string;
          color: string;
          system_prompt: string;
          example_dialogues: any;
          user_id?: string | null;
          is_public?: boolean;
        };
        Update: {
          id?: string;
          created_at?: string;
          name?: string;
          title?: string;
          description?: string;
          personality?: string[];
          tone?: string;
          avatar?: string;
          color?: string;
          system_prompt?: string;
          example_dialogues?: any;
          user_id?: string | null;
          is_public?: boolean;
        };
      };
      conversations: {
        Row: {
          id: string;
          created_at: string;
          user_id: string;
          persona_id: string;
          title: string;
          messages: any;
        };
        Insert: {
          id?: string;
          created_at?: string;
          user_id: string;
          persona_id: string;
          title: string;
          messages: any;
        };
        Update: {
          id?: string;
          created_at?: string;
          user_id?: string;
          persona_id?: string;
          title?: string;
          messages?: any;
        };
      };
    };
  };
};