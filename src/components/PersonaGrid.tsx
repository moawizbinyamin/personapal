import { defaultPersonas, Persona } from '@/data/personas';
import PersonaCard from './PersonaCard';

interface PersonaGridProps {
  onPersonaSelect: (persona: Persona) => void;
  title?: string;
  subtitle?: string;
  personas?: Persona[];
  className?: string;
}

const PersonaGrid = ({ 
  onPersonaSelect, 
  title = "Meet Our AI Personas", 
  subtitle = "Each persona has a unique personality and expertise",
  personas = defaultPersonas,
  className = ""
}: PersonaGridProps) => {
  return (
    <section className={`py-16 bg-background ${className}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-hero bg-clip-text text-transparent">
            {title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {personas.map((persona) => (
            <PersonaCard
              key={persona.id}
              persona={persona}
              onChat={onPersonaSelect}
              className="animate-fade-in"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PersonaGrid;