import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ChatInterface from '@/components/ChatInterface';
import { Persona, transformPersona } from '@/utils/types';
import { getPersonaById } from '@/data/personas';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/contexts/AuthContext';

const Chat = () => {
  const { personaId } = useParams<{ personaId: string }>();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [persona, setPersona] = useState<Persona | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPersona = async () => {
      if (!personaId) {
        navigate('/');
        return;
      }

      // First check default personas
      const defaultPersona = getPersonaById(personaId);
      if (defaultPersona) {
        setPersona(defaultPersona);
        setLoading(false);
        return;
      }

      // Then check custom personas from database
      try {
        const { data, error } = await supabase
          .from('personas')
          .select('*')
          .eq('id', personaId)
          .single();

        if (error || !data) {
          console.error('Persona not found:', error);
          navigate('/');
          return;
        }

        setPersona(transformPersona(data));
      } catch (error) {
        console.error('Error fetching persona:', error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchPersona();
  }, [personaId, navigate]);

  const handleBack = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/demo');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!persona) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Persona not found</h1>
          <button
            onClick={handleBack}
            className="text-primary hover:underline"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen">
      <ChatInterface persona={persona} onBack={handleBack} />
    </div>
  );
};

export default Chat;