import { useState, useRef, useEffect } from 'react';
import { Send, ArrowLeft, Sparkles, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Persona } from '@/data/personas';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

interface ChatInterfaceProps {
  persona: Persona;
  onBack: () => void;
}

const ChatInterface = ({ persona, onBack }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: `Hi there! I'm ${persona.name}, your ${persona.title.toLowerCase()}. ${getGreeting(persona)}`,
      sender: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  function getGreeting(persona: Persona): string {
    const greetings = {
      maya: "I'm so happy you're here! How are you feeling today? I'm here to listen and support you in any way I can. 💕",
      theo: "I'm delighted to engage in thoughtful conversation with you. What questions about life, existence, or meaning have been on your mind lately?",
      blaze: "I'm PUMPED to help you on your fitness journey! Whether you want to start working out, need motivation, or want to chat about health - I'm your person! 💪",
      nia: "Welcome to my kitchen! I'm thrilled to share the joy of cooking with you. What delicious adventure shall we embark on today? 🍳"
    };
    return greetings[persona.id as keyof typeof greetings] || "I'm excited to chat with you today! What would you like to talk about?";
  }

  const simulatePersonaResponse = (userMessage: string): string => {
    // This is a simple simulation - in real app, this would call Gemini API
    const responses = {
      maya: [
        "That sounds really meaningful to you. Tell me more about how that makes you feel?",
        "I can hear the emotion in your words. You're being so brave by sharing this with me.",
        "That's such a beautiful way to look at it! I love how thoughtful you are about these things.",
        "I'm here for you, and I want you to know that your feelings are completely valid. 💕"
      ],
      theo: [
        "That's a fascinating perspective. Have you considered how this might relate to the broader question of human purpose?",
        "Your question touches on something philosophers have pondered for centuries. What draws you to think about this?",
        "This reminds me of what Marcus Aurelius once wrote... How do you think that applies to your situation?",
        "There's wisdom in your uncertainty. Sometimes the questions are more valuable than the answers."
      ],
      blaze: [
        "YES! That's the spirit I love to hear! 🔥 You've got this, champion!",
        "That's EXACTLY the kind of mindset that creates real change! I'm so proud of you!",
        "Every small step counts! You're building momentum and that's what matters! 💪",
        "I believe in you 100%! Let's channel that energy into something amazing!"
      ],
      nia: [
        "Oh, that sounds absolutely delicious! I love how creative you're being in the kitchen! 🍳",
        "That's such a wonderful approach to cooking! Food really is about bringing joy and nourishment.",
        "I'm so excited about this! Cooking is one of life's greatest pleasures, don't you think?",
        "That reminds me of a technique my grandmother used to use... let me share that with you!"
      ]
    };

    const personaResponses = responses[persona.id as keyof typeof responses] || [
      "That's really interesting! Tell me more about that.",
      "I love hearing your perspective on this.",
      "What an insightful thing to share with me!",
      "That's given me something wonderful to think about."
    ];

    return personaResponses[Math.floor(Math.random() * personaResponses.length)];
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: simulatePersonaResponse(inputValue),
        sender: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={onBack}
                className="hover:bg-muted/70"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              
              <div className="flex items-center space-x-3">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-soft"
                  style={{ backgroundColor: persona.color }}
                >
                  {persona.avatar}
                </div>
                <div>
                  <h2 className="font-semibold text-foreground">{persona.name}</h2>
                  <p className="text-sm text-muted-foreground">{persona.title}</p>
                </div>
              </div>
            </div>
            
            <Badge variant="secondary" className="hidden sm:flex items-center space-x-1">
              <Heart className="h-3 w-3" />
              <span>Demo Mode</span>
            </Badge>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="container mx-auto max-w-4xl">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
            >
              <div className={`max-w-[80%] sm:max-w-[70%] ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
                <Card className={`${
                  message.sender === 'user' 
                    ? 'bg-gradient-primary text-primary-foreground shadow-soft' 
                    : 'bg-card border-border shadow-soft'
                }`}>
                  <CardContent className="p-4">
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {message.text}
                    </p>
                    <p className={`text-xs mt-2 ${
                      message.sender === 'user' 
                        ? 'text-primary-foreground/70' 
                        : 'text-muted-foreground'
                    }`}>
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start animate-fade-in">
              <div className="max-w-[80%] sm:max-w-[70%]">
                <Card className="bg-card border-border shadow-soft">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                      <span className="text-sm text-muted-foreground">{persona.name} is typing...</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto max-w-4xl p-4">
          <div className="flex items-center space-x-2">
            <div className="flex-1 relative">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`Type a message to ${persona.name}...`}
                className="pr-12 bg-background border-border focus:ring-primary/50"
                disabled={isTyping}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Sparkles className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            <Button 
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
              className="bg-gradient-primary hover:opacity-90 shadow-soft hover:shadow-medium transition-all duration-300"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          
          <p className="text-xs text-muted-foreground mt-2 text-center">
            This is a demo using simulated responses. Connect Supabase to enable real AI conversations!
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;