import React, { useCallback, useEffect, useState } from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { AIAssistant } from './AIAssistant';
import { AddItemModal } from './AddItemModal';
import { ExportModal } from './ExportModal';
import { InboxFilters } from './InboxFilters';
import { InboxGrid } from './InboxGrid';
import { InboxHeader } from './InboxHeader';
import type { FilterState, InboxItem } from '../types/inbox';
import { fetchInboxItems } from '../services/api';

const emptyFilters: FilterState = {
  company: '',
  department: '',
  urgency: '',
  itemType: '',
  dateRange: '',
  search: ''
};

export const InboxDashboard: React.FC = () => {
  const [items, setItems] = useState<InboxItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<InboxItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [filters, setFilters] = useState<FilterState>(emptyFilters);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(() => setRefreshKey((value) => value + 1), []);

  useEffect(() => {
    const controller = new AbortController();
    const loadItems = async () => {
      setLoading(true);
      setError('');
      try {
        const [allItems, matchingItems] = await Promise.all([
          fetchInboxItems({}, controller.signal),
          fetchInboxItems(filters, controller.signal)
        ]);
        if (controller.signal.aborted) return;
        setItems(allItems);
        setFilteredItems(matchingItems);
      } catch (cause) {
        if (!controller.signal.aborted) {
          setError(cause instanceof Error ? cause.message : 'Could not load local inbox items.');
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };
    const debounce = window.setTimeout(() => void loadItems(), 150);
    return () => {
      window.clearTimeout(debounce);
      controller.abort();
    };
  }, [filters, refreshKey]);

  const handleItemAdded = () => {
    setShowAddModal(false);
    refresh();
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <InboxHeader
        totalItems={items.length}
        filteredItems={filteredItems.length}
        onAddItem={() => setShowAddModal(true)}
        onExport={() => setShowExportModal(true)}
      />

      {error && (
        <div role="alert" className="mb-6 flex items-start gap-3 rounded-xl border border-red-300 bg-red-50 p-4 text-red-800">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <p className="font-semibold">Could not connect to the local inbox API</p>
            <p className="text-sm">{error}. Start the local app with <code>npm run dev</code>. Ollama is needed when creating or querying items.</p>
          </div>
        </div>
      )}

      {loading && items.length === 0 && (
        <div className="flex items-center justify-center gap-2 py-10 text-gray-600">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Loading local inbox…</span>
        </div>
      )}

      <InboxFilters filters={filters} onFiltersChange={setFilters} items={items} />
      <InboxGrid items={filteredItems} loading={loading} onRefresh={refresh} />

      {showAddModal && (
        <AddItemModal onClose={() => setShowAddModal(false)} onItemAdded={handleItemAdded} />
      )}
      {showExportModal && (
        <ExportModal items={filteredItems} onClose={() => setShowExportModal(false)} />
      )}
      <AIAssistant items={items} />
    </main>
  );
};
