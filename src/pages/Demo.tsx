import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import PersonaGrid from '@/components/PersonaGrid';
import ChatInterface from '@/components/ChatInterface';
import { Persona } from '@/data/personas';

const Demo = () => {
  const location = useLocation();
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(
    location.state?.selectedPersona || null
  );

  if (selectedPersona) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-1">
          <ChatInterface 
            persona={selectedPersona} 
            onBack={() => setSelectedPersona(null)} 
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-8">
        <PersonaGrid 
          onPersonaSelect={setSelectedPersona}
          title="Try Our AI Personas"
          subtitle="Select any persona below to start a conversation in demo mode"
        />
      </div>
    </div>
  );
};

export default Demo;