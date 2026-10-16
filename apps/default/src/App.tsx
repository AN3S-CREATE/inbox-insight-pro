import React, { useState } from 'react';
import { Database, Settings, Brain, Plus, Search, Mail, FileText, Mic, Building2, Calendar, User, Lightbulb, BookOpen, Zap } from 'lucide-react';
import { AIProfileDisplay } from './components/AIProfilePictures';

function App() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'setup'>('dashboard');
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="min-h-screen bg-pattern-green">
      {/* Header */}
      <div className="header-green sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <AIProfileDisplay size="medium" showOnlineStatus={true} />
              <div>
                <h1 className="text-xl font-bold text-white">DocuFlow AI</h1>
                <p className="text-sm text-green-200">Executive Intelligence System</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {/* Email Andries Button */}
              <a
                href="mailto:create@an3s.info"
                className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm transition-all bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Mail className="w-4 h-4" />
                <span>EMAIL ANDRIES FOR ASSISTANCE</span>
              </a>

              {/* WhatsApp Andries Button */}
              <a
                href="https://wa.me/27729749703"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm transition-all bg-green-600 hover:bg-green-700 text-white"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
                <span>WHATSAPP ANDRIES</span>
              </a>

              <button
                onClick={() => setCurrentView('dashboard')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  currentView === 'dashboard'
                    ? 'btn-primary-green'
                    : 'btn-secondary-green bg-green-800 text-green-200 hover:bg-green-700'
                }`}
              >
                <Database className="w-4 h-4" />
                <span>Dashboard</span>
              </button>
              
              <button
                onClick={() => setCurrentView('setup')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  currentView === 'setup'
                    ? 'btn-primary-green'
                    : 'btn-secondary-green bg-green-800 text-green-200 hover:bg-green-700'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>Setup</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="bg-green-800/90 border-b border-green-400/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-10">
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full pulse-green"></div>
                <span className="text-green-200 font-medium">System Online</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="w-3 h-3 text-yellow-400" />
                <span className="text-green-200">AI Processing Ready</span>
              </div>
              <div className="flex items-center space-x-2">
                <AIProfileDisplay size="small" />
                <span className="text-green-200">AI Assistant Ready</span>
              </div>
            </div>
            
            <div className="hidden sm:flex items-center space-x-4 text-xs text-green-300">
              <span>Ready for Use</span>
              <span>|</span>
              <span>Secure Connection</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'dashboard' ? (
          <>
            {/* Welcome Section */}
            <div className="text-center mb-12">
              <div className="flex items-center justify-center mb-6">
                <AIProfileDisplay size="large" showOnlineStatus={true} />
              </div>
              <h1 className="text-5xl font-bold text-gradient-green mb-4">Welcome to DocuFlow AI</h1>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
                Your intelligent executive assistant for document analysis, email processing, and strategic insights. 
                Get started by adding your first document or setting up email automation.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button className="btn-primary-green flex items-center space-x-2 text-lg px-8 py-4">
                  <Plus className="w-5 h-5" />
                  <span>Add Your First Document</span>
                </button>
                <button 
                  onClick={() => setCurrentView('setup')}
                  className="btn-secondary-green flex items-center space-x-2 text-lg px-8 py-4"
                >
                  <Settings className="w-5 h-5" />
                  <span>Setup Email Automation</span>
                </button>
              </div>
            </div>

            {/* Features Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="card-green p-8 text-center glow-medium-green">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-green-800 mb-3">Email Processing</h3>
                <p className="text-gray-700 mb-4">
                  Automatically analyze and categorize emails. Extract company information, detect urgency, and generate summaries.
                </p>
                <div className="text-sm text-green-600 font-medium">Ready to Configure</div>
              </div>

              <div className="card-green p-8 text-center glow-medium-green">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AIProfileDisplay size="medium" />
                </div>
                <h3 className="text-xl font-bold text-green-800 mb-3">AI Analysis</h3>
                <p className="text-gray-700 mb-4">
                  Advanced AI provides intelligent insights, strategic recommendations, and contextual understanding of your documents.
                </p>
                <div className="text-sm text-green-600 font-medium">AI Engine Active</div>
              </div>

              <div className="card-green p-8 text-center glow-medium-green">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-green-800 mb-3">Smart Search</h3>
                <p className="text-gray-700 mb-4">
                  Natural language queries to find exactly what you need. Search by company, urgency, date, or any content.
                </p>
                <div className="text-sm text-green-600 font-medium">Search Ready</div>
              </div>
            </div>

            {/* Getting Started Guide */}
            <div className="card-dark-green p-8 mb-8 glow-dark-green">
              <div className="text-center mb-8">
                <div className="flex items-center justify-center mb-4">
                  <AIProfileDisplay size="large" showOnlineStatus={true} />
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">Meet Your AI Assistant</h2>
                <p className="text-green-200 text-lg">Your intelligent companion for document analysis and strategic insights</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-green p-6 rounded-lg text-center">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-lg">1</span>
                  </div>
                  <h3 className="text-lg font-semibold text-green-800 mb-2">Add Documents</h3>
                  <p className="text-sm text-green-700">Upload emails, notes, or documents to start building your knowledge base.</p>
                </div>
                
                <div className="glass-green p-6 rounded-lg text-center">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-lg">2</span>
                  </div>
                  <h3 className="text-lg font-semibold text-green-800 mb-2">Setup Automation</h3>
                  <p className="text-sm text-green-700">Configure email forwarding for automatic processing and analysis.</p>
                </div>
                
                <div className="glass-green p-6 rounded-lg text-center">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-lg">3</span>
                  </div>
                  <h3 className="text-lg font-semibold text-green-800 mb-2">Start Searching</h3>
                  <p className="text-sm text-green-700">Use natural language to find information and get AI-powered insights.</p>
                </div>
              </div>
            </div>

            {/* AI Assistant Showcase */}
            <div className="card-green p-8 mb-8 glow-medium-green">
              <div className="text-center">
                <div className="flex items-center justify-center mb-6">
                  <div className="relative">
                    <AIProfileDisplay size="large" showOnlineStatus={true} />
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                      <Zap className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-green-800 mb-4">AI-Powered Intelligence</h2>
                <p className="text-lg text-gray-700 mb-8 max-w-3xl mx-auto">
                  Your AI assistant is ready to help you analyze documents, extract insights, and provide strategic recommendations. 
                  Click the floating AI button to start a conversation.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                  <div className="glass-green p-6 rounded-lg">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                        <Search className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-green-800">Smart Search</h3>
                    </div>
                    <p className="text-sm text-green-700">Ask questions in natural language and get instant, relevant results from your knowledge base.</p>
                  </div>
                  
                  <div className="glass-green p-6 rounded-lg">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-green-800">Company Intelligence</h3>
                    </div>
                    <p className="text-sm text-green-700">Automatically detect and organize information by companies, departments, and priorities.</p>
                  </div>
                  
                  <div className="glass-green p-6 rounded-lg">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                        <Lightbulb className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-green-800">Strategic Insights</h3>
                    </div>
                    <p className="text-sm text-green-700">Get AI-generated summaries, recommendations, and actionable insights for every document.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Empty State */}
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No documents yet</h3>
              <p className="text-gray-600 mb-6">Add your first document or set up email automation to get started.</p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button className="btn-primary-green flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>Add Document</span>
                </button>
                <button 
                  onClick={() => setCurrentView('setup')}
                  className="btn-secondary-green flex items-center space-x-2"
                >
                  <Mail className="w-4 h-4" />
                  <span>Setup Email</span>
                </button>
              </div>
            </div>
          </>
        ) : (
          /* Setup View */
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <AIProfileDisplay size="large" showOnlineStatus={true} />
              </div>
              <h2 className="text-4xl font-bold text-gradient-green mb-4">Email Automation Setup</h2>
              <p className="text-gray-700 text-lg">Configure automated email processing for instant AI analysis</p>
            </div>

            <div className="card-green p-8 glow-medium-green mb-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 glow-light-green">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-green-800 mb-4">Your Dedicated Processing Email</h3>
                <div className="bg-green-50 border-2 border-green-300 rounded-lg p-6 mb-6">
                  <code className="text-xl font-mono text-green-800">
                    inbox-d8mw6jhncs3hcgvu@taskade.email
                  </code>
                </div>
                <p className="text-gray-700 text-lg mb-8">
                  Forward emails to this address for automatic AI processing and analysis. 
                  All emails sent here will be automatically categorized, summarized, and made searchable.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="glass-green rounded-lg p-6">
                    <Mail className="w-10 h-10 text-green-600 mx-auto mb-4" />
                    <h4 className="font-semibold text-green-800 mb-2">Auto Processing</h4>
                    <p className="text-sm text-green-700">Emails are automatically analyzed within seconds of arrival</p>
                  </div>
                  <div className="glass-green rounded-lg p-6">
                    <AIProfileDisplay size="medium" />
                    <h4 className="font-semibold text-green-800 mb-2 mt-4">Smart Analysis</h4>
                    <p className="text-sm text-green-700">AI detects company, department, urgency, and generates summaries</p>
                  </div>
                  <div className="glass-green rounded-lg p-6">
                    <Lightbulb className="w-10 h-10 text-yellow-500 mx-auto mb-4" />
                    <h4 className="font-semibold text-green-800 mb-2">Insights</h4>
                    <p className="text-sm text-green-700">Get strategic recommendations and action items</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Setup Instructions */}
            <div className="card-green p-8">
              <h3 className="text-xl font-bold text-green-800 mb-6">How to Set Up Email Forwarding</h3>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Gmail Setup</h4>
                    <p className="text-gray-700">Go to Gmail Settings → Forwarding and POP/IMAP → Add forwarding address → Enter the email above</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Outlook Setup</h4>
                    <p className="text-gray-700">Go to Outlook Settings → Mail → Forwarding → Enable forwarding → Enter the email above</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Test the Setup</h4>
                    <p className="text-gray-700">Send a test email to the processing address and check your dashboard for the analyzed result</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating AI Assistant Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="relative">
          <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105 flex items-center justify-center">
            <AIProfileDisplay size="medium" showOnlineStatus={true} />
          </div>
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center animate-pulse">
            <span className="text-white text-xs font-bold">AI</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;