import React, { useState } from 'react';
import { Mail, Copy, CheckCircle, Settings, Forward, Cloud, FileText, Smartphone, Edit3, Save, X } from 'lucide-react';

export const EmailIntegrationSetup: React.FC = () => {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [customEmail, setCustomEmail] = useState('executive-inbox');
  const [emailDomain] = useState('@taskade.email');

  const dedicatedEmail = `${customEmail}${emailDomain}`;

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleSaveEmail = () => {
    setIsEditingEmail(false);
    // Here you would typically save to backend
    console.log('Saving custom email:', customEmail);
  };

  const integrationMethods = [
    {
      title: 'Personal Note System',
      description: 'Email notes to yourself for automatic organization',
      icon: Mail,
      color: 'blue',
      steps: [
        'Email yourself meeting notes, ideas, or reminders',
        'Subject line becomes the note title',
        'AI automatically categorizes and summarizes',
        'Duplicate detection prevents redundant entries'
      ]
    },
    {
      title: 'Email Forwarding',
      description: 'Forward important emails for centralized processing',
      icon: Forward,
      color: 'green',
      steps: [
        'Forward client emails, vendor communications',
        'AI extracts company and department information',
        'Duplicate emails are merged with latest version',
        'Maintains complete communication history'
      ]
    },
    {
      title: 'Voice Note Integration',
      description: 'Send voice recordings via email for transcription',
      icon: Smartphone,
      color: 'purple',
      steps: [
        'Record voice memos on any device',
        'Email audio files to your dedicated address',
        'AI transcribes and analyzes content',
        'Searchable text with original audio preserved'
      ]
    },
    {
      title: 'Knowledge Base Sync',
      description: 'Automatic deduplication and version control',
      icon: Cloud,
      color: 'orange',
      steps: [
        'Smart duplicate detection by content similarity',
        'Newer versions automatically replace older ones',
        'Maintains comprehensive knowledge database',
        'AI-powered search and recall capabilities'
      ]
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
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
          <Settings className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Personal Knowledge Base</h3>
          <p className="text-sm text-gray-600">Your centralized hub for notes, emails, and communications</p>
        </div>
      </div>

      {/* Customizable Email Address */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-6 border border-blue-200">
        <div className="flex items-center space-x-2 mb-3">
          <Mail className="w-5 h-5 text-blue-600" />
          <h4 className="font-semibold text-blue-900">Your Personal Inbox Email</h4>
        </div>
        
        <div className="bg-white rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-2">Send emails and notes to:</p>
              {isEditingEmail ? (
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                    placeholder="your-custom-name"
                  />
                  <span className="font-mono text-gray-600">{emailDomain}</span>
                  <button
                    onClick={handleSaveEmail}
                    className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                  >
                    <Save className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setIsEditingEmail(false)}
                    className="p-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <code className="text-lg font-mono text-blue-800 bg-blue-50 px-3 py-2 rounded border">
                    {dedicatedEmail}
                  </code>
                  <button
                    onClick={() => setIsEditingEmail(true)}
                    className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
            <button
              onClick={() => copyToClipboard(dedicatedEmail)}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors ml-4"
            >
              {copiedEmail ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
          
          <div className="text-sm text-gray-600">
            <p className="mb-1">💡 <strong>Pro Tips:</strong></p>
            <ul className="space-y-1 ml-4">
              <li>• Use a memorable name like "john-notes" or "executive-inbox"</li>
              <li>• Email yourself from any device or email client</li>
              <li>• Subject becomes the note title, body gets analyzed</li>
              <li>• Attach files, images, or audio for automatic processing</li>
            </ul>
          </div>
        </div>

        <div className="mt-4 p-4 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg border border-green-200">
          <div className="flex items-center space-x-2 mb-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <h5 className="font-semibold text-green-900">Smart Knowledge Base Features</h5>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-green-800">
            <div>• <strong>Duplicate Detection:</strong> Prevents redundant entries</div>
            <div>• <strong>Version Control:</strong> Keeps latest information</div>
            <div>• <strong>AI Search:</strong> Find notes by asking questions</div>
            <div>• <strong>Auto-Categorization:</strong> Smart organization</div>
          </div>
        </div>
      </div>

      {/* Integration Methods */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {integrationMethods.map((method, index) => {
          const Icon = method.icon;
          return (
            <div
              key={index}
              className={`border rounded-lg p-5 ${getColorClasses(method.color)}`}
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getIconColorClasses(method.color)}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold">{method.title}</h4>
                  <p className="text-sm opacity-80">{method.description}</p>
                </div>
              </div>
              
              <ol className="space-y-2">
                {method.steps.map((step, idx) => (
                  <li key={idx} className="text-sm flex items-start space-x-2">
                    <span className="flex-shrink-0 w-5 h-5 bg-white bg-opacity-50 rounded-full flex items-center justify-center text-xs font-medium">
                      {idx + 1}
                    </span>
                    <span className="opacity-90">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          );
        })}
      </div>

      {/* Usage Examples */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 border border-purple-200">
        <h4 className="font-semibold text-purple-900 mb-4 flex items-center space-x-2">
          <FileText className="w-4 h-4" />
          <span>Real-World Usage Examples</span>
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h5 className="font-medium text-purple-800 mb-3">📝 Personal Note-Taking</h5>
            <div className="space-y-2 text-sm text-purple-700">
              <div className="bg-white bg-opacity-50 rounded p-2">
                <strong>Email to:</strong> {dedicatedEmail}<br/>
                <strong>Subject:</strong> Meeting with TechCorp team<br/>
                <strong>Body:</strong> Discussed Q4 budget allocation...
              </div>
              <p className="text-xs">→ AI categorizes as Finance, extracts key points, creates searchable entry</p>
            </div>
          </div>
          
          <div>
            <h5 className="font-medium text-purple-800 mb-3">🎤 Voice Note Workflow</h5>
            <div className="space-y-2 text-sm text-purple-700">
              <div className="bg-white bg-opacity-50 rounded p-2">
                <strong>Action:</strong> Record voice memo on phone<br/>
                <strong>Email:</strong> Send audio file to your inbox<br/>
                <strong>Result:</strong> Transcribed and analyzed automatically
              </div>
              <p className="text-xs">→ Searchable text with original audio preserved for reference</p>
            </div>
          </div>
          
          <div>
            <h5 className="font-medium text-purple-800 mb-3">📧 Email Forwarding</h5>
            <div className="space-y-2 text-sm text-purple-700">
              <div className="bg-white bg-opacity-50 rounded p-2">
                <strong>Forward:</strong> Important client emails<br/>
                <strong>Auto-Process:</strong> Extract company, urgency<br/>
                <strong>Deduplicate:</strong> Merge with existing threads
              </div>
              <p className="text-xs">→ Maintains complete communication history without duplicates</p>
            </div>
          </div>
          
          <div>
            <h5 className="font-medium text-purple-800 mb-3">🔍 AI-Powered Recall</h5>
            <div className="space-y-2 text-sm text-purple-700">
              <div className="bg-white bg-opacity-50 rounded p-2">
                <strong>Ask:</strong> "What did I say about TechCorp last month?"<br/>
                <strong>Get:</strong> Relevant notes, emails, voice transcripts<br/>
                <strong>Context:</strong> Full conversation history and insights
              </div>
              <p className="text-xs">→ Instant access to your complete knowledge base</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};