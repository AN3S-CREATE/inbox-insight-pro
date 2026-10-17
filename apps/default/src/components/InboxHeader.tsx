import React from 'react';
import { Download, Plus, Database, TrendingUp } from 'lucide-react';

interface InboxHeaderProps {
  totalItems: number;
  filteredItems: number;
  onAddItem: () => void;
  onExport: () => void;
}

export const InboxHeader: React.FC<InboxHeaderProps> = ({
  totalItems,
  filteredItems,
  onAddItem,
  onExport
}) => (
  <section className="mb-8">
    <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <p className="industrial-subtitle text-sm">LOCAL-FIRST KNOWLEDGE BASE</p>
        <h1 className="industrial-title mt-1 text-3xl sm:text-4xl">EXECUTIVE INBOX</h1>
        <p className="industrial-text mt-2">Analyze and organize business communications on this device.</p>
      </div>
      <div className="flex flex-wrap gap-3">
        <button onClick={onAddItem} className="industrial-button flex items-center gap-2">
          <Plus className="h-4 w-4" />
          <span>ADD ITEM</span>
        </button>
        <button onClick={onExport} className="flex items-center gap-2 rounded-lg border border-gray-600 bg-gray-700 px-5 py-3 text-sm font-bold text-gray-100 transition hover:bg-gray-600">
          <Download className="h-4 w-4" />
          <span>EXPORT</span>
        </button>
      </div>
    </div>
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="industrial-card flex items-center justify-between p-5">
        <div>
          <p className="industrial-subtitle text-sm">TOTAL ITEMS</p>
          <p className="industrial-title mt-1 text-3xl">{totalItems}</p>
        </div>
        <Database className="h-9 w-9 text-green-400" />
      </div>
      <div className="industrial-card flex items-center justify-between p-5">
        <div>
          <p className="industrial-subtitle text-sm">FILTERED RESULTS</p>
          <p className="industrial-title mt-1 text-3xl">{filteredItems}</p>
        </div>
        <TrendingUp className="h-9 w-9 text-yellow-400" />
      </div>
    </div>
  </section>
);
