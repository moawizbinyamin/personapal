# PersonaPal Setup Guide

## 🚀 Quick Setup Instructions

### 1. Supabase Database Setup
1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `src/database/setup.sql`
4. Run the SQL script to create all necessary tables and security policies

### 2. Environment Variables
Add the following environment variable to your project:

```bash
VITE_GEMINI_API_KEY=your_actual_gemini_api_key_here
```

**How to get your Gemini API Key:**
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the key and replace `your_actual_gemini_api_key_here` with your actual key

**Important:** Make sure to replace the placeholder with your real API key for the AI chat functionality to work.

### 3. Supabase Configuration
The project is already configured to work with Supabase. The connection is handled through Lovable's native Supabase integration.

## 🎯 Features Included

### ✅ Authentication System
- Email/password signup and login
- User profiles with Supabase Auth
- Protected routes and user sessions

### ✅ AI Chat System
- Real-time chat with Gemini AI
- No simulation - all responses from Gemini API
- Dynamic conversation history
- Persona-specific system prompts

### ✅ Custom Persona Creation
- AI-powered system prompt generation
- Dynamic personality configuration
- Visual customization (avatar, colors)
- Database persistence

### ✅ Dashboard Features
- User statistics and analytics
- Persona management
- Conversation history
- Real-time data updates

## 🔧 System Architecture

### Frontend
- React 18 with TypeScript
- Tailwind CSS for styling
- React Router for navigation
- Zustand/Context for state management

### Backend
- Supabase for authentication
- PostgreSQL database
- Row Level Security (RLS)
- Real-time subscriptions

### AI Integration
- Google Gemini AI API
- Dynamic system prompt generation
- Contextual conversation handling

## 🚨 Troubleshooting

### Common Issues

1. **"Gemini API key is required" error**
   - Make sure you've added `VITE_GEMINI_API_KEY` to your environment
   - Verify the API key is valid and has proper permissions

2. **Authentication not working**
   - Ensure you've run the database setup SQL script
   - Check that Supabase is properly connected

3. **Persona creation fails**
   - Verify your Gemini API key has sufficient quota
   - Check the console for specific error messages

### Database Issues
If you encounter database errors:
1. Re-run the setup SQL script in Supabase SQL Editor
2. Check that all tables were created successfully
3. Verify RLS policies are enabled

## 🎨 Customization

### Adding New Default Personas
Edit `src/data/personas.ts` to add more built-in personas.

### Styling Changes
The design system is configured in:
- `src/index.css` - CSS variables and global styles
- `tailwind.config.ts` - Tailwind theme configuration

### AI Behavior
Modify the prompt generation in `src/lib/gemini.ts` to change how personas behave.

## 📊 Database Schema

The system uses these main tables:
- `profiles` - User profile information
- `personas` - Custom AI personas
- `conversations` - Chat history and messages

All tables have Row Level Security enabled for data protection.

## 🔐 Security Features

- Row Level Security (RLS) on all tables
- User-specific data isolation
- Secure API key handling
- Protected routes and authentication

## 🎯 Next Steps

After setup:
1. Test authentication by creating an account
2. Try chatting with default personas
3. Create your first custom persona
4. Explore the dashboard features

Your PersonaPal app is now ready to use! 🎉