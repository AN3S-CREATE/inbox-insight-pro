import React, { useState } from 'react';
import { Mail, Copy, CheckCircle, ArrowRight, Smartphone, Monitor, Settings, Zap, Play, AlertTriangle, Shield, Cpu } from 'lucide-react';

export const EmailSetupGuide: React.FC = () => {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  
  const dedicatedEmail = 'inbox-d8mw6jhncs3hcgvu@taskade.email';

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const emailClients = [
    {
      name: 'GMAIL',
      icon: '📧',
      color: 'red',
      steps: [
        'Open Gmail and go to Settings (gear icon) → "See all settings"',
        'Click on "Forwarding and POP/IMAP" tab',
        'Click "Add a forwarding address" and enter your dedicated email',
        'Choose "Forward a copy of incoming mail to" and select your address',
        'Save changes - all new emails will be automatically processed!'
      ]
    },
    {
      name: 'OUTLOOK',
      icon: '📮',
      color: 'blue',
      steps: [
        'Open Outlook and go to File → Account Settings → Account Settings',
        'Select your email account and click "Change"',
        'Click "More Settings" → "Advanced" tab',
        'Check "Leave a copy of messages on server"',
        'Set up a rule: Home → Rules → Create Rule → Forward to your dedicated email'
      ]
    },
    {
      name: 'APPLE MAIL',
      icon: '📬',
      color: 'gray',
      steps: [
        'Open Mail app and go to Mail → Preferences',
        'Click "Rules" tab and then "Add Rule"',
        'Set condition: "Every Message"',
        'Set action: "Forward Message" to your dedicated email address',
        'Click "OK" to save - all emails will now be forwarded automatically'
      ]
    }
  ];

  const mobileSetup = [
    {
      platform: 'IPHONE/IPAD',
      icon: '📱',
      steps: [
        'Open Settings → Mail → Accounts',
        'Select your email account',
        'Tap "Advanced" → "Forwarding"',
        'Enter your dedicated email address',
        'Enable "Forward" and save settings'
      ]
    },
    {
      platform: 'ANDROID',
      icon: '📲',
      steps: [
        'Open Gmail app → Menu (3 lines) → Settings',
        'Select your account → "Forwarding"',
        'Add your dedicated email address',
        'Choose forwarding options and save',
        'All emails will be processed automatically'
      ]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="relative mx-auto mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center glow-yellow">
            <Zap className="w-10 h-10 text-black" />
          </div>
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full animate-pulse"></div>
        </div>
        <h1 className="industrial-title text-4xl mb-4">EMAIL AUTOMATION SETUP</h1>
        <p className="industrial-text text-lg max-w-3xl mx-auto">
          Configure automated email processing for instant AI analysis, categorization, and strategic insights. 
          Deploy enterprise-grade email intelligence in minutes.
        </p>
      </div>

      {/* Your Dedicated Email */}
      <div className="industrial-card p-8 glow-green holographic">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-12 h-12 bg-green-400 rounded-lg flex items-center justify-center">
            <Mail className="w-6 h-6 text-black" />
          </div>
          <h2 className="industrial-title text-2xl">DEDICATED PROCESSING ENDPOINT</h2>
        </div>
        
        <div className="industrial-card p-6 bg-black/50 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="industrial-subtitle text-sm mb-3">FORWARD EMAILS TO THIS ADDRESS FOR AUTOMATIC PROCESSING:</p>
              <div className="flex items-center space-x-4">
                <code className="industrial-title text-xl bg-gray-900 px-4 py-3 rounded border-2 border-green-400">
                  {dedicatedEmail}
                </code>
                <button
                  onClick={() => copyToClipboard(dedicatedEmail)}
                  className={copiedEmail ? 'industrial-button' : 'industrial-button-secondary'}
                >
                  {copiedEmail ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      <span>COPIED!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      <span>COPY EMAIL</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="industrial-card p-6 bg-gradient-to-r from-green-900/30 to-blue-900/30">
          <div className="flex items-center space-x-3 mb-4">
            <Cpu className="w-6 h-6 text-green-400" />
            <h3 className="industrial-subtitle text-lg">AUTOMATED PROCESSING CAPABILITIES:</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="industrial-text"><strong>COMPANY DETECTION:</strong> From domains & signatures</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <span className="industrial-text"><strong>DEPT CLASSIFICATION:</strong> AI keyword analysis</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
              <span className="industrial-text"><strong>URGENCY ASSESSMENT:</strong> Content-based priority</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span className="industrial-text"><strong>SMART SUMMARIES:</strong> 2-4 line executive summaries</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span className="industrial-text"><strong>RECOMMENDATIONS:</strong> Strategic insights & next steps</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-400 rounded-full"></div>
              <span className="industrial-text"><strong>DUPLICATE PREVENTION:</strong> Intelligent merging</span>
            </div>
          </div>
        </div>
      </div>

      {/* Setup Process Steps */}
      <div className="industrial-card p-8">
        <h2 className="industrial-title text-2xl mb-8">3-STAGE DEPLOYMENT PROCESS</h2>
        
        <div className="flex items-center justify-between mb-12">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`w-16 h-16 rounded-xl flex items-center justify-center font-bold text-xl ${
                activeStep >= step 
                  ? 'bg-gradient-to-br from-green-400 to-green-600 text-black glow-green' 
                  : 'bg-gray-700 text-gray-400 border-2 border-gray-600'
              }`}>
                {step}
              </div>
              {step < 3 && (
                <div className="flex-1 mx-8">
                  <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
                    <div className={`h-full bg-green-400 transition-all duration-500 ${
                      activeStep > step ? 'w-full' : 'w-0'
                    }`}></div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-900 rounded-xl flex items-center justify-center mx-auto mb-4 border-2 border-blue-400">
              <Settings className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="industrial-subtitle text-lg mb-3">1. SELECT CLIENT</h3>
            <p className="industrial-text">Choose your email provider below for specific deployment instructions</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-900 rounded-xl flex items-center justify-center mx-auto mb-4 border-2 border-yellow-400">
              <ArrowRight className="w-8 h-8 text-yellow-400" />
            </div>
            <h3 className="industrial-subtitle text-lg mb-3">2. CONFIGURE FORWARDING</h3>
            <p className="industrial-text">Execute step-by-step configuration for your email system</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-green-900 rounded-xl flex items-center justify-center mx-auto mb-4 border-2 border-green-400">
              <Play className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="industrial-subtitle text-lg mb-3">3. ACTIVATE PROCESSING</h3>
            <p className="industrial-text">Emails are automatically analyzed and integrated into dashboard</p>
          </div>
        </div>
      </div>

      {/* Desktop Email Clients */}
      <div className="industrial-card p-8">
        <div className="flex items-center space-x-3 mb-8">
          <Monitor className="w-6 h-6 text-green-400" />
          <h2 className="industrial-title text-2xl">DESKTOP CLIENT CONFIGURATION</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {emailClients.map((client, index) => (
            <div key={index} className="industrial-card p-6 bg-gradient-to-br from-gray-900/50 to-gray-800/50">
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-3xl">{client.icon}</span>
                <h3 className="industrial-subtitle text-xl">{client.name}</h3>
              </div>
              
              <ol className="space-y-4">
                {client.steps.map((step, idx) => (
                  <li key={idx} className="flex items-start space-x-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-green-400 text-black rounded-lg flex items-center justify-center text-sm font-bold">
                      {idx + 1}
                    </span>
                    <span className="industrial-text text-sm leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Setup */}
      <div className="industrial-card p-8">
        <div className="flex items-center space-x-3 mb-8">
          <Smartphone className="w-6 h-6 text-yellow-400" />
          <h2 className="industrial-title text-2xl">MOBILE DEVICE CONFIGURATION</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {mobileSetup.map((mobile, index) => (
            <div key={index} className="industrial-card p-6 bg-gradient-to-br from-yellow-900/30 to-orange-900/30">
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-3xl">{mobile.icon}</span>
                <h3 className="industrial-subtitle text-xl">{mobile.platform}</h3>
              </div>
              
              <ol className="space-y-4">
                {mobile.steps.map((step, idx) => (
                  <li key={idx} className="flex items-start space-x-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-yellow-400 text-black rounded-lg flex items-center justify-center text-sm font-bold">
                      {idx + 1}
                    </span>
                    <span className="industrial-text text-sm leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </div>

      {/* Advanced Options */}
      <div className="industrial-card p-8 holographic">
        <h2 className="industrial-title text-2xl mb-8">ADVANCED PROCESSING CONFIGURATION</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="industrial-subtitle text-lg mb-6">📧 SELECTIVE FORWARDING PROTOCOLS</h3>
            <div className="space-y-4">
              <div className="industrial-card p-4 bg-blue-900/30">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                  <strong className="industrial-subtitle">SENDER FILTERING:</strong>
                </div>
                <p className="industrial-text text-sm">Only forward emails from specific companies or domains</p>
              </div>
              <div className="industrial-card p-4 bg-green-900/30">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <strong className="industrial-subtitle">KEYWORD FILTERING:</strong>
                </div>
                <p className="industrial-text text-sm">Forward emails containing keywords like "urgent", "meeting", "contract"</p>
              </div>
              <div className="industrial-card p-4 bg-orange-900/30">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
                  <strong className="industrial-subtitle">PRIORITY FILTERING:</strong>
                </div>
                <p className="industrial-text text-sm">Only forward high-priority or flagged emails</p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="industrial-subtitle text-lg mb-6">🔄 PROCESSING WORKFLOW</h3>
            <div className="space-y-4">
              <div className="industrial-card p-4 bg-purple-900/30">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                  <strong className="industrial-subtitle">INSTANT ANALYSIS:</strong>
                </div>
                <p className="industrial-text text-sm">Emails processed within seconds of forwarding</p>
              </div>
              <div className="industrial-card p-4 bg-red-900/30">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <strong className="industrial-subtitle">SMART DEDUPLICATION:</strong>
                </div>
                <p className="industrial-text text-sm">Prevents duplicate entries from email threads</p>
              </div>
              <div className="industrial-card p-4 bg-yellow-900/30">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <strong className="industrial-subtitle">REAL-TIME DASHBOARD:</strong>
                </div>
                <p className="industrial-text text-sm">Items appear immediately in your inbox analyzer</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testing & Verification */}
      <div className="industrial-card p-8">
        <div className="flex items-center space-x-3 mb-6">
          <Shield className="w-6 h-6 text-green-400" />
          <h2 className="industrial-title text-2xl">SYSTEM VERIFICATION PROTOCOL</h2>
        </div>
        
        <div className="industrial-card p-6 bg-green-900/30 mb-6">
          <h3 className="industrial-subtitle text-lg mb-4">QUICK VERIFICATION SEQUENCE:</h3>
          <ol className="space-y-3">
            <li className="flex items-start space-x-3">
              <span className="flex-shrink-0 w-8 h-8 bg-green-400 text-black rounded-lg flex items-center justify-center text-sm font-bold">1</span>
              <span className="industrial-text"><strong>SEND TEST EMAIL</strong> to {dedicatedEmail}</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="flex-shrink-0 w-8 h-8 bg-green-400 text-black rounded-lg flex items-center justify-center text-sm font-bold">2</span>
              <span className="industrial-text"><strong>INCLUDE SAMPLE CONTENT</strong> like "Meeting with TechCorp about Q4 budget review - urgent priority"</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="flex-shrink-0 w-8 h-8 bg-green-400 text-black rounded-lg flex items-center justify-center text-sm font-bold">3</span>
              <span className="industrial-text"><strong>CHECK DASHBOARD</strong> within 30 seconds - item should appear automatically</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="flex-shrink-0 w-8 h-8 bg-green-400 text-black rounded-lg flex items-center justify-center text-sm font-bold">4</span>
              <span className="industrial-text"><strong>VERIFY AI ANALYSIS</strong> - company, department, and urgency should be detected correctly</span>
            </li>
          </ol>
        </div>

        <div className="industrial-card p-6 bg-yellow-900/30">
          <div className="flex items-center space-x-3 mb-4">
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
            <h4 className="industrial-subtitle">TROUBLESHOOTING PROTOCOLS:</h4>
          </div>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start space-x-2">
              <span className="text-yellow-400">•</span>
              <span className="industrial-text"><strong>EMAILS NOT APPEARING?</strong> Verify forwarding rules are active and configured correctly</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-yellow-400">•</span>
              <span className="industrial-text"><strong>MISSING COMPANY DETECTION?</strong> Ensure sender email has a business domain</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-yellow-400">•</span>
              <span className="industrial-text"><strong>WRONG DEPARTMENT CLASSIFICATION?</strong> Include relevant keywords in email content</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-yellow-400">•</span>
              <span className="industrial-text"><strong>PROCESSING DELAYS?</strong> Large emails may take up to 2 minutes to process</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Success Message */}
      <div className="text-center industrial-card p-12 glow-green holographic">
        <div className="w-20 h-20 bg-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-black" />
        </div>
        <h2 className="industrial-title text-3xl mb-4">SYSTEM DEPLOYMENT COMPLETE! 🎉</h2>
        <p className="industrial-text text-lg mb-6 max-w-3xl mx-auto">
          Your email forwarding system is now operational. Every forwarded email will be automatically processed with 
          advanced AI analysis, intelligent categorization, and strategic insights generation.
        </p>
        <div className="flex items-center justify-center space-x-8 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="industrial-subtitle">INSTANT PROCESSING</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
            <span className="industrial-subtitle">AI ANALYSIS</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-orange-400 rounded-full animate-pulse"></div>
            <span className="industrial-subtitle">REAL-TIME DASHBOARD</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
            <span className="industrial-subtitle">SMART SEARCH</span>
          </div>
        </div>
      </div>
    </div>
  );
};