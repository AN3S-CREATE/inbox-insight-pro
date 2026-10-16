import React from 'react';
import { Brain, Building2, Users, AlertTriangle, Sparkles, CheckCircle } from 'lucide-react';

export const AIDetectionShowcase: React.FC = () => {
  const detectionFeatures = [
    {
      icon: Building2,
      title: 'Company Detection',
      description: 'Automatically identifies companies from:',
      features: [
        'Email domains (@microsoft.com, @gs.com)',
        'Email signatures and letterheads',
        'Company names mentioned in content',
        'Corporate contact information'
      ],
      color: 'blue'
    },
    {
      icon: Users,
      title: 'Department Classification',
      description: 'Smart keyword analysis for departments:',
      features: [
        'Finance: budget, revenue, CFO, accounting',
        'Marketing: campaigns, SEO, leads, CMO',
        'IT: systems, security, infrastructure, CTO',
        'Operations: logistics, processes, COO'
      ],
      color: 'green'
    },
    {
      icon: AlertTriangle,
      title: 'Urgency Assessment',
      description: 'Context-aware urgency detection:',
      features: [
        'High: urgent, ASAP, critical, emergency',
        'Medium: important, priority, action needed',
        'Low: FYI, informational, when convenient',
        'Tone and language pattern analysis'
      ],
      color: 'amber'
    },
    {
      icon: Sparkles,
      title: 'Smart Insights',
      description: 'AI-generated analysis includes:',
      features: [
        'Executive summaries (2-4 lines)',
        'Strategic recommendations',
        'Key stakeholder identification',
        'Action items and next steps'
      ],
      color: 'purple'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-50 border-blue-200 text-blue-800',
      green: 'bg-green-50 border-green-200 text-green-800',
      amber: 'bg-amber-50 border-amber-200 text-amber-800',
      purple: 'bg-purple-50 border-purple-200 text-purple-800'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getIconColorClasses = (color: string) => {
    const colors = {
      blue: 'text-blue-600 bg-blue-100',
      green: 'text-green-600 bg-green-100',
      amber: 'text-amber-600 bg-amber-100',
      purple: 'text-purple-600 bg-purple-100'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200 p-6 mb-6">
      <div className="flex items-center space-x-3 mb-4">
        <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
          <Brain className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">AI-Powered Detection Engine</h3>
          <p className="text-sm text-gray-600">Automatically analyzes and categorizes your business communications</p>
        </div>
        <div className="flex items-center space-x-1 bg-green-100 px-2 py-1 rounded-full ml-auto">
          <CheckCircle className="w-3 h-3 text-green-600" />
          <span className="text-xs text-green-700 font-medium">Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {detectionFeatures.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div
              key={index}
              className={`border rounded-lg p-4 ${getColorClasses(feature.color)}`}
            >
              <div className="flex items-center space-x-2 mb-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getIconColorClasses(feature.color)}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <h4 className="font-semibold text-sm">{feature.title}</h4>
              </div>
              
              <p className="text-xs mb-2 opacity-90">{feature.description}</p>
              
              <ul className="space-y-1">
                {feature.features.map((item, idx) => (
                  <li key={idx} className="text-xs flex items-start space-x-1">
                    <span className="text-current opacity-60">•</span>
                    <span className="opacity-80">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      <div className="mt-4 p-3 bg-white bg-opacity-50 rounded-lg">
        <p className="text-xs text-gray-700">
          <strong>How it works:</strong> When you add new items, our AI analyzes the content in real-time to extract company information, 
          classify departments using advanced keyword detection, assess urgency levels, and generate actionable insights—all automatically.
        </p>
      </div>
    </div>
  );
};