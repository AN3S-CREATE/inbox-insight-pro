import React, { useState } from 'react';
import { Cloud, FolderOpen, FileText, Image, Mic, CheckCircle, AlertCircle, Settings, Sync, Upload } from 'lucide-react';

export const GoogleDriveIntegration: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');

  const handleConnect = async () => {
    setIsConnecting(true);
    // Simulate connection process
    setTimeout(() => {
      setIsConnected(true);
      setIsConnecting(false);
      setSyncStatus('success');
    }, 2000);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setSyncStatus('idle');
  };

  const supportedFileTypes = [
    {
      icon: FileText,
      type: 'Documents',
      formats: '.doc, .docx, .pdf, .txt',
      description: 'Word documents, PDFs, and text files',
      color: 'blue'
    },
    {
      icon: Image,
      type: 'Images',
      formats: '.jpg, .png, .gif, .bmp',
      description: 'Screenshots, photos, and scanned documents',
      color: 'green'
    },
    {
      icon: Mic,
      type: 'Audio',
      formats: '.mp3, .wav, .m4a',
      description: 'Voice recordings and audio notes',
      color: 'purple'
    },
    {
      icon: FolderOpen,
      type: 'Spreadsheets',
      formats: '.xls, .xlsx, .csv',
      description: 'Excel files and data sheets',
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
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg">
            <Cloud className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Google Drive Integration</h3>
            <p className="text-sm text-gray-600">Automatically sync and organize your documents and notes</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {isConnected && (
            <div className="flex items-center space-x-1 bg-green-100 px-3 py-1 rounded-full">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-700 font-medium">Connected</span>
            </div>
          )}
          
          {!isConnected ? (
            <button
              onClick={handleConnect}
              disabled={isConnecting}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {isConnecting ? (
                <>
                  <Sync className="w-4 h-4 animate-spin" />
                  <span>Connecting...</span>
                </>
              ) : (
                <>
                  <Cloud className="w-4 h-4" />
                  <span>Connect Drive</span>
                </>
              )}
            </button>
          ) : (
            <button
              onClick={handleDisconnect}
              className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <Settings className="w-4 h-4" />
              <span>Manage</span>
            </button>
          )}
        </div>
      </div>

      {!isConnected ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Cloud className="w-8 h-8 text-blue-600" />
          </div>
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Connect Your Google Drive</h4>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Automatically import and organize documents, images, and audio files from your Google Drive. 
            AI will analyze and categorize everything for you.
          </p>
          
          <div className="bg-blue-50 rounded-lg p-4 mb-6 max-w-lg mx-auto">
            <h5 className="font-medium text-blue-900 mb-2">What happens when you connect:</h5>
            <ul className="text-sm text-blue-800 space-y-1 text-left">
              <li>• Create a dedicated "Executive Inbox" folder in your Drive</li>
              <li>• Automatically sync new files added to this folder</li>
              <li>• AI analyzes content and extracts key information</li>
              <li>• Files are categorized by department and urgency</li>
              <li>• Generate summaries and recommendations for each item</li>
            </ul>
          </div>
        </div>
      ) : (
        <div>
          {/* Connection Status */}
          <div className="bg-green-50 rounded-lg p-4 mb-6 border border-green-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <h4 className="font-medium text-green-900">Google Drive Connected</h4>
                  <p className="text-sm text-green-700">Syncing with folder: /Executive Inbox</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-green-700">Last sync: 2 minutes ago</p>
                <p className="text-xs text-green-600">24 files processed today</p>
              </div>
            </div>
          </div>

          {/* Sync Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h5 className="font-medium text-gray-900 mb-3 flex items-center space-x-2">
                <Settings className="w-4 h-4" />
                <span>Sync Settings</span>
              </h5>
              <div className="space-y-3">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" defaultChecked className="rounded border-gray-300" />
                  <span className="text-sm text-gray-700">Auto-sync new files</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" defaultChecked className="rounded border-gray-300" />
                  <span className="text-sm text-gray-700">Process images with OCR</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" defaultChecked className="rounded border-gray-300" />
                  <span className="text-sm text-gray-700">Transcribe audio files</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded border-gray-300" />
                  <span className="text-sm text-gray-700">Delete processed files</span>
                </label>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h5 className="font-medium text-gray-900 mb-3 flex items-center space-x-2">
                <Upload className="w-4 h-4" />
                <span>Quick Actions</span>
              </h5>
              <div className="space-y-2">
                <button className="w-full text-left px-3 py-2 bg-white rounded border border-gray-200 hover:bg-gray-50 text-sm">
                  Sync now
                </button>
                <button className="w-full text-left px-3 py-2 bg-white rounded border border-gray-200 hover:bg-gray-50 text-sm">
                  Open Drive folder
                </button>
                <button className="w-full text-left px-3 py-2 bg-white rounded border border-gray-200 hover:bg-gray-50 text-sm">
                  View sync history
                </button>
                <button className="w-full text-left px-3 py-2 bg-white rounded border border-gray-200 hover:bg-gray-50 text-sm text-red-600">
                  Disconnect Drive
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Supported File Types */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-900 mb-4">Supported File Types</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {supportedFileTypes.map((fileType, index) => {
            const Icon = fileType.icon;
            return (
              <div
                key={index}
                className={`border rounded-lg p-4 ${getColorClasses(fileType.color)}`}
              >
                <div className="flex items-center space-x-2 mb-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getIconColorClasses(fileType.color)}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <h5 className="font-medium">{fileType.type}</h5>
                </div>
                <p className="text-xs opacity-80 mb-1">{fileType.formats}</p>
                <p className="text-xs opacity-70">{fileType.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Usage Instructions */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
        <h4 className="font-semibold text-blue-900 mb-4">How to Use Google Drive Integration</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h5 className="font-medium text-blue-800 mb-2">📁 Folder Structure</h5>
            <div className="bg-white bg-opacity-50 rounded p-3 text-sm text-blue-700">
              <div className="font-mono">
                📁 Executive Inbox/<br/>
                &nbsp;&nbsp;📁 Documents/<br/>
                &nbsp;&nbsp;📁 Images/<br/>
                &nbsp;&nbsp;📁 Audio/<br/>
                &nbsp;&nbsp;📁 Processed/
              </div>
            </div>
          </div>
          
          <div>
            <h5 className="font-medium text-blue-800 mb-2">⚡ Processing Flow</h5>
            <ol className="text-sm text-blue-700 space-y-1">
              <li>1. Add files to Executive Inbox folder</li>
              <li>2. AI automatically detects and processes</li>
              <li>3. Content is analyzed and categorized</li>
              <li>4. Items appear in your dashboard</li>
              <li>5. Files moved to Processed folder</li>
            </ol>
          </div>
        </div>

        <div className="mt-4 p-3 bg-blue-100 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>💡 Pro Tip:</strong> Use Google Drive mobile app to quickly upload photos of meeting notes, 
            whiteboards, or documents. They'll be automatically processed and added to your executive inbox!
          </p>
        </div>
      </div>
    </div>
  );
};