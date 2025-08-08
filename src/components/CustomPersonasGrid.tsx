import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PersonaCard from './PersonaCard';
import { useAuthContext } from '@/contexts/AuthContext';
import { Persona } from '@/utils/types';

interface CustomPersonasGridProps {
  onPersonaSelect?: (persona: Persona) => void;
  refreshTrigger?: number;
}

const CustomPersonasGrid: React.FC<CustomPersonasGridProps> = ({ 
  onPersonaSelect,
  refreshTrigger = 0 
}) => {
  const [customPersonas, setCustomPersonas] = useState<Persona[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthContext();
  const navigate = useNavigate();

  // Fetch custom personas from localStorage
  const fetchCustomPersonas = () => {
    if (!user) {
      setCustomPersonas([]);
      setLoading(false);
      return;
    }
    
    try {
      const userPersonasKey = `customPersonas_${user.id}`;
      const localPersonasRaw = localStorage.getItem(userPersonasKey);
      
      if (localPersonasRaw) {
        const localPersonas = JSON.parse(localPersonasRaw);
        setCustomPersonas(localPersonas);
      } else {
        setCustomPersonas([]);
      }
    } catch (error) {
      console.error('Error loading custom personas:', error);
      setCustomPersonas([]);
    } finally {
      setLoading(false);
    }
  };

  // Load personas on mount and when refresh trigger changes
  useEffect(() => {
    setLoading(true);
    fetchCustomPersonas();
  }, [user, refreshTrigger]);

  // Listen for custom persona creation events
  useEffect(() => {
    const handlePersonaCreated = () => {
      fetchCustomPersonas();
    };

    window.addEventListener('personaCreated', handlePersonaCreated);
    return () => window.removeEventListener('personaCreated', handlePersonaCreated);
  }, [user]);

  const handlePersonaClick = (persona: Persona) => {
    if (onPersonaSelect) {
      onPersonaSelect(persona);
    } else {
      navigate(`/chat/${persona.id}`);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="text-muted-foreground mt-2">Loading your custom personas...</p>
      </div>
    );
  }

  if (customPersonas.length === 0) {
    return (
      <div className="text-center py-16 bg-gradient-card rounded-xl border border-border/50 relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5"></div>
        <div className="relative z-10">
          <div className="max-w-md mx-auto">
            <div className="mb-6">
              <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-3xl">✨</span>
              </div>
              <h3 className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent mb-3">
                No Custom Personas Yet
              </h3>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Create your first custom persona to see it here. Design unique AI personalities 
                with their own traits, tones, and styles.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent mb-4">
            ✨ Your Custom Personas
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {customPersonas.length} unique persona{customPersonas.length !== 1 ? 's' : ''} created by you
          </p>
        </div>

        {/* Personas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {customPersonas.map((persona) => (
            <PersonaCard 
              key={persona.id}
              persona={persona} 
              onChat={handlePersonaClick}
            />
          ))}
        </div>

        {/* Footer Info */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center px-4 py-2 bg-muted rounded-full text-sm text-muted-foreground">
            <span className="mr-2">💾</span>
            Stored locally on your device
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomPersonasGrid;
