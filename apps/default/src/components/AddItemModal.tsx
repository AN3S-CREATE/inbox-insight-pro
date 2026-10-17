import React, { useState } from 'react';
import { X, Mail, Mic, FileText, Building2, User, Send, Loader2, Brain, CheckCircle, AlertTriangle, Play, Square } from 'lucide-react';
import { createInboxItem } from '../services/api';
import type { InboxItem } from '../types/inbox';

interface AddItemModalProps {
  onClose: () => void;
  onItemAdded: () => void;
}

export const AddItemModal: React.FC<AddItemModalProps> = ({ onClose, onItemAdded }) => {
  const [formData, setFormData] = useState<{
    title: string;
    company: string;
    itemType: InboxItem['itemType'];
    personalNote: string;
    sender: string;
    recipient: string;
    content: string;
  }>({
    title: '',
    company: '',
    itemType: 'email',
    personalNote: '',
    sender: '',
    recipient: '',
    content: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordingInterval, setRecordingInterval] = useState<NodeJS.Timeout | null>(null);

  const itemTypes = [
    { value: 'email', label: 'Email', icon: Mail, description: 'Email communications and forwards' },
    { value: 'voice', label: 'Voice Note', icon: Mic, description: 'Audio recordings and transcriptions' },
    { value: 'written', label: 'Written Note', icon: FileText, description: 'Meeting notes and documents' }
  ];

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

      recorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        setAudioBlob(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      setRecordingTime(0);

      const interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      setRecordingInterval(interval);

    } catch (error) {
      console.error('Error accessing microphone:', error);
      setError('Unable to access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
      if (recordingInterval) {
        clearInterval(recordingInterval);
        setRecordingInterval(null);
      }
    }
  };

  const playRecording = () => {
    if (audioBlob) {
      const audio = new Audio(URL.createObjectURL(audioBlob));
      audio.play();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    try {
      const result = await createInboxItem({
        ...formData,
        content: formData.content
      });
      
      setSuccessMessage(result.message);
      setIsDuplicate(result.isDuplicate);
      
      // Auto-close after success (with delay to show message)
      setTimeout(() => {
        onItemAdded();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create inbox item.');
      console.error('Error creating item:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="industrial-card max-w-4xl w-full max-h-[90vh] overflow-y-auto glow-green">
        <div className="flex items-center justify-between p-6 border-b border-green-400">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-lg glow-green">
              <Brain className="w-6 h-6 text-black" />
            </div>
            <div>
              <h2 className="industrial-title text-2xl">ADD TO KNOWLEDGE BASE</h2>
              <p className="industrial-text text-sm">AI will analyze and process your content automatically</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-gray-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="industrial-card bg-red-900/30 border-red-400 p-4 flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          {successMessage && (
            <div className={`industrial-card p-4 flex items-center space-x-2 ${
              isDuplicate 
                ? 'bg-yellow-900/30 border-yellow-400' 
                : 'bg-green-900/30 border-green-400'
            }`}>
              <CheckCircle className={`w-5 h-5 flex-shrink-0 ${
                isDuplicate ? 'text-yellow-400' : 'text-green-400'
              }`} />
              <div>
                <p className={`text-sm font-bold ${
                  isDuplicate ? 'text-yellow-300' : 'text-green-300'
                }`}>
                  {isDuplicate ? 'DUPLICATE DETECTED & MERGED' : 'SUCCESSFULLY ADDED'}
                </p>
                <p className={`text-sm ${
                  isDuplicate ? 'text-yellow-400' : 'text-green-400'
                }`}>
                  {successMessage}
                </p>
              </div>
            </div>
          )}

          {/* AI Processing Notice */}
          <div className="industrial-card p-6 holographic">
            <div className="flex items-center space-x-3 mb-4">
              <Brain className="w-6 h-6 text-green-400" />
              <h4 className="industrial-subtitle text-lg">SMART KNOWLEDGE BASE</h4>
            </div>
            <p className="industrial-text text-sm mb-4">
              Your personal knowledge base with intelligent processing capabilities:
            </p>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="industrial-text">Auto-detect company & department</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span className="industrial-text">Duplicate detection & merging</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                <span className="industrial-text">AI-generated summaries</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="industrial-text">Strategic recommendations</span>
              </div>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block industrial-subtitle text-sm mb-2">
              TITLE *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => updateFormData('title', e.target.value)}
              className="industrial-input w-full"
              placeholder="BRIEF TITLE FOR THIS ITEM"
              required
            />
          </div>

          {/* Item Type */}
          <div>
            <label className="block industrial-subtitle text-sm mb-2">
              ITEM TYPE *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {itemTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => updateFormData('itemType', type.value)}
                    className={`industrial-card p-4 transition-all ${
                      formData.itemType === type.value
                        ? 'border-green-400 bg-green-900/30 glow-green'
                        : 'border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <Icon className={`w-5 h-5 ${
                        formData.itemType === type.value ? 'text-green-400' : 'text-gray-400'
                      }`} />
                      <span className={`industrial-subtitle text-sm ${
                        formData.itemType === type.value ? 'text-green-300' : 'text-gray-300'
                      }`}>{type.label}</span>
                    </div>
                    <p className="industrial-text text-xs">{type.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Voice Recording Section */}
          {formData.itemType === 'voice' && (
            <div className="industrial-card p-6 bg-gradient-to-br from-orange-900/30 to-red-900/30 border-orange-400">
              <div className="flex items-center space-x-3 mb-4">
                <Mic className="w-6 h-6 text-orange-400" />
                <h4 className="industrial-subtitle text-lg">VOICE RECORDING SYSTEM</h4>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {!isRecording && !audioBlob && (
                      <button
                        type="button"
                        onClick={startRecording}
                        className="industrial-button-secondary flex items-center space-x-2"
                      >
                        <Mic className="w-4 h-4" />
                        <span>START RECORDING</span>
                      </button>
                    )}
                    
                    {isRecording && (
                      <button
                        type="button"
                        onClick={stopRecording}
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold text-sm transition-all duration-300 flex items-center space-x-2"
                      >
                        <Square className="w-4 h-4" />
                        <span>STOP RECORDING</span>
                      </button>
                    )}
                    
                    {audioBlob && !isRecording && (
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={playRecording}
                          className="industrial-button flex items-center space-x-2"
                        >
                          <Play className="w-4 h-4" />
                          <span>PLAY</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setAudioBlob(null);
                            setRecordingTime(0);
                          }}
                          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-bold text-sm transition-all duration-300"
                        >
                          CLEAR
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {(isRecording || audioBlob) && (
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${isRecording ? 'bg-red-400 animate-pulse' : 'bg-green-400'}`}></div>
                      <span className="industrial-text text-sm font-bold">
                        {formatTime(recordingTime)}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="industrial-card p-4 bg-black/50">
                  <p className="industrial-text text-xs">
                    Recordings stay in this form for playback only. They are not saved or transcribed.
                    Paste a transcript into the content field for local AI analysis.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Company (Optional) */}
          <div>
            <label className="block industrial-subtitle text-sm mb-2">
              COMPANY <span className="text-gray-500 text-xs">(OPTIONAL - AI WILL AUTO-DETECT)</span>
            </label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={formData.company}
                onChange={(e) => updateFormData('company', e.target.value)}
                className="industrial-input w-full pl-10"
                placeholder="COMPANY NAME (OR LEAVE BLANK)"
              />
            </div>
            <p className="text-xs industrial-text mt-1">
              AI will analyze email domains, signatures, and content to identify the company
            </p>
          </div>

          {/* Sender and Recipient */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block industrial-subtitle text-sm mb-2">
                SENDER
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={formData.sender}
                  onChange={(e) => updateFormData('sender', e.target.value)}
                  className="industrial-input w-full pl-10"
                  placeholder="SENDER@COMPANY.COM"
                />
              </div>
              <p className="text-xs industrial-text mt-1">
                Email domain helps AI detect company
              </p>
            </div>

            <div>
              <label className="block industrial-subtitle text-sm mb-2">
                RECIPIENT
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={formData.recipient}
                  onChange={(e) => updateFormData('recipient', e.target.value)}
                  className="industrial-input w-full pl-10"
                  placeholder="RECIPIENT@COMPANY.COM"
                />
              </div>
            </div>
          </div>

          {/* Personal Note */}
          <div>
            <label className="block industrial-subtitle text-sm mb-2">
              PERSONAL NOTE
            </label>
            <input
              type="text"
              value={formData.personalNote}
              onChange={(e) => updateFormData('personalNote', e.target.value)}
              className="industrial-input w-full"
              placeholder="YOUR PERSONAL NOTE ABOUT THIS ITEM"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block industrial-subtitle text-sm mb-2">
              CONTENT *
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => updateFormData('content', e.target.value)}
              rows={8}
              className="industrial-input w-full resize-none"
              placeholder={
                formData.itemType === 'voice' 
                  ? "VOICE NOTE TRANSCRIPT OR ADDITIONAL NOTES..."
                  : formData.itemType === 'email'
                  ? "PASTE EMAIL CONTENT HERE..."
                  : "WRITTEN NOTE CONTENT..."
              }
              required
            />
            <div className="industrial-card p-4 mt-3 bg-black/50">
              <h5 className="industrial-subtitle text-xs mb-2">AI WILL ANALYZE THIS CONTENT FOR:</h5>
              <div className="grid grid-cols-2 gap-2 text-xs industrial-text">
                <div>• Company names and signatures</div>
                <div>• Department keywords and context</div>
                <div>• Duplicate detection and merging</div>
                <div>• Key insights and recommendations</div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-600">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white px-6 py-3 rounded-lg font-bold text-sm transition-all duration-300"
              disabled={loading}
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={loading}
              className="industrial-button flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>PROCESSING...</span>
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4" />
                  <span>ADD TO KNOWLEDGE BASE</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};