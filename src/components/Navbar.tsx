import { useState } from 'react';
import { Heart, Menu, X, MessageCircle, User, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/', label: 'Home', icon: Heart },
    { path: '/demo', label: 'Try Demo', icon: MessageCircle },
    { path: '/dashboard', label: 'Dashboard', icon: Sparkles },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center space-x-2 cursor-pointer group"
            onClick={() => navigate('/')}
          >
            <div className="p-2 bg-gradient-primary rounded-xl shadow-soft group-hover:shadow-medium transition-all duration-300">
              <Heart className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              PersonaPal
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                    isActive(item.path)
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button 
              variant="ghost"
              onClick={() => navigate('/auth')}
              className="hover:bg-muted/70"
            >
              <User className="h-4 w-4 mr-2" />
              Sign In
            </Button>
            <Button 
              onClick={() => navigate('/auth?mode=signup')}
              className="bg-gradient-primary hover:opacity-90 shadow-soft hover:shadow-medium transition-all duration-300"
            >
              Get Started
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-muted/50 transition-colors"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-2 animate-fade-in">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setIsMenuOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                    isActive(item.path)
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
            <div className="flex flex-col space-y-2 pt-4 border-t border-border">
              <Button 
                variant="ghost"
                onClick={() => {
                  navigate('/auth');
                  setIsMenuOpen(false);
                }}
                className="justify-start hover:bg-muted/70"
              >
                <User className="h-4 w-4 mr-2" />
                Sign In
              </Button>
              <Button 
                onClick={() => {
                  navigate('/auth?mode=signup');
                  setIsMenuOpen(false);
                }}
                className="bg-gradient-primary hover:opacity-90 shadow-soft"
              >
                Get Started
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;