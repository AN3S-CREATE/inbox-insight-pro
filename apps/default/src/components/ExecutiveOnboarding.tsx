import React, { useState } from 'react';
import { CheckCircle, Circle, User, Mail, Brain, Settings, Zap, Clock, ArrowRight, X, Star, Target, Briefcase, Shield } from 'lucide-react';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  category: 'setup' | 'personalization' | 'integration' | 'usage';
  estimatedTime: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  actionText: string;
  detailedSteps: string[];
}

interface ExecutiveOnboardingProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPersonalization: () => void;
}

export const ExecutiveOnboarding: React.FC<ExecutiveOnboardingProps> = ({
  isOpen,
  onClose,
  onOpenPersonalization
}) => {
  const [steps, setSteps] = useState<OnboardingStep[]>([
    {
      id: 'welcome',
      title: 'Welcome to Your Executive AI Assistant',
      description: 'Get familiar with your personal knowledge management system',
      icon: Star,
      category: 'setup',
      estimatedTime: '2 min',
      priority: 'high',
      completed: false,
      actionText: 'Start Tour',
      detailedSteps: [
        'Click the floating AI assistant button (bottom-right corner)',
        'Try asking: "What can you help me with?"',
        'Explore the chat interface and example queries',
        'Notice the professional design tailored for executives'
      ]
    },
    {
      id: 'personalize',
      title: 'Personalize Your AI Assistant',
      description: 'Customize appearance, personality, and behavior to match your preferences',
      icon: User,
      category: 'personalization',
      estimatedTime: '3 min',
      priority: 'high',
      completed: false,
      actionText: 'Customize Now',
      detailedSteps: [
        'Open AI assistant and click the Settings (⚙️) icon',
        'Set your preferred assistant name',
        'Upload your profile picture or choose an avatar',
        'Select a color theme that matches your style',
        'Choose personality: Professional, Friendly, or Executive',
        'Adjust position and size preferences'
      ]
    },
    {
      id: 'email-setup',
      title: 'Set Up Email Integration',
      description: 'Configure automatic email processing for hands-free knowledge capture',
      icon: Mail,
      category: 'integration',
      estimatedTime: '5 min',
      priority: 'high',
      completed: false,
      actionText: 'Configure Email',
      detailedSteps: [
        'Navigate to the Setup tab in the main dashboard',
        'Copy your dedicated processing email address',
        'Set up email forwarding in your email client (Gmail, Outlook, etc.)',
        'Forward a test email to verify the integration works',
        'All forwarded emails will be automatically analyzed and categorized'
      ]
    },
    {
      id: 'first-documents',
      title: 'Add Your First Documents',
      description: 'Upload key documents, meeting notes, or strategic materials',
      icon: Briefcase,
      category: 'setup',
      estimatedTime: '5 min',
      priority: 'high',
      completed: false,
      actionText: 'Add Documents',
      detailedSteps: [
        'Click "ADD ITEM" button in the main dashboard',
        'Upload recent meeting notes or important emails',
        'Add personal notes about key decisions or strategies',
        'Try voice notes for quick capture of thoughts',
        'Watch as AI automatically categorizes and summarizes content'
      ]
    },
    {
      id: 'smart-search',
      title: 'Master Smart Search Capabilities',
      description: 'Learn to query your knowledge base with natural language',
      icon: Brain,
      category: 'usage',
      estimatedTime: '3 min',
      priority: 'medium',
      completed: false,
      actionText: 'Try Searching',
      detailedSteps: [
        'Open the AI assistant',
        'Try executive-focused queries like:',
        '  • "What urgent items need my attention?"',
        '  • "Show me all communications with [Company Name]"',
        '  • "What decisions did we make last week?"',
        '  • "Find budget-related discussions"',
        'Notice how AI provides context and recommendations'
      ]
    },
    {
      id: 'filters-organization',
      title: 'Use Advanced Filtering',
      description: 'Organize information by company, department, urgency, and date',
      icon: Target,
      category: 'usage',
      estimatedTime: '2 min',
      priority: 'medium',
      completed: false,
      actionText: 'Explore Filters',
      detailedSteps: [
        'Use the Smart Filters section in the dashboard',
        'Filter by specific companies you work with',
        'Sort by urgency to focus on high-priority items',
        'Filter by department (Finance, Marketing, Operations, etc.)',
        'Use date ranges to find recent or historical information'
      ]
    },
    {
      id: 'mobile-access',
      title: 'Set Up Mobile Access',
      description: 'Access your knowledge base on-the-go from any device',
      icon: Zap,
      category: 'integration',
      estimatedTime: '2 min',
      priority: 'medium',
      completed: false,
      actionText: 'Test Mobile',
      detailedSteps: [
        'Open the app on your mobile device',
        'Bookmark the URL for quick access',
        'Test the AI assistant on mobile',
        'Try voice input for hands-free operation',
        'Verify all features work seamlessly on mobile'
      ]
    },
    {
      id: 'security-privacy',
      title: 'Review Security & Privacy',
      description: 'Understand data protection and privacy controls',
      icon: Shield,
      category: 'setup',
      estimatedTime: '2 min',
      priority: 'low',
      completed: false,
      actionText: 'Review Settings',
      detailedSteps: [
        'All data is processed securely within your workspace',
        'No information is shared with other users',
        'Email processing happens automatically and privately',
        'You have complete control over what gets stored',
        'Data can be exported or deleted at any time'
      ]
    }
  ]);

  const [currentStep, setCurrentStep] = useState(0);
  const [showDetails, setShowDetails] = useState<string | null>(null);

  if (!isOpen) return null;

  const toggleStepCompletion = (stepId: string) => {
    setSteps(prev => prev.map(step => 
      step.id === stepId ? { ...step, completed: !step.completed } : step
    ));
  };

  const completedSteps = steps.filter(step => step.completed).length;
  const totalSteps = steps.length;
  const progressPercentage = (completedSteps / totalSteps) * 100;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'setup': return 'bg-blue-100 text-blue-800';
      case 'personalization': return 'bg-purple-100 text-purple-800';
      case 'integration': return 'bg-green-100 text-green-800';
      case 'usage': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStepAction = (step: OnboardingStep) => {
    if (step.id === 'personalize') {
      onOpenPersonalization();
    }
    toggleStepCompletion(step.id);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-xl">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Executive Onboarding</h2>
              <p className="text-sm opacity-90">Get started with your AI-powered knowledge system</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Overview */}
        <div className="p-6 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Setup Progress</h3>
              <p className="text-sm text-gray-600">Complete these steps to maximize your productivity</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">{completedSteps}/{totalSteps}</div>
              <div className="text-sm text-gray-600">Steps Completed</div>
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-white rounded-lg p-3 border">
              <div className="text-lg font-bold text-blue-600">
                {steps.filter(s => s.priority === 'high' && s.completed).length}/
                {steps.filter(s => s.priority === 'high').length}
              </div>
              <div className="text-xs text-gray-600">High Priority</div>
            </div>
            <div className="bg-white rounded-lg p-3 border">
              <div className="text-lg font-bold text-green-600">
                {Math.round(progressPercentage)}%
              </div>
              <div className="text-xs text-gray-600">Complete</div>
            </div>
            <div className="bg-white rounded-lg p-3 border">
              <div className="text-lg font-bold text-purple-600">
                {steps.reduce((acc, step) => acc + parseInt(step.estimatedTime), 0)} min
              </div>
              <div className="text-xs text-gray-600">Total Time</div>
            </div>
            <div className="bg-white rounded-lg p-3 border">
              <div className="text-lg font-bold text-orange-600">
                {steps.filter(s => !s.completed).length}
              </div>
              <div className="text-xs text-gray-600">Remaining</div>
            </div>
          </div>
        </div>

        {/* Steps List */}
        <div className="p-6">
          <div className="space-y-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isExpanded = showDetails === step.id;
              
              return (
                <div
                  key={step.id}
                  className={`border rounded-lg transition-all ${
                    step.completed 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="p-4">
                    <div className="flex items-start space-x-4">
                      <button
                        onClick={() => toggleStepCompletion(step.id)}
                        className="mt-1 flex-shrink-0"
                      >
                        {step.completed ? (
                          <CheckCircle className="w-6 h-6 text-green-600" />
                        ) : (
                          <Circle className="w-6 h-6 text-gray-400 hover:text-gray-600" />
                        )}
                      </button>

                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getCategoryColor(step.category)}`}>
                        <Icon className="w-5 h-5" />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className={`font-semibold ${step.completed ? 'text-green-800' : 'text-gray-900'}`}>
                              {step.title}
                            </h4>
                            <p className={`text-sm mt-1 ${step.completed ? 'text-green-700' : 'text-gray-600'}`}>
                              {step.description}
                            </p>
                          </div>
                          
                          <div className="flex items-center space-x-2 ml-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(step.priority)}`}>
                              {step.priority.toUpperCase()}
                            </span>
                            <div className="flex items-center space-x-1 text-xs text-gray-500">
                              <Clock className="w-3 h-3" />
                              <span>{step.estimatedTime}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3 mt-3">
                          <button
                            onClick={() => handleStepAction(step)}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                              step.completed
                                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                          >
                            <span>{step.completed ? 'Completed' : step.actionText}</span>
                            {!step.completed && <ArrowRight className="w-4 h-4" />}
                          </button>

                          <button
                            onClick={() => setShowDetails(isExpanded ? null : step.id)}
                            className="text-sm text-gray-600 hover:text-gray-800 underline"
                          >
                            {isExpanded ? 'Hide Details' : 'Show Details'}
                          </button>
                        </div>

                        {/* Detailed Steps */}
                        {isExpanded && (
                          <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
                            <h5 className="font-medium text-gray-900 mb-3">Step-by-Step Guide:</h5>
                            <ol className="space-y-2">
                              {step.detailedSteps.map((detailStep, idx) => (
                                <li key={idx} className="flex items-start space-x-2 text-sm text-gray-700">
                                  <span className="flex-shrink-0 w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">
                                    {idx + 1}
                                  </span>
                                  <span>{detailStep}</span>
                                </li>
                              ))}
                            </ol>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              💡 <strong>Pro Tip:</strong> Complete high-priority steps first for immediate productivity gains
            </div>
            <div className="flex items-center space-x-3">
              {progressPercentage === 100 && (
                <div className="flex items-center space-x-2 text-green-600">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Setup Complete!</span>
                </div>
              )}
              <button
                onClick={onClose}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                {progressPercentage === 100 ? 'Start Using' : 'Continue Later'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};