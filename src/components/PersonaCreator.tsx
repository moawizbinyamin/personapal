import { useState } from 'react';
import { Sparkles, Brain, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface PersonaCreatorProps {
  onPersonaCreated: () => void;
}

function PersonaCreator({ onPersonaCreated }: PersonaCreatorProps) {
  const { user } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
    setError(null);
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handlePersonalityToggle = (trait: string) => {
    setError(null);
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

  const validateForm = (): string | null => {
    if (!formData.name.trim()) return 'Name is required';
    if (!formData.title.trim()) return 'Title is required';
    if (!formData.description.trim()) return 'Description is required';
    if (!formData.tone.trim()) return 'Communication tone is required';
    if (!formData.personality.trim()) return 'At least one personality trait is required';
    if (formData.name.length > 50) return 'Name must be less than 50 characters';
    if (formData.title.length > 100) return 'Title must be less than 100 characters';
    if (formData.description.length > 500) return 'Description must be less than 500 characters';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🚀 Form submitted');
    
    setError(null);
    
    if (!user) {
      console.log('❌ No user found');
      setError('You must be logged in to create personas');
      toast({
        title: "Authentication Error",
        description: "Please log in to create personas",
        variant: "destructive",
      });
      return;
    }

    console.log('✅ User authenticated:', user.id);

    const validationError = validateForm();
    if (validationError) {
      console.log('❌ Validation failed:', validationError);
      setError(validationError);
      toast({
        title: "Validation Error",
        description: validationError,
        variant: "destructive",
      });
      return;
    }

    console.log('✅ Form validation passed');
    setIsLoading(true);

    try {
      const personalityArray = formData.personality.split(',').map(t => t.trim()).filter(Boolean);
      console.log('🎭 Personality array:', personalityArray);
      
      const systemPrompt = `You are ${formData.name}, a ${formData.title}. ${formData.description}

Your personality traits include: ${personalityArray.join(', ')}.
Your communication tone is ${formData.tone}.

You should respond in character as this persona, maintaining consistent personality and tone throughout the conversation. Be helpful, engaging, and stay true to your character description.`;

      console.log('📝 Generated system prompt length:', systemPrompt.length);

      const insertData = {
        name: formData.name.trim(),
        title: formData.title.trim(),
        description: formData.description.trim(),
        personality: personalityArray,
        tone: formData.tone.trim(),
        avatar: formData.avatar,
        color: formData.color,
        system_prompt: systemPrompt,
        example_dialogues: [],
        user_id: user.id,
      };

      console.log('💾 Prepared insert data:', {
        ...insertData,
        system_prompt: `${systemPrompt.substring(0, 50)}...`,
        personality: personalityArray
      });

      // Check if user profile exists
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, email')
        .eq('id', user.id)
        .single();
        
      if (profileError) {
        console.error('❌ Profile check failed:', profileError);
        throw new Error(`Profile issue: ${profileError.message}`);
      }
      
      console.log('✅ User profile found:', profileData);

      console.log('💾 Attempting database insert...');

      // First, let's test a simple database connection
      const { data: testData, error: testError } = await supabase
        .from('personas')
        .select('count')
        .limit(1);
      
      if (testError) {
        console.error('❌ Database connection test failed:', testError);
        throw new Error(`Database connection failed: ${testError.message}`);
      }
      
      console.log('✅ Database connection test passed');

      const { data, error: insertError } = await supabase
        .from('personas')
        .insert(insertData)
        .select()
        .single();

      if (insertError) {
        console.error('❌ Database error:', insertError);
        throw new Error(`Database error: ${insertError.message}`);
      }

      if (!data) {
        console.error('❌ No data returned from insert');
        throw new Error('No data returned from database insert');
      }

      console.log('✅ Persona created successfully:', data.id);

      toast({
        title: "Success!",
        description: `${formData.name} has been created successfully`,
      });

      setFormData({
        name: '',
        title: '',
        description: '',
        personality: '',
        tone: '',
        avatar: '🤖',
        color: 'hsl(220 70% 60%)',
      });

      console.log('🔄 Calling onPersonaCreated callback...');
      onPersonaCreated();
      console.log('✅ Persona creation completed');

    } catch (error) {
      console.error('💥 Error creating persona:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(errorMessage);
      
      toast({
        title: "Creation Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      console.log('🔄 Resetting loading state');
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
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                name="name"
                placeholder="e.g., Alex"
                value={formData.name}
                onChange={handleInputChange}
                required
                maxLength={50}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                name="title"
                placeholder="e.g., Creative Writing Coach"
                value={formData.title}
                onChange={handleInputChange}
                required
                maxLength={100}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe what makes this persona special and how they help people..."
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              required
              maxLength={500}
              disabled={isLoading}
            />
            <div className="text-xs text-muted-foreground text-right">
              {formData.description.length}/500
            </div>
          </div>

          <div className="space-y-2">
            <Label>Personality Traits *</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {personalityTraits.map((trait) => (
                <Badge
                  key={trait}
                  variant={selectedTraits.includes(trait) ? "default" : "outline"}
                  className={`cursor-pointer transition-all ${
                    selectedTraits.includes(trait) 
                      ? 'bg-gradient-primary text-primary-foreground' 
                      : 'hover:bg-accent'
                  } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={() => !isLoading && handlePersonalityToggle(trait)}
                >
                  {trait}
                </Badge>
              ))}
            </div>
            <div className="text-xs text-muted-foreground">
              Selected: {selectedTraits.length > 0 ? selectedTraits.join(', ') : 'None (select at least one)'}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tone">Communication Tone *</Label>
            <Input
              id="tone"
              name="tone"
              placeholder="e.g., warm and encouraging, professional yet friendly"
              value={formData.tone}
              onChange={handleInputChange}
              required
              disabled={isLoading}
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
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="color">Color Theme</Label>
              <div className="flex items-center space-x-2">
                <Input
                  type="color"
                  value={formData.color.startsWith('hsl') ? '#4299e1' : formData.color}
                  onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                  className="w-16 h-10"
                  disabled={isLoading}
                />
                <Input
                  placeholder="hsl(220 70% 60%)"
                  value={formData.color}
                  onChange={handleInputChange}
                  name="color"
                  className="flex-1"
                  disabled={isLoading}
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

          <div className="text-xs text-muted-foreground text-center">
            * Required fields
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default PersonaCreator;
