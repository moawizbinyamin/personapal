import { useState, useRef, useEffect } from 'react';
import { Send, ArrowLeft, Sparkles, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Persona } from '@/data/personas';
import { generatePersonaResponse } from '@/lib/gemini';
import { useAuthContext } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

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
  const { user } = useAuthContext();
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
  const [conversationId, setConversationId] = useState<string | null>(null);
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

  const saveConversation = async (updatedMessages: Message[]) => {
    if (!user) return;

    try {
      const conversationData = {
        user_id: user.id,
        persona_id: persona.id,
        title: `Chat with ${persona.name}`,
        messages: updatedMessages,
      };

      if (conversationId) {
        // Update existing conversation
        await supabase
          .from('conversations')
          .update({ messages: updatedMessages })
          .eq('id', conversationId);
      } else {
        // Create new conversation
        const { data, error } = await supabase
          .from('conversations')
          .insert(conversationData)
          .select()
          .single();

        if (error) throw error;
        setConversationId(data.id);
      }
    } catch (error) {
      console.error('Error saving conversation:', error);
    }
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

    // Generate AI response
    try {
      const conversationHistory = messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' as const : 'assistant' as const,
        content: msg.text,
      }));

      const response = await generatePersonaResponse(
        persona.systemPrompt,
        conversationHistory,
        persona.name
      );

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'assistant',
        timestamp: new Date()
      };

      const updatedMessages = [...messages, userMessage, aiResponse];
      setMessages(updatedMessages);
      
      // Save conversation if user is logged in
      await saveConversation(updatedMessages);
      
      setIsTyping(false);
    } catch (error) {
      console.error('Error generating response:', error);
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I'm having trouble responding right now. Please try again.",
        sender: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorResponse]);
      setIsTyping(false);
    }
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
              <span>{user ? 'AI Powered' : 'Demo Mode'}</span>
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
          
          {!user && (
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Demo mode with simulated responses. Sign in to access real AI conversations!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;