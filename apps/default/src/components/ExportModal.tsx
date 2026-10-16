import React, { useState } from 'react';
import { X, Download, FileText, Table, Loader2 } from 'lucide-react';
import { InboxItem } from '../types/inbox';

interface ExportModalProps {
  items: InboxItem[];
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ items, onClose }) => {
  const [exportFormat, setExportFormat] = useState<'pdf' | 'excel'>('pdf');
  const [loading, setLoading] = useState(false);

  const exportToPDF = () => {
    const content = items.map(item => `
      Title: ${item.title}
      Company: ${item.companyLabel}
      Type: ${item.itemTypeLabel}
      Department: ${item.departmentLabel}
      Urgency: ${item.urgencyLabel}
      Sender: ${item.sender}
      Recipient: ${item.recipient}
      Date: ${new Date(item.dateTime).toLocaleDateString()}
      Personal Note: ${item.personalNote}
      Summary: ${item.summary}
      Recommendation: ${item.recommendation}
      Content: ${item.content}
      
      ---
    `).join('\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inbox-items-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportToExcel = () => {
    const headers = [
      'Title',
      'Company',
      'Type',
      'Department',
      'Urgency',
      'Sender',
      'Recipient',
      'Date',
      'Personal Note',
      'Summary',
      'Recommendation',
      'Content'
    ];

    const csvContent = [
      headers.join(','),
      ...items.map(item => [
        `"${item.title.replace(/"/g, '""')}"`,
        `"${item.companyLabel.replace(/"/g, '""')}"`,
        `"${item.itemTypeLabel.replace(/"/g, '""')}"`,
        `"${item.departmentLabel.replace(/"/g, '""')}"`,
        `"${item.urgencyLabel.replace(/"/g, '""')}"`,
        `"${item.sender.replace(/"/g, '""')}"`,
        `"${item.recipient.replace(/"/g, '""')}"`,
        `"${new Date(item.dateTime).toLocaleDateString()}"`,
        `"${item.personalNote.replace(/"/g, '""')}"`,
        `"${item.summary.replace(/"/g, '""')}"`,
        `"${item.recommendation.replace(/"/g, '""')}"`,
        `"${item.content.replace(/"/g, '""')}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inbox-items-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExport = async () => {
    setLoading(true);
    
    try {
      if (exportFormat === 'pdf') {
        exportToPDF();
      } else {
        exportToExcel();
      }
      
      // Close modal after a short delay
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Export Data</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <p className="text-sm text-gray-600 mb-4">
              Export {items.length} filtered inbox items to your preferred format.
            </p>

            <div className="space-y-3">
              <button
                onClick={() => setExportFormat('pdf')}
                className={`w-full flex items-center space-x-3 p-4 rounded-lg border transition-all ${
                  exportFormat === 'pdf'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <FileText className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-medium">PDF Report</div>
                  <div className="text-sm text-gray-500">
                    Formatted text document with all details
                  </div>
                </div>
              </button>

              <button
                onClick={() => setExportFormat('excel')}
                className={`w-full flex items-center space-x-3 p-4 rounded-lg border transition-all ${
                  exportFormat === 'excel'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <Table className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-medium">Excel/CSV</div>
                  <div className="text-sm text-gray-500">
                    Spreadsheet format for data analysis
                  </div>
                </div>
              </button>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Export includes:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• All item details and metadata</li>
              <li>• AI-generated summaries</li>
              <li>• Strategic recommendations</li>
              <li>• Department and urgency classifications</li>
              <li>• Full content and personal notes</li>
            </ul>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleExport}
              disabled={loading}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Exporting...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Export {exportFormat.toUpperCase()}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};