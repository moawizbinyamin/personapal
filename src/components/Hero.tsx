import { ArrowRight, Sparkles, Heart, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import heroImage from '@/assets/hero-personas.jpg';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative py-20 lg:py-32 bg-gradient-hero overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-20 h-20 bg-primary/30 rounded-full blur-xl animate-float"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-accent/30 rounded-full blur-xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-secondary/30 rounded-full blur-xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-white/30">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
              <span className="text-sm font-medium text-primary-foreground">AI Personas Made Simple</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-primary-foreground leading-tight">
              Meet Your Perfect
              <span className="block bg-gradient-to-r from-white to-primary-glow bg-clip-text text-transparent">
                AI Companion
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-primary-foreground/90 mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0">
              Connect with unique AI personas designed to understand, support, and inspire you. 
              From warm conversations to deep insights - find your perfect digital companion.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                size="lg"
                onClick={() => navigate('/demo')}
                className="bg-white/20 backdrop-blur-sm text-primary-foreground border border-white/30 hover:bg-white/30 shadow-medium hover:shadow-strong transition-all duration-300 group"
              >
                <MessageCircle className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                Try Demo Now
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button 
                size="lg"
                variant="outline"
                onClick={() => navigate('/auth?mode=signup')}
                className="bg-transparent border-white/30 text-primary-foreground hover:bg-white/10 hover:border-white/50 transition-all duration-300"
              >
                <Heart className="h-5 w-5 mr-2" />
                Create Account
              </Button>
            </div>
            
            <div className="mt-8 flex items-center justify-center lg:justify-start space-x-6 text-primary-foreground/80">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary-glow rounded-full animate-pulse"></div>
                <span className="text-sm">Always Available</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary-glow rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                <span className="text-sm">Deeply Personal</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary-glow rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                <span className="text-sm">Always Learning</span>
              </div>
            </div>
          </div>
          
          {/* Hero Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-strong bg-gradient-card">
              <img 
                src={heroImage}
                alt="AI Personas floating in a dreamy, welcoming space"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"></div>
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 bg-white rounded-full p-3 shadow-medium animate-float">
              <Heart className="h-6 w-6 text-primary" />
            </div>
            <div className="absolute -bottom-4 -left-4 bg-secondary rounded-full p-3 shadow-medium animate-float" style={{ animationDelay: '1.5s' }}>
              <MessageCircle className="h-6 w-6 text-secondary-foreground" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;