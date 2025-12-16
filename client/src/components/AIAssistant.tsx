import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  MessageSquare,
  Send,
  Bot,
  User,
  Lightbulb,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { chatAPI } from '../services/api';
import { ChatMessage } from '../types';

// Simple ID generator
const generateId = () => Math.random().toString(36).substring(2, 15);

interface AIAssistantProps {
  context?: any;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ context }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchSuggestions = useCallback(async () => {
    try {
      const response = await chatAPI.getSuggestions(context);
      setSuggestions(response.data.suggestions);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([
        "Is this Critical CVE actually critical for us?",
        "We have 50 'high severity' alerts - where do we start?",
        "What's the risk of releasing with these vulnerabilities?",
        "Can you explain CVE-2024-XXXX in simple terms?"
      ]);
    }
  }, [context]);

  useEffect(() => {
    fetchSuggestions();
    // Add welcome message
    const welcomeMessage: ChatMessage = {
      id: generateId(),
      role: 'assistant',
      content: `👋 Hello! I'm RSI, your Release Security Intelligence assistant. I'm here to help you understand, prioritize, and fix security vulnerabilities.

Ask me anything like:
• "Is this Critical CVE actually critical for us?"
• "Where should we start with 50 high severity alerts?"
• "Explain CVE-2024-XXXX in simple terms"
• "What's the risk of releasing with these vulnerabilities?"

How can I help you today?`,
      timestamp: new Date().toISOString()
    };
    setMessages([welcomeMessage]);
  }, [fetchSuggestions]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async (messageText?: string) => {
    const text = messageText || input;
    if (!text.trim()) return;

    const userMessage: ChatMessage = {
      id: generateId(),
      role: 'user',
      content: text,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await chatAPI.sendMessage(text, context);
      
      const assistantMessage: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: response.data.response,
        timestamp: response.data.timestamp
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: 'I apologize, but I encountered an error processing your request. Please try again or check your connection to the AI service.',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion);
  };

  const clearChat = () => {
    const welcomeMessage: ChatMessage = {
      id: generateId(),
      role: 'assistant',
      content: 'Chat cleared. How can I help you with your security concerns?',
      timestamp: new Date().toISOString()
    };
    setMessages([welcomeMessage]);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] fade-in">
      {/* Header */}
      <div className="bg-white rounded-xl border border-dc-gray-200 p-6 mb-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-dc-gray-900 flex items-center gap-2">
              <MessageSquare className="w-7 h-7 text-dc-blue-500" />
              RSI AI Assistant
            </h2>
            <p className="text-dc-gray-500 mt-1">
              Ask questions in plain English about your security vulnerabilities
            </p>
          </div>
          <button
            onClick={clearChat}
            className="px-4 py-2 text-dc-gray-500 hover:text-dc-blue-500 transition-colors flex items-center gap-2 hover:bg-dc-gray-50 rounded-lg"
          >
            <RefreshCw className="w-4 h-4" />
            Clear Chat
          </button>
        </div>
      </div>

      {/* Suggestions */}
      {messages.length <= 1 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 text-dc-gray-500 text-sm mb-2">
            <Lightbulb className="w-4 h-4 text-dc-blue-500" />
            Suggested questions
          </div>
          <div className="flex flex-wrap gap-2">
            {suggestions.slice(0, 4).map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="bg-white hover:bg-dc-blue-50 text-dc-gray-700 px-4 py-2 rounded-lg text-sm transition-colors border border-dc-gray-200 hover:border-dc-blue-300 shadow-sm"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-white rounded-xl p-4 border border-dc-gray-200 shadow-sm">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start gap-3 ${
                message.role === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.role === 'assistant'
                    ? 'bg-dc-blue-500'
                    : 'bg-dc-gray-600'
                }`}
              >
                {message.role === 'assistant' ? (
                  <Bot className="w-5 h-5 text-white" />
                ) : (
                  <User className="w-5 h-5 text-white" />
                )}
              </div>
              <div
                className={`max-w-[80%] rounded-xl p-4 ${
                  message.role === 'assistant'
                    ? 'bg-dc-gray-50 text-dc-gray-800 border border-dc-gray-200'
                    : 'bg-dc-blue-500 text-white'
                }`}
              >
                <div className="whitespace-pre-wrap">{message.content}</div>
                <div
                  className={`text-xs mt-2 ${
                    message.role === 'assistant' ? 'text-dc-gray-400' : 'text-dc-blue-100'
                  }`}
                >
                  {new Date(message.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-dc-blue-500 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white animate-pulse" />
              </div>
              <div className="bg-dc-gray-50 rounded-xl p-4 border border-dc-gray-200">
                <div className="flex items-center gap-2 text-dc-gray-500">
                  <div className="animate-bounce text-dc-blue-500">●</div>
                  <div className="animate-bounce text-dc-blue-500" style={{ animationDelay: '0.1s' }}>●</div>
                  <div className="animate-bounce text-dc-blue-500" style={{ animationDelay: '0.2s' }}>●</div>
                  <span className="ml-2">RSI is thinking...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="mt-4 flex gap-3">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask about vulnerabilities, priorities, or security concerns..."
          className="flex-1 bg-white border border-dc-gray-300 rounded-xl px-4 py-3 text-dc-gray-800 placeholder-dc-gray-400 focus:outline-none focus:border-dc-blue-500 focus:ring-2 focus:ring-dc-blue-100 resize-none shadow-sm"
          rows={1}
          disabled={loading}
        />
        <button
          onClick={() => sendMessage()}
          disabled={loading || !input.trim()}
          className="px-6 py-3 bg-dc-blue-500 hover:bg-dc-blue-600 text-white rounded-xl font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>

      {/* Quick Actions */}
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={() => sendMessage("What are our top 3 priority fixes right now?")}
          className="text-xs bg-white hover:bg-dc-blue-50 text-dc-gray-600 px-3 py-1.5 rounded-full transition-colors border border-dc-gray-200 hover:border-dc-blue-300"
        >
          Top 3 priorities
        </button>
        <button
          onClick={() => sendMessage("Give me an executive summary of our security posture")}
          className="text-xs bg-white hover:bg-dc-blue-50 text-dc-gray-600 px-3 py-1.5 rounded-full transition-colors border border-dc-gray-200 hover:border-dc-blue-300"
        >
          Executive summary
        </button>
        <button
          onClick={() => sendMessage("What quick wins can we tackle today?")}
          className="text-xs bg-white hover:bg-dc-blue-50 text-dc-gray-600 px-3 py-1.5 rounded-full transition-colors border border-dc-gray-200 hover:border-dc-blue-300"
        >
          Quick wins
        </button>
        <button
          onClick={() => sendMessage("Explain our security debt trend in simple terms")}
          className="text-xs bg-white hover:bg-dc-blue-50 text-dc-gray-600 px-3 py-1.5 rounded-full transition-colors border border-dc-gray-200 hover:border-dc-blue-300"
        >
          Explain debt trend
        </button>
        <button
          onClick={() => sendMessage("Should we proceed with this release?")}
          className="text-xs bg-white hover:bg-dc-blue-50 text-dc-gray-600 px-3 py-1.5 rounded-full transition-colors border border-dc-gray-200 hover:border-dc-blue-300"
        >
          Release decision
        </button>
      </div>
    </div>
  );
};

export default AIAssistant;
