import React, { useState } from 'react';
import { EmailIntegrationSetup } from './EmailIntegrationSetup';
import { GoogleDriveIntegration } from './GoogleDriveIntegration';
import { Settings, Mail, Cloud, Zap, ArrowRight, CheckCircle } from 'lucide-react';

export const IntegrationDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'email' | 'drive' | 'overview'>('overview');

  const integrationStats = [
    {
      title: 'Email Processing',
      value: '47',
      subtitle: 'emails processed today',
      icon: Mail,
      color: 'blue',
      status: 'active'
    },
    {
      title: 'Drive Sync',
      value: '12',
      subtitle: 'files synced this week',
      icon: Cloud,
      color: 'green',
      status: 'connected'
    },
    {
      title: 'Auto Analysis',
      value: '100%',
      subtitle: 'accuracy rate',
      icon: Zap,
      color: 'purple',
      status: 'optimal'
    }
  ];

  const workflowSteps = [
    {
      step: 1,
      title: 'Receive Content',
      description: 'Emails forwarded or files uploaded',
      icon: Mail,
      color: 'blue'
    },
    {
      step: 2,
      title: 'AI Analysis',
      description: 'Extract company, department, urgency',
      icon: Zap,
      color: 'purple'
    },
    {
      step: 3,
      title: 'Auto Categorize',
      description: 'Organize and generate insights',
      icon: Settings,
      color: 'green'
    },
    {
      step: 4,
      title: 'Dashboard Update',
      description: 'Items appear in your inbox',
      icon: CheckCircle,
      color: 'orange'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-50 border-blue-200 text-blue-800',
      green: 'bg-green-50 border-green-200 text-green-800',
      purple: 'bg-purple-50 border-purple-200 text-purple-800',
      orange: 'bg-orange-50 border-orange-200 text-orange-800'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getIconColorClasses = (color: string) => {
    const colors = {
      blue: 'text-blue-600 bg-blue-100',
      green: 'text-green-600 bg-green-100',
      purple: 'text-purple-600 bg-purple-100',
      orange: 'text-orange-600 bg-orange-100'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
            <Settings className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Integration Center</h2>
            <p className="text-gray-600">Automate your email and document processing</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md font-medium transition-colors ${
              activeTab === 'overview'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>Overview</span>
          </button>
          <button
            onClick={() => setActiveTab('email')}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md font-medium transition-colors ${
              activeTab === 'email'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Email Setup</span>
          </button>
          <button
            onClick={() => setActiveTab('drive')}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md font-medium transition-colors ${
              activeTab === 'drive'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Cloud className="w-4 h-4" />
            <span>Google Drive</span>
          </button>
        </div>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {integrationStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getIconColorClasses(stat.color)}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${getColorClasses(stat.color)}`}>
                      {stat.status}
                    </div>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-gray-600">{stat.subtitle}</p>
                    <h3 className="font-semibold text-gray-900 mt-1">{stat.title}</h3>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Workflow Visualization */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Automated Processing Workflow</h3>
            
            <div className="flex items-center justify-between">
              {workflowSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div key={index} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getIconColorClasses(step.color)} mb-3`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="text-center max-w-24">
                        <p className="font-semibold text-gray-900 text-sm">{step.title}</p>
                        <p className="text-xs text-gray-600 mt-1">{step.description}</p>
                      </div>
                    </div>
                    {index < workflowSteps.length - 1 && (
                      <ArrowRight className="w-6 h-6 text-gray-400 mx-4" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Setup */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">Quick Setup Guide</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white bg-opacity-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <h4 className="font-semibold text-blue-900">Email Integration</h4>
                </div>
                <p className="text-sm text-blue-800 mb-3">
                  Get a dedicated email address for automatic processing of emails and notes.
                </p>
                <button
                  onClick={() => setActiveTab('email')}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Set up email forwarding →
                </button>
              </div>

              <div className="bg-white bg-opacity-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Cloud className="w-5 h-5 text-green-600" />
                  <h4 className="font-semibold text-green-900">Google Drive Sync</h4>
                </div>
                <p className="text-sm text-green-800 mb-3">
                  Automatically sync and process documents, images, and audio files.
                </p>
                <button
                  onClick={() => setActiveTab('drive')}
                  className="text-sm text-green-600 hover:text-green-700 font-medium"
                >
                  Connect Google Drive →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'email' && <EmailIntegrationSetup />}
      {activeTab === 'drive' && <GoogleDriveIntegration />}
    </div>
  );
};