import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuthContext } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface SimplePersonaCreatorProps {
  onPersonaCreated?: () => void;
}

const SimplePersonaCreator = ({ onPersonaCreated }: SimplePersonaCreatorProps) => {
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    description: '',
    tone: 'conversational',
    avatar: '🤖',
    color: 'hsl(220 70% 50%)'
  });
  const [selectedTraits, setSelectedTraits] = useState<string[]>(['friendly', 'helpful']);
  const [isCreating, setIsCreating] = useState(false);
  
  const { user } = useAuthContext();

  const personalityTraits = [
    'friendly', 'creative', 'analytical', 'empathetic', 'humorous',
    'patient', 'energetic', 'wise', 'supportive', 'curious',
    'optimistic', 'professional', 'playful', 'thoughtful', 'encouraging'
  ];

  const avatarOptions = ['🤖', '👤', '🧠', '✨', '🌟', '💡', '🎭', '🦉', '🎨', '📚'];
  const colorOptions = [
    'hsl(220 70% 50%)', 'hsl(280 70% 60%)', 'hsl(340 75% 65%)', 
    'hsl(200 100% 60%)', 'hsl(120 60% 50%)', 'hsl(40 90% 60%)',
    'hsl(0 70% 60%)', 'hsl(260 70% 60%)', 'hsl(160 60% 50%)'
  ];

  const handleTraitToggle = (trait: string) => {
    setSelectedTraits(prev => 
      prev.includes(trait) 
        ? prev.filter(t => t !== trait)
        : [...prev, trait]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to create a persona.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.name || !formData.title || !formData.description) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);
    
    try {
      console.log('Starting persona creation...');
      console.log('User ID:', user.id);
      console.log('User object:', user);

      // TEMPORARY: Skip database and store locally for testing
      console.log('Using local storage fallback...');

      const personaData = {
        id: `custom-${Date.now()}`, // Generate unique ID
        name: formData.name.trim(),
        title: formData.title.trim(), 
        description: formData.description.trim(),
        personality: selectedTraits,
        tone: formData.tone,
        avatar: formData.avatar,
        color: formData.color,
        system_prompt: `You are ${formData.name.trim()}, ${formData.title.trim()}. ${formData.description.trim()} Your personality traits include: ${selectedTraits.join(', ')}. Always maintain a ${formData.tone} tone in your responses.`,
        example_dialogues: [],
        user_id: user.id
      };

      console.log('Complete persona data:', personaData);

      // Store in localStorage with user-specific key
      const userPersonasKey = `customPersonas_${user.id}`;
      const existingPersonas = JSON.parse(localStorage.getItem(userPersonasKey) || '[]');
      existingPersonas.push(personaData);
      localStorage.setItem(userPersonasKey, JSON.stringify(existingPersonas));

      console.log(`Persona stored locally for user ${user.id}. Total personas:`, existingPersonas.length);

      // Also try database insert in background (don't wait for it)
      console.log('Attempting background database insert...');
      const backgroundInsert = async () => {
        try {
          const result = await supabase
            .from('personas')
            .insert([{
              name: personaData.name,
              title: personaData.title,
              description: personaData.description,
              personality: personaData.personality,
              tone: personaData.tone,
              avatar: personaData.avatar,
              color: personaData.color,
              system_prompt: personaData.system_prompt,
              example_dialogues: personaData.example_dialogues,
              user_id: personaData.user_id
            }]);
          console.log('Background database insert result:', result);
        } catch (error) {
          console.log('Background database insert failed:', error);
        }
      };
      backgroundInsert();

      toast({
        title: "Success!",
        description: `${formData.name} created successfully!`,
      });

      // Reset form
      setFormData({ 
        name: '', 
        title: '', 
        description: '', 
        tone: 'conversational',
        avatar: '🤖',
        color: 'hsl(220 70% 50%)'
      });
      setSelectedTraits(['friendly', 'helpful']);
      
      // Refresh the dashboard to show the new persona
      if (onPersonaCreated) {
        onPersonaCreated();
      }

    } catch (error) {
      console.error('Error creating persona:', error);
      
      // Provide more specific error messages
      let errorMessage = "Failed to create persona. Please try again.";
      if (error && typeof error === 'object' && 'message' in error) {
        errorMessage = (error as any).message;
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Persona</CardTitle>
        <CardDescription>
          Create a custom AI persona that will work just like the built-in ones
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Persona Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Alex"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Title/Role</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Creative Writing Assistant"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe what this persona does and how they help..."
              className="min-h-[100px]"
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
                  onClick={() => handleTraitToggle(trait)}
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
              value={formData.tone}
              onChange={(e) => setFormData(prev => ({ ...prev, tone: e.target.value }))}
              placeholder="e.g., warm and encouraging, professional yet friendly"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Avatar</Label>
              <div className="flex flex-wrap gap-2">
                {avatarOptions.map((emoji) => (
                  <Button
                    key={emoji}
                    type="button"
                    variant={formData.avatar === emoji ? "default" : "outline"}
                    className="w-12 h-12 text-xl"
                    onClick={() => setFormData(prev => ({ ...prev, avatar: emoji }))}
                  >
                    {emoji}
                  </Button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Color Theme</Label>
              <div className="flex flex-wrap gap-2">
                {colorOptions.map((color) => (
                  <Button
                    key={color}
                    type="button"
                    variant="outline"
                    className="w-8 h-8 p-0 border-2"
                    style={{ 
                      backgroundColor: color,
                      borderColor: formData.color === color ? '#000' : 'transparent'
                    }}
                    onClick={() => setFormData(prev => ({ ...prev, color }))}
                  />
                ))}
              </div>
              <Input
                value={formData.color}
                onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                placeholder="hsl(220 70% 50%)"
                className="text-xs"
              />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isCreating}
          >
            {isCreating ? 'Creating...' : 'Create Persona'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default SimplePersonaCreator;
