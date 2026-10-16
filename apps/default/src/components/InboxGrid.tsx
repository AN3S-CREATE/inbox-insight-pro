import React from 'react';
import { RefreshCw, Mail, Mic, FileText, Calendar, User, Building2, Lightbulb } from 'lucide-react';
import { InboxItem } from '../types/inbox';

interface InboxGridProps {
  items: InboxItem[];
  loading: boolean;
  onRefresh: () => void;
}

export const InboxGrid: React.FC<InboxGridProps> = ({ items, loading, onRefresh }) => {
  const getItemTypeIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <Mail className="w-4 h-4" />;
      case 'voice':
        return <Mic className="w-4 h-4" />;
      case 'written':
        return <FileText className="w-4 h-4" />;
      default:
        return <Mail className="w-4 h-4" />;
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDepartmentColor = (department: string) => {
    const colors: Record<string, string> = {
      finance: 'bg-green-50 text-green-700 border-green-200',
      marketing: 'bg-orange-50 text-orange-700 border-orange-200',
      operations: 'bg-blue-50 text-blue-700 border-blue-200',
      hr: 'bg-purple-50 text-purple-700 border-purple-200',
      it: 'bg-cyan-50 text-cyan-700 border-cyan-200',
      sales: 'bg-red-50 text-red-700 border-red-200',
      legal: 'bg-gray-50 text-gray-700 border-gray-200',
      executive: 'bg-pink-50 text-pink-700 border-pink-200'
    };
    return colors[department] || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Invalid Date';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center space-x-2 text-gray-600">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span>Loading inbox items...</span>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
        <p className="text-gray-600 mb-4">Try adjusting your filters or add some new items to get started.</p>
        <button
          onClick={onRefresh}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors mx-auto"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh</span>
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {items.map((item) => (
        <div
          key={item.id}
          className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 overflow-hidden"
        >
          <div className="p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg">
                  {getItemTypeIcon(item.itemType)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">{item.itemTypeLabel}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getUrgencyColor(item.urgency)}`}>
                {item.urgencyLabel}
              </span>
            </div>

            {/* Company and Department */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-1 text-sm text-gray-600">
                <Building2 className="w-3 h-3" />
                <span className="font-medium">{item.companyLabel}</span>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getDepartmentColor(item.department)}`}>
                {item.departmentLabel}
              </span>
            </div>

            {/* Sender/Recipient */}
            <div className="space-y-1 mb-4">
              {item.sender && (
                <div className="flex items-center space-x-1 text-xs text-gray-600">
                  <User className="w-3 h-3" />
                  <span>From: {item.sender}</span>
                </div>
              )}
              {item.recipient && (
                <div className="flex items-center space-x-1 text-xs text-gray-600">
                  <User className="w-3 h-3" />
                  <span>To: {item.recipient}</span>
                </div>
              )}
            </div>

            {/* Personal Note */}
            {item.personalNote && (
              <div className="bg-blue-50 rounded-lg p-3 mb-4">
                <p className="text-sm text-blue-800 font-medium">Personal Note:</p>
                <p className="text-sm text-blue-700 mt-1">{item.personalNote}</p>
              </div>
            )}

            {/* Summary */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Summary</h4>
              <p className="text-sm text-gray-700 leading-relaxed">
                {item.summary || 'No summary available'}
              </p>
            </div>

            {/* Recommendation */}
            <div className="mb-4">
              <div className="flex items-center space-x-1 mb-2">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <h4 className="text-sm font-medium text-gray-900">Recommendation</h4>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                {item.recommendation || 'No recommendation available'}
              </p>
            </div>

            {/* Date */}
            <div className="flex items-center space-x-1 text-xs text-gray-500 pt-3 border-t border-gray-100">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(item.dateTime)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};