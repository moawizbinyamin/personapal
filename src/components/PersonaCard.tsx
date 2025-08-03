import { MessageCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Persona } from '@/data/personas';

interface PersonaCardProps {
  persona: Persona;
  onChat: (persona: Persona) => void;
  className?: string;
}

const PersonaCard = ({ persona, onChat, className = "" }: PersonaCardProps) => {
  return (
    <Card className={`group cursor-pointer transition-all duration-300 hover:shadow-medium hover:-translate-y-1 bg-gradient-card border-border/50 ${className}`}>
      <CardHeader className="text-center pb-4">
        <div 
          className="w-16 h-16 mx-auto rounded-full flex items-center justify-center text-2xl mb-4 shadow-soft group-hover:shadow-medium transition-all duration-300 group-hover:scale-110"
          style={{ backgroundColor: persona.color }}
        >
          {persona.avatar}
        </div>
        <CardTitle className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
          {persona.name}
        </CardTitle>
        <CardDescription className="text-muted-foreground font-medium">
          {persona.title}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground leading-relaxed">
          {persona.description}
        </p>
        
        <div className="flex flex-wrap gap-2">
          {persona.personality.slice(0, 3).map((trait) => (
            <Badge 
              key={trait} 
              variant="secondary" 
              className="text-xs bg-muted/70 hover:bg-muted transition-colors"
            >
              {trait}
            </Badge>
          ))}
          {persona.personality.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{persona.personality.length - 3} more
            </Badge>
          )}
        </div>
        
        <Button 
          onClick={() => onChat(persona)}
          className="w-full bg-gradient-primary hover:opacity-90 shadow-soft hover:shadow-medium transition-all duration-300 group/btn"
        >
          <MessageCircle className="h-4 w-4 mr-2 group-hover/btn:scale-110 transition-transform" />
          Start Chatting
          <Sparkles className="h-4 w-4 ml-2 group-hover/btn:rotate-12 transition-transform" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default PersonaCard;