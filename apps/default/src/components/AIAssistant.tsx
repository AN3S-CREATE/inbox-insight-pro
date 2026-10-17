import React, { useState, useRef, useEffect } from 'react';
import { Send, Brain, Loader2, Sparkles, Mic, MicOff, Settings, Bot, Zap, Heart, Star, Coffee, Lightbulb } from 'lucide-react';
import { InboxItem } from '../types/inbox';
import { AIPersonalizationModal } from './AIPersonalizationModal';
import { askInboxAssistant } from '../services/api';

interface AIAssistantProps {
  items: InboxItem[];
}

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  relatedItems?: InboxItem[];
  queryType?: 'company' | 'department' | 'urgency' | 'date' | 'general';
}

type AssistantQueryType = NonNullable<ChatMessage['queryType']>;

interface QueryFilters {
  company?: string;
  department?: string;
  urgency?: InboxItem['urgency'];
  itemType?: InboxItem['itemType'];
  dateRange?: 'today' | 'yesterday' | 'week' | 'month';
}

interface AssistantSearchResult {
  items: InboxItem[];
  assistantItems: InboxItem[];
  queryInfo: {
    type: AssistantQueryType;
    filters: QueryFilters;
    searchTerms: string[];
    totalFound: number;
  };
}

interface PersonalizationSettings {
  name: string;
  avatar: string;
  theme: 'green-teal' | 'orange-red' | 'dark' | 'minimal';
  personality: 'professional' | 'friendly' | 'casual' | 'enthusiastic' | 'zen';
  greetingMessage: string;
  responseStyle: 'detailed' | 'concise' | 'bullet-points' | 'conversational';
  voiceEnabled: boolean;
  animationsEnabled: boolean;
  position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  size: 'small' | 'medium' | 'large';
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ items }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showPersonalization, setShowPersonalization] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Default personalization settings
  const [settings, setSettings] = useState<PersonalizationSettings>({
    name: 'AI Knowledge Assistant',
    avatar: 'brain',
    theme: 'green-teal',
    personality: 'friendly',
    greetingMessage: "👋 Hi! I'm your AI Knowledge Assistant. I have access to your complete knowledge base and can help you find information instantly.\n\n**Try asking me:**\n• \"What did I say about Microsoft last week?\"\n• \"Show me urgent finance items\"\n• \"Find all marketing meetings from this month\"\n• \"What notes do I have about TechCorp?\"\n• \"Show me voice notes from yesterday\"\n\nI can search by company, department, urgency, date ranges, and content. What would you like to know?",
    responseStyle: 'conversational',
    voiceEnabled: true,
    animationsEnabled: true,
    position: 'bottom-right',
    size: 'medium'
  });

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'assistant',
      content: settings.greetingMessage,
      timestamp: new Date(),
      queryType: 'general'
    }
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Update greeting message when settings change
  useEffect(() => {
    setMessages(prev => prev.map((msg, index) => 
      index === 0 && msg.type === 'assistant' 
        ? { ...msg, content: settings.greetingMessage }
        : msg
    ));
  }, [settings.greetingMessage]);

  const demoQueries = [
    "What did I say about Microsoft last week?",
    "Show me urgent finance items",
    "Find all marketing-related notes",
    "What meetings did I have with TechCorp?",
    "Show me voice notes from this month",
    "Find budget discussions",
    "What urgent items need attention?",
    "Show me all IT security notes"
  ];

  const getThemeClasses = () => {
    switch (settings.theme) {
      case 'green-teal':
        return 'from-green-500 to-teal-500';
      case 'orange-red':
        return 'from-orange-500 to-red-500';
      case 'dark':
        return 'from-gray-800 to-gray-900';
      case 'minimal':
        return 'from-gray-100 to-gray-200';
      default:
        return 'from-green-500 to-teal-500';
    }
  };

  const getPositionClasses = () => {
    switch (settings.position) {
      case 'bottom-left':
        return 'bottom-6 left-6';
      case 'top-right':
        return 'top-6 right-6';
      case 'top-left':
        return 'top-6 left-6';
      default:
        return 'bottom-6 right-6';
    }
  };

  const getSizeClasses = () => {
    switch (settings.size) {
      case 'small':
        return 'w-12 h-12';
      case 'large':
        return 'w-16 h-16';
      default:
        return 'w-14 h-14';
    }
  };

  const getAvatarIcon = () => {
    const iconMap = {
      brain: Brain,
      bot: Bot,
      sparkles: Sparkles,
      zap: Zap,
      heart: Heart,
      star: Star,
      coffee: Coffee,
      lightbulb: Lightbulb
    };
    return iconMap[settings.avatar as keyof typeof iconMap] || Brain;
  };

  const parseQuery = (query: string): { type: AssistantQueryType; filters: QueryFilters; searchTerms: string[] } => {
    const queryLower = query.toLowerCase();
    const filters: QueryFilters = {};
    let queryType: AssistantQueryType = 'general';
    
    // Extract search terms
    const searchTerms = queryLower.split(' ').filter(term => 
      term.length > 2 && 
      !['what', 'did', 'say', 'about', 'show', 'find', 'all', 'from', 'with', 'the', 'and', 'for'].includes(term)
    );

    // Company detection
    const companies = ['microsoft', 'techcorp', 'google', 'apple', 'amazon', 'salesforce', 'goldman', 'sachs'];
    const foundCompany = companies.find(company => queryLower.includes(company));
    if (foundCompany) {
      queryType = 'company';
      filters.company = foundCompany;
    }

    // Department detection
    const departments = ['finance', 'marketing', 'operations', 'hr', 'it', 'sales', 'legal', 'executive'];
    const foundDepartment = departments.find(dept => queryLower.includes(dept));
    if (foundDepartment) {
      queryType = 'department';
      filters.department = foundDepartment;
    }

    // Urgency detection
    if (queryLower.includes('urgent') || queryLower.includes('priority') || queryLower.includes('critical')) {
      queryType = 'urgency';
      filters.urgency = 'high';
    }

    // Date range detection
    if (queryLower.includes('today')) {
      filters.dateRange = 'today';
      queryType = 'date';
    } else if (queryLower.includes('yesterday')) {
      filters.dateRange = 'yesterday';
      queryType = 'date';
    } else if (queryLower.includes('this week') || queryLower.includes('last week')) {
      filters.dateRange = 'week';
      queryType = 'date';
    } else if (queryLower.includes('this month') || queryLower.includes('last month')) {
      filters.dateRange = 'month';
      queryType = 'date';
    }

    // Item type detection
    if (queryLower.includes('voice') || queryLower.includes('audio')) {
      filters.itemType = 'voice';
    } else if (queryLower.includes('email')) {
      filters.itemType = 'email';
    } else if (queryLower.includes('note') || queryLower.includes('written')) {
      filters.itemType = 'written';
    }

    return { type: queryType, filters, searchTerms };
  };

  const searchItems = (query: string): AssistantSearchResult => {
    const { type, filters, searchTerms } = parseQuery(query);
    let filteredItems = [...items];

    // Apply company filter
    if (filters.company) {
      const company = filters.company;
      filteredItems = filteredItems.filter(item => 
        item.companyLabel.toLowerCase().includes(company) ||
        item.company.toLowerCase().includes(company)
      );
    }

    // Apply department filter
    if (filters.department) {
      const department = filters.department;
      filteredItems = filteredItems.filter(item => 
        item.department === department ||
        item.departmentLabel.toLowerCase().includes(department)
      );
    }

    // Apply urgency filter
    if (filters.urgency) {
      filteredItems = filteredItems.filter(item => item.urgency === filters.urgency);
    }

    // Apply item type filter
    if (filters.itemType) {
      filteredItems = filteredItems.filter(item => item.itemType === filters.itemType);
    }

    // Apply date range filter
    if (filters.dateRange) {
      const now = new Date();
      const filterDate = new Date();
      
      switch (filters.dateRange) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          filteredItems = filteredItems.filter(item => new Date(item.dateTime) >= filterDate);
          break;
        case 'yesterday':
          const yesterday = new Date();
          yesterday.setDate(now.getDate() - 1);
          yesterday.setHours(0, 0, 0, 0);
          const endYesterday = new Date(yesterday);
          endYesterday.setHours(23, 59, 59, 999);
          filteredItems = filteredItems.filter(item => {
            const itemDate = new Date(item.dateTime);
            return itemDate >= yesterday && itemDate <= endYesterday;
          });
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          filteredItems = filteredItems.filter(item => new Date(item.dateTime) >= filterDate);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          filteredItems = filteredItems.filter(item => new Date(item.dateTime) >= filterDate);
          break;
      }
    }

    // Apply text search
    if (searchTerms.length > 0) {
      filteredItems = filteredItems.filter(item => {
        const searchableText = `
          ${item.title} ${item.content} ${item.summary} ${item.recommendation} 
          ${item.companyLabel} ${item.departmentLabel} ${item.sender} ${item.recipient}
          ${item.personalNote}
        `.toLowerCase();
        
        return searchTerms.some(term => searchableText.includes(term));
      });
    }

    // Sort by relevance and date
    filteredItems.sort((a, b) => {
      // Prioritize high urgency items
      if (a.urgency === 'high' && b.urgency !== 'high') return -1;
      if (b.urgency === 'high' && a.urgency !== 'high') return 1;
      
      // Then by date (newest first)
      return new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime();
    });

    return { 
      items: filteredItems.slice(0, 8), // Limit to top 8 results
      assistantItems: filteredItems.slice(0, 20),
      queryInfo: { type, filters, searchTerms, totalFound: filteredItems.length }
    };
  };

  const generateResponse = (query: string, searchResult: AssistantSearchResult): string => {
    const { items: relatedItems, queryInfo } = searchResult;
    const { type, filters, totalFound } = queryInfo;
    
    // Apply personality to response
    let personalityPrefix = '';
    switch (settings.personality) {
      case 'professional':
        personalityPrefix = 'I have analyzed your request and ';
        break;
      case 'friendly':
        personalityPrefix = 'Hi there! I ';
        break;
      case 'casual':
        personalityPrefix = 'Hey! So I ';
        break;
      case 'enthusiastic':
        personalityPrefix = 'Awesome question! I ';
        break;
      case 'zen':
        personalityPrefix = 'Let me mindfully search... I ';
        break;
    }
    
    if (relatedItems.length === 0) {
      let suggestion = personalityPrefix + "couldn't find any items matching your query. ";
      
      if (filters.company) {
        suggestion += `Try searching for "${filters.company}" without date restrictions, or check if the company name is spelled correctly.`;
      } else if (filters.department) {
        suggestion += `Try searching for "${filters.department}" items from a different time period.`;
      } else {
        suggestion += "Try rephrasing your question or using different keywords.";
      }
      
      return suggestion;
    }

    let response = personalityPrefix + `found ${totalFound} item${totalFound > 1 ? 's' : ''} matching your query`;
    
    // Add context about the search
    if (filters.company) response += ` about **${filters.company}**`;
    if (filters.department) response += ` in **${filters.department}**`;
    if (filters.urgency) response += ` marked as **urgent**`;
    if (filters.dateRange) response += ` from **${filters.dateRange}**`;
    
    response += `:\n\n`;

    // Show top results based on response style
    relatedItems.forEach((item, index) => {
      const date = new Date(item.dateTime).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: new Date(item.dateTime).getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
      });
      
      if (settings.responseStyle === 'bullet-points') {
        response += `• **${item.title}** (${date})\n`;
        response += `  📅 ${item.companyLabel} • ${item.departmentLabel} • ${item.urgencyLabel}\n`;
        if (item.summary) {
          response += `  💡 ${item.summary}\n`;
        }
      } else {
        response += `**${index + 1}. ${item.title}**\n`;
        response += `📅 ${date} • 🏢 ${item.companyLabel} • 📂 ${item.departmentLabel} • ${item.urgencyLabel}\n`;
        
        if (item.personalNote) {
          response += `📝 *Personal note: ${item.personalNote}*\n`;
        }
        
        if (settings.responseStyle !== 'concise') {
          response += `💡 ${item.summary}\n`;
          
          if (item.recommendation && index < 3) {
            response += `🎯 **Recommendation:** ${item.recommendation}\n`;
          }
        }
      }
      response += '\n';
    });

    if (totalFound > relatedItems.length) {
      response += `📋 *Showing top ${relatedItems.length} of ${totalFound} results. Ask for more specific details if needed.*`;
    }

    return response;
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const currentQuery = inputValue;
    setInputValue('');
    setIsLoading(true);

    const searchResult = searchItems(currentQuery);
    try {
      const matchesFound = searchResult.queryInfo.totalFound > 0;
      const contextItems = matchesFound ? searchResult.assistantItems : items.slice(0, 20);
      const contextTotal = matchesFound ? searchResult.queryInfo.totalFound : items.length;
      const response = await askInboxAssistant(currentQuery, contextItems, {
        matchingCount: searchResult.queryInfo.totalFound,
        contextTotal,
        matchesFound
      });
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response,
        timestamp: new Date(),
        relatedItems: searchResult.items,
        queryType: searchResult.queryInfo.type
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: error instanceof Error ? error.message : 'The local AI request failed.',
        timestamp: new Date(),
        relatedItems: searchResult.items,
        queryType: 'general'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestedQuery = (query: string) => {
    setInputValue(query);
  };

  const toggleVoiceInput = () => {
    if (settings.voiceEnabled) {
      setIsListening(!isListening);
    }
  };

  const formatMessageContent = (content: string) => {
    return content.split('\n').map((line, index) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return <div key={index} className="font-semibold text-gray-900 mt-2 mb-1">{line.slice(2, -2)}</div>;
      }
      if (line.includes('📅') || line.includes('🏢') || line.includes('📂')) {
        return <div key={index} className="text-xs text-gray-600 mb-1 ml-2">{line}</div>;
      }
      if (line.includes('📝') && line.includes('*Personal note:')) {
        return <div key={index} className="text-xs text-blue-700 bg-blue-50 rounded px-2 py-1 mb-1 ml-2 italic">{line}</div>;
      }
      if (line.includes('💡')) {
        return <div key={index} className="text-sm text-gray-700 mb-2 ml-2">{line}</div>;
      }
      if (line.includes('🎯 **Recommendation:**')) {
        return <div key={index} className="text-sm text-green-700 bg-green-50 rounded p-2 mb-2 ml-2">{line}</div>;
      }
      if (line.startsWith('•')) {
        return <div key={index} className="ml-4 text-gray-700 text-sm">{line}</div>;
      }
      return <div key={index} className="text-gray-700 text-sm">{line}</div>;
    });
  };

  const renderAvatar = (size: string = 'w-8 h-8') => {
    const Icon = getAvatarIcon();
    return <Icon className={`${size} text-white`} />;
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed ${getPositionClasses()} ${getSizeClasses()} bg-gradient-to-r ${getThemeClasses()} hover:shadow-xl text-white rounded-full shadow-lg transition-all duration-200 flex items-center justify-center z-40 group ${settings.animationsEnabled ? 'hover:scale-105' : ''}`}
      >
        {renderAvatar()}
        <Brain className="w-6 h-6 hidden" />
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
          <Sparkles className="w-3 h-3 text-white" />
        </div>
      </button>

      {/* Chat Interface */}
      {isOpen && (
        <div className={`fixed ${getPositionClasses()} w-96 h-[700px] bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col z-50 ${settings.animationsEnabled ? 'animate-fadeInScale' : ''}`}>
          {/* Header */}
          <div className={`flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r ${getThemeClasses()} text-white rounded-t-xl`}>
            <div className="flex items-center space-x-3">
              {renderAvatar()}
              <Brain className="w-5 h-5 hidden" />
              <div className="text-center">
                <h3 className="font-semibold">{settings.name}</h3>
                <div className="mt-1 text-xs font-bold opacity-90">LOCAL OLLAMA MODEL</div>
                <p className="text-xs opacity-90 mt-1">{items.length} items in knowledge base</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowPersonalization(true)}
                className="p-1.5 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                title="Personalize Assistant"
              >
                <Settings className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-gray-200 transition-colors text-xl"
              >
                ×
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-lg p-3 ${
                    message.type === 'user'
                      ? `bg-gradient-to-r ${getThemeClasses()} text-white`
                      : 'bg-gray-50 text-gray-900 border border-gray-200'
                  }`}
                >
                  <div className="text-sm">
                    {message.type === 'assistant' ? formatMessageContent(message.content) : message.content}
                  </div>
                  <div className={`text-xs mt-2 ${message.type === 'user' ? 'opacity-75' : 'text-gray-500'}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin text-green-600" />
                    <span className="text-sm text-gray-600">Searching knowledge base...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Demo Queries */}
          {messages.length <= 2 && (
            <div className="px-4 pb-2">
              <p className="text-xs text-gray-500 mb-2">💡 Try these example queries:</p>
              <div className="grid grid-cols-1 gap-1">
                {demoQueries.slice(0, 4).map((query, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestedQuery(query)}
                    className={`text-xs bg-gradient-to-r from-green-50 to-teal-50 hover:from-green-100 hover:to-teal-100 text-gray-700 px-3 py-2 rounded-lg transition-colors text-left border border-green-200 ${settings.animationsEnabled ? 'hover:scale-[1.02]' : ''}`}
                  >
                    {query}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="flex-1 relative">
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me about your notes, emails, or meetings..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none text-sm"
                  rows={2}
                />
              </div>
              <div className="flex flex-col space-y-1">
                {settings.voiceEnabled && (
                  <button
                    onClick={toggleVoiceInput}
                    className={`p-2 rounded-lg transition-colors ${
                      isListening
                        ? 'bg-red-100 text-red-600 hover:bg-red-200'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>
                )}
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  className={`p-2 bg-gradient-to-r ${getThemeClasses()} text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Personalization Modal */}
      <AIPersonalizationModal
        isOpen={showPersonalization}
        onClose={() => setShowPersonalization(false)}
        settings={settings}
        onSave={setSettings}
      />
    </>
  );
};