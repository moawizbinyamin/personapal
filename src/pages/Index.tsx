import { ArrowRight, Users, Shield, Zap, Heart, Sparkles, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import PersonaGrid from '@/components/PersonaGrid';
import { Persona } from '@/data/personas';

const Index = () => {
  const navigate = useNavigate();

  const handlePersonaSelect = (persona: Persona) => {
    navigate('/demo', { state: { selectedPersona: persona } });
  };

  const features = [
    {
      icon: MessageCircle,
      title: "Natural Conversations",
      description: "Engage in meaningful, context-aware conversations that feel genuinely human and empathetic."
    },
    {
      icon: Users,
      title: "Diverse Personalities",
      description: "Choose from carefully crafted personas or create your own with unique traits and expertise."
    },
    {
      icon: Shield,
      title: "Private & Secure",
      description: "Your conversations are private and secure, with enterprise-grade encryption and data protection."
    },
    {
      icon: Zap,
      title: "Always Available",
      description: "Get instant responses 24/7. Your AI companions are always ready to chat when you need them."
    }
  ];

  const stats = [
    { value: "10,000+", label: "Happy Users" },
    { value: "50+", label: "AI Personas" },
    { value: "24/7", label: "Availability" },
    { value: "99.9%", label: "Uptime" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <Hero />
      
      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-hero bg-clip-text text-transparent">
              Why Choose PersonaPal?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience the future of AI interaction with our thoughtfully designed platform
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card 
                  key={index} 
                  className="text-center group hover:shadow-medium transition-all duration-300 hover:-translate-y-1 bg-gradient-card border-border/50"
                >
                  <CardHeader>
                    <div className="w-12 h-12 mx-auto bg-gradient-primary rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-soft">
                      <Icon className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <CardTitle className="text-lg font-semibold">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
      
      {/* Personas Section */}
      <PersonaGrid 
        onPersonaSelect={handlePersonaSelect}
        title="Meet Our Featured Personas"
        subtitle="Start with our carefully crafted AI companions, each with unique personalities and expertise"
      />
      
      {/* Stats Section */}
      <section className="py-16 bg-gradient-secondary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-secondary-foreground mb-2">
                  {stat.value}
                </div>
                <div className="text-secondary-foreground/80 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 bg-gradient-hero bg-clip-text text-transparent">
              Ready to Meet Your Perfect AI Companion?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Join thousands of users who have discovered meaningful connections with our AI personas. 
              Start your journey today with a free demo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                onClick={() => navigate('/demo')}
                className="bg-gradient-primary hover:opacity-90 shadow-medium hover:shadow-strong transition-all duration-300 group"
              >
                <Sparkles className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform" />
                Try Demo Now
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                size="lg"
                variant="outline"
                onClick={() => navigate('/auth?mode=signup')}
                className="border-primary/30 hover:bg-primary/5 transition-all duration-300"
              >
                <Heart className="h-5 w-5 mr-2" />
                Create Free Account
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-muted/50 py-12 border-t border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="p-2 bg-gradient-primary rounded-xl shadow-soft">
                <Heart className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                PersonaPal
              </span>
            </div>
            <p className="text-muted-foreground mb-4">
              Connecting hearts and minds through meaningful AI conversations
            </p>
            <p className="text-sm text-muted-foreground">
              © 2024 PersonaPal. Made with love for genuine connections.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
