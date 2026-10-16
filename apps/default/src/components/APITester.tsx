import React, { useState } from 'react';
import { Send, Copy, Download, Code, Database, MessageSquare } from 'lucide-react';

const APITester: React.FC = () => {
  const [activeEndpoint, setActiveEndpoint] = useState('query');
  const [requestBody, setRequestBody] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const endpoints = [
    {
      id: 'query',
      name: 'AI Query Handler',
      method: 'POST',
      url: '/api/taskade/webhooks/01K3TCV5AJZCQCSR9ZA77CRR8T/run',
      description: 'Test natural language queries about documents',
      icon: MessageSquare,
      sampleBody: JSON.stringify({
        query: "Show me all high priority documents from this week",
        context: "Executive review meeting preparation"
      }, null, 2)
    },
    {
      id: 'inbox',
      name: 'Inbox Item Analyzer',
      method: 'POST',
      url: '/api/taskade/webhooks/01K38JDHRFTA1TTKEJF8Z5XCPW/run',
      description: 'Process and analyze incoming documents',
      icon: Database,
      sampleBody: JSON.stringify({
        sender: "test@company.com",
        company: "Test Corporation",
        content: "Urgent security review needed for Q1 compliance audit. Please prioritize this request.",
        itemType: "email",
        recipient: "security@ourcompany.com",
        personalNote: "High priority security item"
      }, null, 2)
    },
    {
      id: 'documents-get',
      name: 'Get Documents',
      method: 'GET',
      url: '/api/taskade/projects/vBHifQr37pvTLnuU/nodes',
      description: 'Retrieve all documents from the database',
      icon: Database,
      sampleBody: ''
    },
    {
      id: 'documents-create',
      name: 'Create Document',
      method: 'POST',
      url: '/api/taskade/projects/vBHifQr37pvTLnuU/nodes',
      description: 'Create a new document in the system',
      icon: Database,
      sampleBody: JSON.stringify({
        "/text": "API Test Document",
        "/attributes/@title1": "Test Document via API",
        "/attributes/@type1": "document",
        "/attributes/@sender1": "api-test@system.com",
        "/attributes/@category1": "it",
        "/attributes/@urgency1": "medium",
        "/attributes/@status1": "processed",
        "/attributes/@summary1": "This is a test document created via the API to verify functionality",
        "/attributes/@date1": new Date().toISOString()
      }, null, 2)
    }
  ];

  const currentEndpoint = endpoints.find(e => e.id === activeEndpoint);

  React.useEffect(() => {
    if (currentEndpoint) {
      setRequestBody(currentEndpoint.sampleBody);
    }
  }, [activeEndpoint, currentEndpoint]);

  const sendRequest = async () => {
    if (!currentEndpoint) return;
    
    setIsLoading(true);
    setResponse('');
    
    try {
      const options: RequestInit = {
        method: currentEndpoint.method,
        headers: {
          'Content-Type': 'application/json',
        }
      };
      
      if (currentEndpoint.method !== 'GET' && requestBody.trim()) {
        options.body = requestBody;
      }
      
      const res = await fetch(currentEndpoint.url, options);
      const data = await res.json();
      
      const responseData = {
        status: res.status,
        statusText: res.statusText,
        headers: Object.fromEntries(res.headers.entries()),
        body: data
      };
      
      setResponse(JSON.stringify(responseData, null, 2));
    } catch (error) {
      setResponse(JSON.stringify({
        error: 'Request failed',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      }, null, 2));
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const downloadResponse = () => {
    if (!response) return;
    
    const blob = new Blob([response], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `api-response-${activeEndpoint}-${Date.now()}.json`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-green-400 glow-text matrix-text">API TESTER</h2>
          <p className="text-green-600 mt-2 matrix-text">Test DocuFlow AI endpoints interactively</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Endpoint Selection */}
        <div className="cyber-card rounded-xl neon-border">
          <div className="p-6 border-b border-green-500/30">
            <h3 className="text-lg font-semibold text-green-400 matrix-text glow-text">AVAILABLE ENDPOINTS</h3>
          </div>
          
          <div className="p-6">
            <div className="space-y-3">
              {endpoints.map((endpoint) => {
                const Icon = endpoint.icon;
                return (
                  <button
                    key={endpoint.id}
                    onClick={() => setActiveEndpoint(endpoint.id)}
                    className={`w-full text-left p-4 rounded-lg border transition-all matrix-text ${
                      activeEndpoint === endpoint.id
                        ? 'border-green-500 bg-green-500/20 glow-box'
                        : 'border-green-500/30 hover:border-green-500/50 hover:bg-green-500/10'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <Icon className={`w-5 h-5 mt-0.5 ${
                        activeEndpoint === endpoint.id ? 'text-green-400 pulse-glow' : 'text-green-600'
                      }`} />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className={`font-medium ${
                            activeEndpoint === endpoint.id ? 'text-green-300' : 'text-green-400'
                          }`}>
                            {endpoint.name}
                          </h4>
                          <span className={`px-2 py-0.5 rounded text-xs font-medium border ${
                            endpoint.method === 'GET' 
                              ? 'bg-green-500/20 text-green-400 border-green-500/50'
                              : 'bg-green-500/20 text-green-400 border-green-500/50'
                          }`}>
                            {endpoint.method}
                          </span>
                        </div>
                        <p className={`text-sm ${
                          activeEndpoint === endpoint.id ? 'text-green-500' : 'text-green-600'
                        }`}>
                          {endpoint.description}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Request Panel */}
        <div className="cyber-card rounded-xl neon-border">
          <div className="p-6 border-b border-green-500/30">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-green-400 matrix-text glow-text">REQUEST</h3>
              <button
                onClick={() => copyToClipboard(requestBody)}
                className="flex items-center space-x-1 px-3 py-1 text-sm text-green-400 hover:text-green-300 hover:bg-green-500/10 rounded-lg transition-colors border border-green-500/30 glow-box matrix-text"
              >
                <Copy className="w-4 h-4" />
                <span>COPY</span>
              </button>
            </div>
          </div>
          
          <div className="p-6">
            {currentEndpoint && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-green-400 mb-2 matrix-text">
                    ENDPOINT URL
                  </label>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium border matrix-text ${
                      currentEndpoint.method === 'GET' 
                        ? 'bg-green-500/20 text-green-400 border-green-500/50'
                        : 'bg-green-500/20 text-green-400 border-green-500/50'
                    }`}>
                      {currentEndpoint.method}
                    </span>
                    <code className="flex-1 px-3 py-2 bg-black/50 border border-green-500/30 rounded-lg text-sm font-mono text-green-300 glow-box">
                      {currentEndpoint.url}
                    </code>
                  </div>
                </div>
                
                {currentEndpoint.method !== 'GET' && (
                  <div>
                    <label className="block text-sm font-medium text-green-400 mb-2 matrix-text">
                      REQUEST BODY (JSON)
                    </label>
                    <textarea
                      value={requestBody}
                      onChange={(e) => setRequestBody(e.target.value)}
                      className="w-full h-64 px-3 py-2 bg-black border border-green-500/50 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 font-mono text-sm text-green-300 placeholder-green-600 glow-box matrix-text"
                      placeholder="Enter JSON request body..."
                    />
                  </div>
                )}
                
                <button
                  onClick={sendRequest}
                  disabled={isLoading}
                  className={`w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all matrix-text ${
                    isLoading
                      ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700'
                      : 'bg-gradient-to-r from-green-500 to-green-600 text-black hover:from-green-400 hover:to-green-500 shadow-lg shadow-green-500/50 glow-box pulse-glow'
                  }`}
                >
                  <Send className="w-5 h-5" />
                  <span>{isLoading ? 'SENDING...' : 'SEND REQUEST'}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Response Panel */}
        <div className="cyber-card rounded-xl neon-border">
          <div className="p-6 border-b border-green-500/30">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-green-400 matrix-text glow-text">RESPONSE</h3>
              {response && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => copyToClipboard(response)}
                    className="flex items-center space-x-1 px-3 py-1 text-sm text-green-400 hover:text-green-300 hover:bg-green-500/10 rounded-lg transition-colors border border-green-500/30 glow-box matrix-text"
                  >
                    <Copy className="w-4 h-4" />
                    <span>COPY</span>
                  </button>
                  <button
                    onClick={downloadResponse}
                    className="flex items-center space-x-1 px-3 py-1 text-sm text-green-400 hover:text-green-300 hover:bg-green-500/10 rounded-lg transition-colors border border-green-500/30 glow-box matrix-text"
                  >
                    <Download className="w-4 h-4" />
                    <span>DOWNLOAD</span>
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <div className="p-6">
            {response ? (
              <div className="space-y-4">
                <pre className="w-full h-64 px-3 py-2 bg-black/50 border border-green-500/30 rounded-lg overflow-auto text-sm font-mono text-green-300 glow-box matrix-text">
                  {response}
                </pre>
              </div>
            ) : (
              <div className="text-center py-12">
                <Code className="w-12 h-12 text-green-600 mx-auto mb-4 pulse-glow" />
                <p className="text-green-500 matrix-text">RESPONSE WILL APPEAR HERE AFTER SENDING A REQUEST</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Test Examples */}
      <div className="cyber-card rounded-xl p-6 border border-green-500/30">
        <h4 className="font-semibold text-green-400 mb-4 matrix-text glow-text">QUICK TEST EXAMPLES</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h5 className="font-medium text-green-300 matrix-text">AI QUERY TESTS</h5>
            <div className="space-y-1 text-sm text-green-500 matrix-text">
              <p>• "Show me all documents from Microsoft"</p>
              <p>• "What are the high priority items?"</p>
              <p>• "Summarize the security audit findings"</p>
            </div>
          </div>
          <div className="space-y-2">
            <h5 className="font-medium text-green-300 matrix-text">DOCUMENT PROCESSING</h5>
            <div className="space-y-1 text-sm text-green-500 matrix-text">
              <p>• Test email processing with attachments</p>
              <p>• Verify document categorization</p>
              <p>• Check metadata extraction accuracy</p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .glow-text {
          text-shadow: 0 0 10px #00ff00, 0 0 20px #00ff00, 0 0 30px #00ff00;
        }
        
        .glow-box {
          box-shadow: 
            0 0 10px rgba(0, 255, 0, 0.3),
            0 0 20px rgba(0, 255, 0, 0.2),
            inset 0 0 10px rgba(0, 255, 0, 0.1);
        }
        
        .neon-border {
          border: 1px solid #00ff00;
          box-shadow: 
            0 0 5px #00ff00,
            inset 0 0 5px rgba(0, 255, 0, 0.1);
        }
        
        .cyber-card {
          background: linear-gradient(135deg, rgba(0, 0, 0, 0.9) 0%, rgba(0, 50, 0, 0.3) 100%);
          border: 1px solid rgba(0, 255, 0, 0.3);
          box-shadow: 
            0 4px 15px rgba(0, 255, 0, 0.1),
            inset 0 1px 0 rgba(0, 255, 0, 0.2);
        }
        
        .pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite alternate;
        }
        
        @keyframes pulse-glow {
          from {
            box-shadow: 0 0 5px rgba(0, 255, 0, 0.3);
          }
          to {
            box-shadow: 0 0 20px rgba(0, 255, 0, 0.6), 0 0 30px rgba(0, 255, 0, 0.4);
          }
        }
        
        .matrix-text {
          font-family: 'Courier New', monospace;
          letter-spacing: 0.1em;
        }
      `}</style>
    </div>
  );
};

export default APITester;