import React from 'react';
import { X } from 'lucide-react';
import { IntegrationDashboard } from './IntegrationDashboard';

interface IntegrationModalProps {
  onClose: () => void;
}

export const IntegrationModal: React.FC<IntegrationModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white rounded-t-xl">
          <h2 className="text-xl font-semibold text-gray-900">Integration Center</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          <IntegrationDashboard />
        </div>
      </div>
    </div>
  );
};