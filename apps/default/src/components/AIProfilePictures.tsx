import React, { useState } from 'react';
import { Brain, Bot, Zap, Star, Sparkles, Eye, Cpu, CircuitBoard, Atom, Hexagon } from 'lucide-react';

interface AIProfilePicturesProps {
  onSelectProfile?: (profileId: string, profileUrl: string) => void;
  currentProfile?: string;
  showSelector?: boolean;
}

export const AIProfilePictures: React.FC<AIProfilePicturesProps> = ({ 
  onSelectProfile, 
  currentProfile,
  showSelector = false 
}) => {
  const [selectedProfile, setSelectedProfile] = useState(currentProfile || 'primary-ai');

  // Primary AI Profile Picture (your provided image)
  const primaryAIProfile = {
    id: 'primary-ai',
    name: 'DocuFlow AI',
    url: 'https://iili.io/KFoQcCb.png',
    description: 'Official DocuFlow AI Assistant'
  };

  // AI Profile Pictures Collection
  const aiProfiles = [
    {
      id: 'ai-brain-1',
      name: 'Neural Brain',
      icon: Brain,
      gradient: 'from-blue-500 to-purple-600',
      description: 'Classic AI brain representation'
    },
    {
      id: 'ai-bot-1',
      name: 'Friendly Bot',
      icon: Bot,
      gradient: 'from-green-500 to-teal-600',
      description: 'Approachable AI assistant'
    },
    {
      id: 'ai-spark-1',
      name: 'AI Spark',
      icon: Sparkles,
      gradient: 'from-yellow-500 to-orange-600',
      description: 'Creative and innovative'
    },
    {
      id: 'ai-zap-1',
      name: 'Lightning AI',
      icon: Zap,
      gradient: 'from-purple-500 to-pink-600',
      description: 'Fast and powerful'
    },
    {
      id: 'ai-star-1',
      name: 'Star AI',
      icon: Star,
      gradient: 'from-indigo-500 to-blue-600',
      description: 'Premium intelligence'
    },
    {
      id: 'ai-eye-1',
      name: 'Vision AI',
      icon: Eye,
      gradient: 'from-cyan-500 to-blue-600',
      description: 'Insightful and observant'
    },
    {
      id: 'ai-cpu-1',
      name: 'Processor AI',
      icon: Cpu,
      gradient: 'from-red-500 to-orange-600',
      description: 'Technical and precise'
    },
    {
      id: 'ai-circuit-1',
      name: 'Circuit AI',
      icon: CircuitBoard,
      gradient: 'from-emerald-500 to-green-600',
      description: 'Connected intelligence'
    },
    {
      id: 'ai-atom-1',
      name: 'Quantum AI',
      icon: Atom,
      gradient: 'from-violet-500 to-purple-600',
      description: 'Advanced quantum processing'
    },
    {
      id: 'ai-hex-1',
      name: 'Geometric AI',
      icon: Hexagon,
      gradient: 'from-slate-500 to-gray-600',
      description: 'Structured and logical'
    }
  ];

  const handleProfileSelect = (profileId: string, profileUrl?: string) => {
    setSelectedProfile(profileId);
    if (onSelectProfile) {
      onSelectProfile(profileId, profileUrl || primaryAIProfile.url);
    }
  };

  const renderIconProfile = (profile: typeof aiProfiles[0], size: string = 'w-12 h-12') => {
    const Icon = profile.icon;
    const isSelected = selectedProfile === profile.id;
    
    return (
      <div
        key={profile.id}
        className={`${size} rounded-full bg-gradient-to-br ${profile.gradient} flex items-center justify-center cursor-pointer transition-all duration-300 ${
          isSelected ? 'ring-4 ring-blue-500 ring-opacity-50 scale-110' : 'hover:scale-105'
        } shadow-lg`}
        onClick={() => handleProfileSelect(profile.id)}
        title={profile.description}
      >
        <Icon className={`${size === 'w-12 h-12' ? 'w-6 h-6' : size === 'w-16 h-16' ? 'w-8 h-8' : 'w-4 h-4'} text-white`} />
      </div>
    );
  };

  const renderPrimaryProfile = (size: string = 'w-12 h-12') => {
    const isSelected = selectedProfile === 'primary-ai';
    
    return (
      <div
        className={`${size} rounded-full cursor-pointer transition-all duration-300 ${
          isSelected ? 'ring-4 ring-green-500 ring-opacity-50 scale-110' : 'hover:scale-105'
        } shadow-lg overflow-hidden bg-gradient-to-br from-green-400 to-green-600`}
        onClick={() => handleProfileSelect('primary-ai', primaryAIProfile.url)}
        title={primaryAIProfile.description}
      >
        <img
          src={primaryAIProfile.url}
          alt={primaryAIProfile.name}
          className={`${size} rounded-full object-cover`}
          onError={(e) => {
            // Fallback to Brain icon if image fails to load
            e.currentTarget.style.display = 'none';
            const fallback = e.currentTarget.nextElementSibling as HTMLElement;
            if (fallback) fallback.classList.remove('hidden');
          }}
        />
        <div className={`${size} rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center hidden`}>
          <Brain className={`${size === 'w-12 h-12' ? 'w-6 h-6' : size === 'w-16 h-16' ? 'w-8 h-8' : 'w-4 h-4'} text-white`} />
        </div>
      </div>
    );
  };

  if (!showSelector) {
    // Just render the current selected profile
    if (selectedProfile === 'primary-ai') {
      return renderPrimaryProfile('w-12 h-12');
    }
    const currentProfileData = aiProfiles.find(p => p.id === selectedProfile) || aiProfiles[0];
    return renderIconProfile(currentProfileData, 'w-12 h-12');
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Choose Your AI Assistant Avatar</h3>
        <p className="text-sm text-gray-600">Select a profile picture that represents your AI assistant</p>
      </div>

      {/* Primary AI Profile (Featured) */}
      <div>
        <h4 className="text-md font-medium text-gray-800 mb-4 flex items-center space-x-2">
          <Star className="w-4 h-4 text-yellow-500" />
          <span>Featured AI Assistant</span>
        </h4>
        <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
          {renderPrimaryProfile('w-16 h-16')}
          <div>
            <h5 className="font-semibold text-gray-900">{primaryAIProfile.name}</h5>
            <p className="text-sm text-gray-600">{primaryAIProfile.description}</p>
            <p className="text-xs text-green-600 font-medium mt-1">Recommended</p>
          </div>
        </div>
      </div>

      {/* Icon-based AI Profiles */}
      <div>
        <h4 className="text-md font-medium text-gray-800 mb-4">Alternative AI Avatars</h4>
        <div className="grid grid-cols-5 gap-4">
          {aiProfiles.map((profile) => (
            <div key={profile.id} className="text-center">
              {renderIconProfile(profile, 'w-16 h-16')}
              <p className="text-xs text-gray-600 mt-2">{profile.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Custom Upload Option */}
      <div className="border-t pt-6">
        <h4 className="text-md font-medium text-gray-800 mb-4">Custom Avatar</h4>
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors">
            <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Upload Custom Image</p>
            <p className="text-xs text-gray-600">Upload your own AI assistant avatar</p>
            <input
              type="file"
              accept="image/*"
              className="mt-2 text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const url = URL.createObjectURL(file);
                  handleProfileSelect('custom', url);
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Preview Section */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="text-md font-medium text-gray-800 mb-3">Preview</h4>
        <div className="flex items-center space-x-3">
          {selectedProfile === 'primary-ai' ? (
            renderPrimaryProfile('w-12 h-12')
          ) : selectedProfile === 'custom' ? (
            <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-xs text-gray-600">Custom</span>
            </div>
          ) : (
            renderIconProfile(aiProfiles.find(p => p.id === selectedProfile) || aiProfiles[0], 'w-12 h-12')
          )}
          <div>
            <p className="font-medium text-gray-900">AI Assistant</p>
            <p className="text-sm text-gray-600">This is how your AI will appear</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Utility component for displaying AI profile in other parts of the app
export const AIProfileDisplay: React.FC<{
  profileId?: string;
  profileUrl?: string;
  size?: 'small' | 'medium' | 'large';
  showOnlineStatus?: boolean;
}> = ({ profileId = 'primary-ai', profileUrl, size = 'medium', showOnlineStatus = false }) => {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  };

  const iconSizes = {
    small: 'w-4 h-4',
    medium: 'w-6 h-6',
    large: 'w-8 h-8'
  };

  // Primary AI Profile
  const primaryAIUrl = 'https://iili.io/KFoQcCb.png';

  if (profileId === 'primary-ai' || (!profileId && !profileUrl)) {
    return (
      <div className={`${sizeClasses[size]} rounded-full relative overflow-hidden bg-gradient-to-br from-green-400 to-green-600 shadow-lg`}>
        <img
          src={primaryAIUrl}
          alt="DocuFlow AI Assistant"
          className={`${sizeClasses[size]} rounded-full object-cover`}
          onError={(e) => {
            e.currentTarget.style.display = 'none';
            const fallback = e.currentTarget.nextElementSibling as HTMLElement;
            if (fallback) fallback.classList.remove('hidden');
          }}
        />
        <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center hidden`}>
          <Brain className={`${iconSizes[size]} text-white`} />
        </div>
        {showOnlineStatus && (
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
        )}
      </div>
    );
  }

  if (profileUrl) {
    return (
      <div className={`${sizeClasses[size]} rounded-full relative overflow-hidden shadow-lg`}>
        <img
          src={profileUrl}
          alt="AI Assistant"
          className={`${sizeClasses[size]} rounded-full object-cover`}
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
        {showOnlineStatus && (
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
        )}
      </div>
    );
  }

  // Fallback to Brain icon
  return (
    <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg relative`}>
      <Brain className={`${iconSizes[size]} text-white`} />
      {showOnlineStatus && (
        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
      )}
    </div>
  );
};