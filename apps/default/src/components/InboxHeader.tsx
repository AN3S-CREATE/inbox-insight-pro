import React from 'react';
import { Plus, Download, Database, TrendingUp, Settings, Zap, Upload, FileText, Mic, Mail } from 'lucide-react';

interface InboxHeaderProps {
  totalItems: number;
  filteredItems: number;
  onAddItem: () => void;
  onExport: () => void;
  onIntegration: () => void;
}

export const InboxHeader: React.FC<InboxHeaderProps> = ({
  totalItems,
  filteredItems,
  onAddItem,
  onExport,
  onIntegration
}) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-xl glow-green">
              <Database className="w-8 h-8 text-black" />
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-pulse"></div>
          </div>
          <div>
            <h1 className="industrial-title text-4xl">EXECUTIVE INBOX ANALYZER</h1>
            <p className="industrial-text text-lg mt-1">Intelligent organization and analysis of business communications</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={onIntegration}
            className="industrial-button-secondary flex items-center space-x-2"
          >
            <Zap className="w-4 h-4" />
            <span>AUTOMATE</span>
          </button>
          
          <button
            onClick={onAddItem}
            className="industrial-button flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>ADD ITEM</span>
          </button>
          
          <button
            onClick={onExport}
            className="bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white px-6 py-3 rounded-lg font-bold text-sm transition-all duration-300 border border-gray-600 flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>EXPORT</span>
          </button>
        </div>
      </div>

      {/* Upload Methods Showcase */}
      <div className="industrial-card p-6 mb-6 glow-green">
        <div className="flex items-center space-x-3 mb-4">
          <Upload className="w-6 h-6 text-green-400" />
          <h3 className="industrial-title text-xl">MULTIPLE INPUT METHODS</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="industrial-card p-4 bg-gradient-to-br from-blue-900/50 to-blue-800/50">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-blue-400 rounded-lg flex items-center justify-center">
                <Mail className="w-5 h-5 text-black" />
              </div>
              <h4 className="industrial-subtitle">EMAIL PROCESSING</h4>
            </div>
            <p className="industrial-text text-sm mb-3">Forward emails to your dedicated address for instant AI analysis</p>
            <div className="text-xs industrial-text">
              <strong>Address:</strong> inbox-d8mw6jhncs3hcgvu@taskade.email
            </div>
          </div>
          
          <div className="industrial-card p-4 bg-gradient-to-br from-green-900/50 to-green-800/50">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-green-400 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-black" />
              </div>
              <h4 className="industrial-subtitle">MANUAL UPLOAD</h4>
            </div>
            <p className="industrial-text text-sm mb-3">Click "ADD ITEM" to manually upload documents and notes</p>
            <button
              onClick={onAddItem}
              className="text-xs bg-green-400 text-black px-3 py-1 rounded font-bold hover:bg-green-300 transition-colors"
            >
              UPLOAD NOW
            </button>
          </div>
          
          <div className="industrial-card p-4 bg-gradient-to-br from-orange-900/50 to-orange-800/50">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-orange-400 rounded-lg flex items-center justify-center">
                <Mic className="w-5 h-5 text-black" />
              </div>
              <h4 className="industrial-subtitle">VOICE NOTES</h4>
            </div>
            <p className="industrial-text text-sm mb-3">Record voice memos and email them for automatic transcription</p>
            <div className="text-xs industrial-text">
              <strong>Method:</strong> Email audio files to processing address
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="industrial-card p-6 glow-green">
          <div className="flex items-center justify-between">
            <div>
              <p className="industrial-subtitle text-sm">TOTAL ITEMS</p>
              <p className="industrial-title text-3xl mt-1">{totalItems}</p>
            </div>
            <div className="w-12 h-12 bg-green-400 rounded-lg flex items-center justify-center">
              <Database className="w-6 h-6 text-black" />
            </div>
          </div>
          <div className="mt-4 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-green-400 rounded-full" style={{ width: '85%' }}></div>
          </div>
        </div>

        <div className="industrial-card p-6 glow-yellow">
          <div className="flex items-center justify-between">
            <div>
              <p className="industrial-subtitle text-sm">FILTERED RESULTS</p>
              <p className="industrial-title text-3xl mt-1">{filteredItems}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-400 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-black" />
            </div>
          </div>
          <div className="mt-4 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${totalItems > 0 ? (filteredItems / totalItems) * 100 : 0}%` }}></div>
          </div>
        </div>

        <div className="industrial-card p-6 glow-orange">
          <div className="flex items-center justify-between">
            <div>
              <p className="industrial-subtitle text-sm">PROCESSING RATE</p>
              <p className="industrial-title text-3xl mt-1">
                {totalItems > 0 ? Math.round((filteredItems / totalItems) * 100) : 0}%
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-400 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-black" />
            </div>
          </div>
          <div className="mt-4 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-orange-400 rounded-full" style={{ width: '92%' }}></div>
          </div>
        </div>
      </div>

      {/* Quick Integration Notice */}
      <div className="industrial-card p-4 holographic">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-black" />
            </div>
            <div>
              <h4 className="industrial-subtitle">AUTOMATE YOUR WORKFLOW</h4>
              <p className="industrial-text text-sm">Set up email forwarding and Google Drive sync for hands-free processing</p>
            </div>
          </div>
          <button
            onClick={onIntegration}
            className="industrial-button-secondary text-sm px-4 py-2"
          >
            SETUP NOW →
          </button>
        </div>
      </div>
    </div>
  );
};