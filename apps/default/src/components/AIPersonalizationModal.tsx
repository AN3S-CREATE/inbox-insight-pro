import React, { useState } from 'react';
import { X, Save, User, Palette, MessageSquare, Volume2, Eye, Sparkles, Brain, Bot, Zap, Heart, Star, Coffee, Lightbulb } from 'lucide-react';

interface PersonalizationSettings {
  name: string;
  avatar: string;
  theme: 'green-teal' | 'orange-red' | 'dark' | 'minimal';
  personality: 'professional' | 'friendly' | 'casual' | 'enthusiastic' | 'zen';
  greetingMessage: string;
  responseStyle: 'detailed' | 'concise' | 'bullet-points' | 'conversational';
  voiceEnabled: boolean;
  animationsEnabled: boolean;
  position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  size: 'small' | 'medium' | 'large';
}

interface AIPersonalizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: PersonalizationSettings;
  onSave: (settings: PersonalizationSettings) => void;
}

export const AIPersonalizationModal: React.FC<AIPersonalizationModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSave
}) => {
  const [localSettings, setLocalSettings] = useState<PersonalizationSettings>(settings);

  if (!isOpen) return null;

  const avatarOptions = [
    { id: 'brain', label: 'Neural Brain', icon: Brain },
    { id: 'bot', label: 'Robot Assistant', icon: Bot },
    { id: 'sparkles', label: 'Magic Sparkles', icon: Sparkles },
    { id: 'zap', label: 'Lightning Bolt', icon: Zap },
    { id: 'heart', label: 'Friendly Heart', icon: Heart },
    { id: 'star', label: 'Bright Star', icon: Star },
    { id: 'coffee', label: 'Coffee Buddy', icon: Coffee },
    { id: 'lightbulb', label: 'Idea Generator', icon: Lightbulb }
  ];

  const themeOptions: Array<{
    id: PersonalizationSettings['theme'];
    name: string;
    gradient: string;
    description: string;
  }> = [
    {
      id: 'green-teal',
      name: 'Green Teal',
      gradient: 'from-green-500 to-teal-500',
      description: 'Fresh and natural'
    },
    {
      id: 'orange-red',
      name: 'Orange Red',
      gradient: 'from-orange-500 to-red-500',
      description: 'Energetic and bold'
    },
    {
      id: 'dark',
      name: 'Dark Mode',
      gradient: 'from-gray-800 to-gray-900',
      description: 'Sleek and minimal'
    },
    {
      id: 'minimal',
      name: 'Minimal',
      gradient: 'from-gray-100 to-gray-200',
      description: 'Clean and simple'
    }
  ];

  const personalityOptions: Array<{
    id: PersonalizationSettings['personality'];
    name: string;
    description: string;
  }> = [
    {
      id: 'professional',
      name: 'Professional',
      description: 'Formal, precise, and business-focused'
    },
    {
      id: 'friendly',
      name: 'Friendly',
      description: 'Warm, helpful, and approachable'
    },
    {
      id: 'casual',
      name: 'Casual',
      description: 'Relaxed, conversational, and easy-going'
    },
    {
      id: 'enthusiastic',
      name: 'Enthusiastic',
      description: 'Energetic, excited, and motivational'
    },
    {
      id: 'zen',
      name: 'Zen',
      description: 'Calm, mindful, and thoughtful'
    }
  ];

  const updateSetting = <K extends keyof PersonalizationSettings>(
    key: K,
    value: PersonalizationSettings[K]
  ) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    onSave(localSettings);
    onClose();
  };

  const getThemeClasses = (themeId: string) => {
    const theme = themeOptions.find(t => t.id === themeId);
    return theme ? `bg-gradient-to-r ${theme.gradient}` : 'bg-gradient-to-r from-green-500 to-teal-500';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getThemeClasses(localSettings.theme)}`}>
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Personalize AI Assistant</h2>
              <p className="text-sm text-gray-600">Customize your AI companion</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Basic Settings */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Assistant Name</label>
                <input
                  type="text"
                  value={localSettings.name}
                  onChange={(e) => updateSetting('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="AI Knowledge Assistant"
                />
              </div>
              
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Greeting Message</label>
              <textarea
                value={localSettings.greetingMessage}
                onChange={(e) => updateSetting('greetingMessage', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                placeholder="Hi! I'm your AI Knowledge Assistant..."
              />
            </div>
          </div>

          {/* Avatar Selection */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Avatar Style</h3>
            
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {avatarOptions.map((avatar) => {
                const Icon = avatar.icon;
                const isSelected = localSettings.avatar === avatar.id;
                
                return (
                  <button
                    key={avatar.id}
                    onClick={() => updateSetting('avatar', avatar.id)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      isSelected
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${
                      isSelected ? getThemeClasses(localSettings.theme) : 'bg-gray-100'
                    }`}>
                      <Icon className={`w-6 h-6 ${isSelected ? 'text-white' : 'text-gray-600'}`} />
                    </div>
                    <p className="text-xs text-gray-700 text-center">{avatar.label}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Theme Selection */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Color Theme</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {themeOptions.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => updateSetting('theme', theme.id)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    localSettings.theme === theme.id
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className={`w-full h-8 rounded-lg bg-gradient-to-r ${theme.gradient} mb-3`}></div>
                  <h4 className="font-medium text-gray-900 text-sm">{theme.name}</h4>
                  <p className="text-xs text-gray-600 mt-1">{theme.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Personality */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Personality Style</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {personalityOptions.map((personality) => (
                <label
                  key={personality.id}
                  className={`flex items-start space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    localSettings.personality === personality.id
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="personality"
                    value={personality.id}
                    checked={localSettings.personality === personality.id}
                    onChange={() => updateSetting('personality', personality.id)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{personality.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">{personality.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Position and Size */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Position</h3>
              <div className="space-y-2">
                {([
                  { id: 'bottom-right', name: 'Bottom Right' },
                  { id: 'bottom-left', name: 'Bottom Left' },
                  { id: 'top-right', name: 'Top Right' },
                  { id: 'top-left', name: 'Top Left' }
                ] as const).map((position) => (
                  <label
                    key={position.id}
                    className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-all ${
                      localSettings.position === position.id
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="position"
                      value={position.id}
                      checked={localSettings.position === position.id}
                      onChange={() => updateSetting('position', position.id)}
                    />
                    <span className="font-medium text-gray-900">{position.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Button Size</h3>
              <div className="space-y-2">
                {([
                  { id: 'small', name: 'Small', size: 'w-12 h-12' },
                  { id: 'medium', name: 'Medium', size: 'w-14 h-14' },
                  { id: 'large', name: 'Large', size: 'w-16 h-16' }
                ] as const).map((size) => (
                  <label
                    key={size.id}
                    className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-all ${
                      localSettings.size === size.id
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="size"
                      value={size.id}
                      checked={localSettings.size === size.id}
                      onChange={() => updateSetting('size', size.id)}
                    />
                    <div className={`${size.size} bg-gray-200 rounded-full flex items-center justify-center mr-2`}>
                      <User className="w-4 h-4 text-gray-600" />
                    </div>
                    <span className="font-medium text-gray-900">{size.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Advanced Options */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Advanced Options</h3>
            
            <div className="space-y-4">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={localSettings.voiceEnabled}
                  onChange={(e) => updateSetting('voiceEnabled', e.target.checked)}
                  className="rounded border-gray-300"
                />
                <Volume2 className="w-5 h-5 text-gray-600" />
                <div>
                  <span className="font-medium text-gray-900">Voice Input</span>
                  <p className="text-sm text-gray-600">Enable voice commands</p>
                </div>
              </label>

              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={localSettings.animationsEnabled}
                  onChange={(e) => updateSetting('animationsEnabled', e.target.checked)}
                  className="rounded border-gray-300"
                />
                <Sparkles className="w-5 h-5 text-gray-600" />
                <div>
                  <span className="font-medium text-gray-900">Animations</span>
                  <p className="text-sm text-gray-600">Enable smooth animations</p>
                </div>
              </label>
            </div>
          </div>

          {/* Preview */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview</h3>
            <div className="bg-gray-50 rounded-lg p-6 relative h-32">
              <div className={`absolute ${
                localSettings.position === 'bottom-right' ? 'bottom-4 right-4' :
                localSettings.position === 'bottom-left' ? 'bottom-4 left-4' :
                localSettings.position === 'top-right' ? 'top-4 right-4' :
                'top-4 left-4'
              }`}>
                <div className={`${
                  localSettings.size === 'small' ? 'w-12 h-12' :
                  localSettings.size === 'medium' ? 'w-14 h-14' :
                  'w-16 h-16'
                } ${getThemeClasses(localSettings.theme)} rounded-full shadow-lg flex items-center justify-center`}>
                  {(() => {
                    const selectedAvatar = avatarOptions.find(a => a.id === localSettings.avatar);
                    const Icon = selectedAvatar?.icon || Brain;
                    return <Icon className={`${
                      localSettings.size === 'small' ? 'w-6 h-6' :
                      localSettings.size === 'medium' ? 'w-7 h-7' :
                      'w-8 h-8'
                    } text-white`} />;
                  })()}
                </div>
              </div>
              <div className="text-center text-gray-500 text-sm">
                Assistant will appear in the {localSettings.position.replace('-', ' ')} corner
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className={`flex items-center space-x-2 px-6 py-2 rounded-lg font-medium transition-colors text-white ${getThemeClasses(localSettings.theme)}`}
          >
            <Save className="w-4 h-4" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>
    </div>
  );
};