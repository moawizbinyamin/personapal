import { useState } from 'react';
import { Plus, Sparkles, Palette, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { useAuthContext } from '@/contexts/AuthContext';
import { generateSystemPrompt } from '@/lib/gemini';
import { toast } from '@/hooks/use-toast';

interface PersonaCreatorProps {
  onPersonaCreated: () => void;
}

const PersonaCreator = ({ onPersonaCreated }: PersonaCreatorProps) => {
  const { user } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    description: '',
    personality: '',
    tone: '',
    avatar: '🤖',
    color: 'hsl(220 70% 60%)',
  });

  const personalityTraits = [
    'friendly', 'creative', 'analytical', 'empathetic', 'humorous',
    'patient', 'energetic', 'wise', 'supportive', 'curious',
    'optimistic', 'professional', 'playful', 'thoughtful', 'encouraging'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handlePersonalityToggle = (trait: string) => {
    const traits = formData.personality.split(',').map(t => t.trim()).filter(Boolean);
    const index = traits.indexOf(trait);
    
    if (index > -1) {
      traits.splice(index, 1);
    } else {
      traits.push(trait);
    }
    
    setFormData(prev => ({
      ...prev,
      personality: traits.join(', '),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create personas",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const personalityArray = formData.personality.split(',').map(t => t.trim()).filter(Boolean);
      
      // Generate system prompt using Gemini
      const systemPrompt = await generateSystemPrompt(
        formData.name,
        formData.title,
        formData.description,
        personalityArray,
        formData.tone
      );

      const { error } = await supabase
        .from('personas')
        .insert({
          name: formData.name,
          title: formData.title,
          description: formData.description,
          personality: personalityArray,
          tone: formData.tone,
          avatar: formData.avatar,
          color: formData.color,
          system_prompt: systemPrompt,
          example_dialogues: [],
          user_id: user.id,
          is_public: false,
        });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your persona has been created successfully",
      });

      // Reset form
      setFormData({
        name: '',
        title: '',
        description: '',
        personality: '',
        tone: '',
        avatar: '🤖',
        color: 'hsl(220 70% 60%)',
      });

      onPersonaCreated();
    } catch (error) {
      console.error('Error creating persona:', error);
      toast({
        title: "Error",
        description: "Failed to create persona. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const selectedTraits = formData.personality.split(',').map(t => t.trim()).filter(Boolean);

  return (
    <Card className="max-w-2xl mx-auto bg-gradient-card shadow-medium">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Brain className="h-5 w-5" />
          <span>Create Custom Persona</span>
        </CardTitle>
        <CardDescription>
          Design your own AI persona with unique personality traits and communication style
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="e.g., Alex"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="e.g., Creative Writing Coach"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe what makes this persona special and how they help people..."
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Personality Traits</Label>
            <div className="flex flex-wrap gap-2">
              {personalityTraits.map((trait) => (
                <Badge
                  key={trait}
                  variant={selectedTraits.includes(trait) ? "default" : "outline"}
                  className={`cursor-pointer transition-all ${
                    selectedTraits.includes(trait) 
                      ? 'bg-gradient-primary text-primary-foreground' 
                      : 'hover:bg-accent'
                  }`}
                  onClick={() => handlePersonalityToggle(trait)}
                >
                  {trait}
                </Badge>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Selected: {selectedTraits.join(', ') || 'None'}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tone">Communication Tone</Label>
            <Input
              id="tone"
              name="tone"
              placeholder="e.g., warm and encouraging, professional yet friendly"
              value={formData.tone}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="avatar">Avatar Emoji</Label>
              <Input
                id="avatar"
                name="avatar"
                placeholder="🤖"
                value={formData.avatar}
                onChange={handleInputChange}
                maxLength={2}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="color">Color Theme</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="color"
                  name="color"
                  type="color"
                  value={formData.color.startsWith('hsl') ? '#4299e1' : formData.color}
                  onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                  className="w-16 h-10"
                />
                <Input
                  placeholder="hsl(220 70% 60%)"
                  value={formData.color}
                  onChange={handleInputChange}
                  name="color"
                  className="flex-1"
                />
              </div>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-gradient-primary hover:opacity-90 shadow-soft"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating Persona...
              </div>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Create Persona
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PersonaCreator;