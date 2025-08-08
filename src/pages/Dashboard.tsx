import { useState, useEffect } from 'react';
import { Plus, Sparkles, MessageCircle, User, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Navbar from '@/components/Navbar';
import PersonaGrid from '@/components/PersonaGrid';
import CustomPersonasGrid from '@/components/CustomPersonasGrid';
import SimplePersonaCreator from '@/components/SimplePersonaCreator';
// import DebugPersonas from '@/components/DebugPersonas'; // Keep in system but hidden from UI
import { Persona, transformPersona } from '@/utils/types';
import { defaultPersonas } from '@/data/personas';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<'chat' | 'create'>('chat');
  const [customPersonas, setCustomPersonas] = useState<Persona[]>([]);
  const [allPersonas, setAllPersonas] = useState<Persona[]>(defaultPersonas);
  const [refreshKey, setRefreshKey] = useState(0); // Force re-render key
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
    
    // Migrate old localStorage personas to user-specific key (one-time migration)
    const oldPersonas = localStorage.getItem('customPersonas');
    const userPersonasKey = `customPersonas_${user.id}`;
    const userPersonas = localStorage.getItem(userPersonasKey);
    
    if (oldPersonas && !userPersonas) {
      console.log('Migrating old personas to user-specific storage...');
      localStorage.setItem(userPersonasKey, oldPersonas);
      localStorage.removeItem('customPersonas');
    }
    
    fetchCustomPersonas();
    fetchStats();
    
    // Listen for custom events to refresh personas
    const handlePersonaCreated = () => {
      fetchCustomPersonas();
      fetchStats();
    };
    
    window.addEventListener('personaCreated', handlePersonaCreated);
    
    return () => {
      window.removeEventListener('personaCreated', handlePersonaCreated);
    };
  }, [user, navigate]);

  const fetchCustomPersonas = async () => {
    if (!user) {
      return;
    }
    
    try {
      // Get personas from user-specific localStorage key
      const userPersonasKey = `customPersonas_${user.id}`;
      const localPersonasRaw = localStorage.getItem(userPersonasKey);
      const localPersonas = JSON.parse(localPersonasRaw || '[]');
      
      // Try to get from database too
      const { data, error } = await supabase
        .from('personas')
        .select('*')
        .eq('user_id', user.id);

      let allCustomPersonas = [...localPersonas];
      
      if (!error && data) {
        const dbPersonas = data.map(transformPersona);
        // Combine local and database personas (avoid duplicates by ID)
        const combinedPersonas = [...allCustomPersonas];
        dbPersonas.forEach(dbPersona => {
          if (!combinedPersonas.find(p => p.id === dbPersona.id)) {
            combinedPersonas.push(dbPersona);
          }
        });
        allCustomPersonas = combinedPersonas;
      }
      
      setCustomPersonas(allCustomPersonas);
      
      const newAllPersonas = [...defaultPersonas, ...allCustomPersonas];
      setAllPersonas(newAllPersonas);
    } catch (error) {
      console.error('Error fetching custom personas:', error);
      // Fallback to local storage only
      const userPersonasKey = `customPersonas_${user.id}`;
      const localPersonas = JSON.parse(localStorage.getItem(userPersonasKey) || '[]');
      setCustomPersonas(localPersonas);
      setAllPersonas([...defaultPersonas, ...localPersonas]);
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

      // Get custom personas count from database
      const { count: dbPersonaCount } = await supabase
        .from('personas')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      // Get custom personas count from localStorage
      const userPersonasKey = `customPersonas_${user.id}`;
      const localPersonas = JSON.parse(localStorage.getItem(userPersonasKey) || '[]');
      const totalCustomPersonas = (dbPersonaCount || 0) + localPersonas.length;

      // Get today's chats
      const today = new Date().toISOString().split('T')[0];
      const { count: todayCount } = await supabase
        .from('chats')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('created_at', today);

      setStats({
        totalConversations: conversationCount || 0,
        customPersonas: totalCustomPersonas,
        activeToday: todayCount || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handlePersonaSelect = (persona: Persona) => {
    navigate(`/chat/${persona.id}`);
  };

  const handlePersonaCreated = async () => {
    // Force a re-fetch and re-render
    setTimeout(async () => {
      await fetchCustomPersonas();
      fetchStats();
      setRefreshKey(prev => prev + 1); // Force re-render
    }, 100);
    
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
            <div className="space-y-16">
              {/* Built-in Personas Section */}
              <div>
                <PersonaGrid 
                  key={`builtin-${refreshKey}`}
                  personas={defaultPersonas}
                  onPersonaSelect={handlePersonaSelect}
                  title="🤖 Built-in Personas"
                  subtitle="Choose from our carefully crafted AI personalities"
                />
              </div>
              
              {/* Custom Personas Section */}
              <div>
                <CustomPersonasGrid 
                  key={`custom-${refreshKey}`}
                  onPersonaSelect={handlePersonaSelect}
                  refreshTrigger={refreshKey}
                />
              </div>
            </div>
          ) : (
            <SimplePersonaCreator onPersonaCreated={handlePersonaCreated} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;