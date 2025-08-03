import { useState } from 'react';
import { Plus, Sparkles, MessageCircle, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import PersonaGrid from '@/components/PersonaGrid';
import { Persona } from '@/data/personas';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<'chat' | 'create'>('chat');

  const handlePersonaSelect = (persona: Persona) => {
    console.log('Starting chat with:', persona.name);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-8 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
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
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">Connect Supabase to track</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-card shadow-soft">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Custom Personas</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">Create your first persona</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-card shadow-soft">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Today</CardTitle>
                <Sparkles className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">Start chatting!</p>
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
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Persona
            </Button>
          </div>

          {/* Content */}
          {activeTab === 'chat' ? (
            <PersonaGrid 
              onPersonaSelect={handlePersonaSelect}
              title="Available Personas"
              subtitle="Select a persona to start a conversation"
            />
          ) : (
            <Card className="max-w-2xl mx-auto bg-gradient-card shadow-medium">
              <CardHeader>
                <CardTitle>Create Custom Persona</CardTitle>
                <CardDescription>
                  Connect Supabase to unlock persona creation with AI-powered system prompts
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center py-12">
                <Sparkles className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-6">
                  Persona creation will be available once you connect to Supabase
                </p>
                <Button variant="outline">
                  Connect Supabase to Continue
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;