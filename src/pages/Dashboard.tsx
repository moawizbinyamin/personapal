import { useState, useEffect } from 'react';
import { Plus, Sparkles, MessageCircle, User, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Navbar from '@/components/Navbar';
import PersonaGrid from '@/components/PersonaGrid';
import PersonaCreator from '@/components/PersonaCreator';
import { Persona, transformPersona } from '@/utils/types';
import { defaultPersonas } from '@/data/personas';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<'chat' | 'create'>('chat');
  const [customPersonas, setCustomPersonas] = useState<Persona[]>([]);
  const [allPersonas, setAllPersonas] = useState<Persona[]>(defaultPersonas);
  const [stats, setStats] = useState({
    totalConversations: 0,
    customPersonas: 0,
    activeToday: 0,
  });
  const [hasGeminiKey, setHasGeminiKey] = useState(false);
  
  const { user } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    // Check if Gemini API key is available
    setHasGeminiKey(!!import.meta.env.VITE_GEMINI_API_KEY);
    
    fetchCustomPersonas();
    fetchStats();
  }, [user, navigate]);

  const fetchCustomPersonas = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('personas')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      
      const personas = data.map(transformPersona);
      setCustomPersonas(personas);
      setAllPersonas([...defaultPersonas, ...personas]);
    } catch (error) {
      console.error('Error fetching custom personas:', error);
    }
  };

  const fetchStats = async () => {
    if (!user) return;

    try {
      // Get chat count
      const { count: conversationCount } = await supabase
        .from('chats')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      // Get custom personas count
      const { count: personaCount } = await supabase
        .from('personas')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      // Get today's chats
      const today = new Date().toISOString().split('T')[0];
      const { count: todayCount } = await supabase
        .from('chats')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('created_at', today);

      setStats({
        totalConversations: conversationCount || 0,
        customPersonas: personaCount || 0,
        activeToday: todayCount || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handlePersonaSelect = (persona: Persona) => {
    navigate(`/chat/${persona.id}`);
  };

  const handlePersonaCreated = () => {
    fetchCustomPersonas();
    fetchStats();
    setActiveTab('chat');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-8 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {!hasGeminiKey && (
            <Alert className="mb-6 border-orange-200 bg-orange-50 text-orange-800">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Gemini API Key Required</AlertTitle>
              <AlertDescription>
                To enable AI chat functionality, please add your Gemini API key to the environment variable 
                <code className="mx-1 px-1 bg-orange-100 rounded">VITE_GEMINI_API_KEY</code>. 
                Get your free API key from <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline font-medium">Google AI Studio</a>.
              </AlertDescription>
            </Alert>
          )}
          
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent mb-2">
              Welcome to Your Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage your AI conversations and create custom personas
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-gradient-card shadow-soft">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Conversations</CardTitle>
                <MessageCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalConversations}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.totalConversations === 0 ? 'Start your first chat!' : 'Keep chatting!'}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-card shadow-soft">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Custom Personas</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.customPersonas}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.customPersonas === 0 ? 'Create your first persona' : 'Amazing creativity!'}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-card shadow-soft">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Today</CardTitle>
                <Sparkles className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeToday}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.activeToday === 0 ? 'Start chatting today!' : 'Great progress today!'}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-4 mb-8">
            <Button
              variant={activeTab === 'chat' ? 'default' : 'outline'}
              onClick={() => setActiveTab('chat')}
              className={activeTab === 'chat' ? 'bg-gradient-primary' : ''}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Chat with Personas
            </Button>
            <Button
              variant={activeTab === 'create' ? 'default' : 'outline'}
              onClick={() => setActiveTab('create')}
              className={activeTab === 'create' ? 'bg-gradient-primary' : ''}
              disabled={!hasGeminiKey}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Persona
            </Button>
          </div>

          {/* Content */}
          {activeTab === 'chat' ? (
            <PersonaGrid 
              personas={allPersonas}
              onPersonaSelect={handlePersonaSelect}
              title="Available Personas"
              subtitle="Select a persona to start a conversation"
            />
          ) : (
            <PersonaCreator onPersonaCreated={handlePersonaCreated} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;