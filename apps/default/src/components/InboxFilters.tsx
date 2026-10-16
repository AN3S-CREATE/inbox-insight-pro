import React from 'react';
import { Search, Filter, X, Brain, Building2, Users } from 'lucide-react';
import { FilterState, InboxItem } from '../types/inbox';

interface InboxFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  items: InboxItem[];
}

export const InboxFilters: React.FC<InboxFiltersProps> = ({
  filters,
  onFiltersChange,
  items
}) => {
  // Get unique companies from items (including AI-detected ones)
  const companies = Array.from(new Set(items.map(item => item.company)))
    .filter(Boolean)
    .map(company => ({
      value: company,
      label: items.find(item => item.company === company)?.companyLabel || company
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

  // Get unique departments from items
  const departments = Array.from(new Set(items.map(item => item.department)))
    .filter(Boolean)
    .map(dept => ({
      value: dept,
      label: items.find(item => item.department === dept)?.departmentLabel || dept
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

  const urgencyLevels = [
    { value: 'high', label: '🔴 High' },
    { value: 'medium', label: '🟡 Medium' },
    { value: 'low', label: '🟢 Low' }
  ];

  const itemTypes = [
    { value: 'email', label: 'Email' },
    { value: 'voice', label: 'Voice Note' },
    { value: 'written', label: 'Written Note' }
  ];

  const dateRanges = [
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' }
  ];

  const updateFilter = (key: keyof FilterState, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFiltersChange({
      company: '',
      department: '',
      urgency: '',
      itemType: '',
      dateRange: '',
      search: ''
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  // Count items by category for display
  const getFilterCounts = () => {
    const companyCounts = companies.map(company => ({
      ...company,
      count: items.filter(item => item.company === company.value).length
    }));

    const departmentCounts = departments.map(dept => ({
      ...dept,
      count: items.filter(item => item.department === dept.value).length
    }));

    return { companyCounts, departmentCounts };
  };

  const { companyCounts, departmentCounts } = getFilterCounts();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Smart Filters</h3>
          <div className="flex items-center space-x-1 bg-blue-50 px-2 py-1 rounded-full">
            <Brain className="w-3 h-3 text-blue-600" />
            <span className="text-xs text-blue-700 font-medium">AI-Powered</span>
          </div>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-4 h-4" />
            <span>Clear All</span>
          </button>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-1 mb-1">
            <Building2 className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">Companies</span>
          </div>
          <div className="text-2xl font-bold text-blue-600">{companies.length}</div>
          <div className="text-xs text-gray-500">Detected</div>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center space-x-1 mb-1">
            <Users className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-gray-700">Departments</span>
          </div>
          <div className="text-2xl font-bold text-green-600">{departments.length}</div>
          <div className="text-xs text-gray-500">Active</div>
        </div>
        <div className="text-center">
          <div className="text-sm font-medium text-gray-700 mb-1">High Priority</div>
          <div className="text-2xl font-bold text-red-600">
            {items.filter(item => item.urgency === 'high').length}
          </div>
          <div className="text-xs text-gray-500">Items</div>
        </div>
        <div className="text-center">
          <div className="text-sm font-medium text-gray-700 mb-1">Total Items</div>
          <div className="text-2xl font-bold text-gray-900">{items.length}</div>
          <div className="text-xs text-gray-500">Processed</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <div className="flex items-center space-x-1">
              <Building2 className="w-3 h-3" />
              <span>Company</span>
              <Brain className="w-3 h-3 text-blue-500" />
            </div>
          </label>
          <select
            value={filters.company}
            onChange={(e) => updateFilter('company', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="">All Companies ({companies.length})</option>
            {companyCounts.map(company => (
              <option key={company.value} value={company.value}>
                {company.label} ({company.count})
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">AI-detected from domains & content</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <div className="flex items-center space-x-1">
              <Users className="w-3 h-3" />
              <span>Department</span>
              <Brain className="w-3 h-3 text-blue-500" />
            </div>
          </label>
          <select
            value={filters.department}
            onChange={(e) => updateFilter('department', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="">All Departments ({departments.length})</option>
            {departmentCounts.map(dept => (
              <option key={dept.value} value={dept.value}>
                {dept.label} ({dept.count})
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">AI-classified by keywords & context</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Urgency</label>
          <select
            value={filters.urgency}
            onChange={(e) => updateFilter('urgency', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="">All Urgency</option>
            {urgencyLevels.map(urgency => (
              <option key={urgency.value} value={urgency.value}>
                {urgency.label} ({items.filter(item => item.urgency === urgency.value).length})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
          <select
            value={filters.itemType}
            onChange={(e) => updateFilter('itemType', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="">All Types</option>
            {itemTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label} ({items.filter(item => item.itemType === type.value).length})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
          <select
            value={filters.dateRange}
            onChange={(e) => updateFilter('dateRange', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="">All Time</option>
            {dateRanges.map(range => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => updateFilter('search', e.target.value)}
              placeholder="Search items..."
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
          <span className="text-sm text-gray-600">Active filters:</span>
          {filters.company && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Company: {companies.find(c => c.value === filters.company)?.label}
              <button
                onClick={() => updateFilter('company', '')}
                className="ml-1 hover:text-blue-600"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.department && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Department: {departments.find(d => d.value === filters.department)?.label}
              <button
                onClick={() => updateFilter('department', '')}
                className="ml-1 hover:text-green-600"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.urgency && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
              Urgency: {urgencyLevels.find(u => u.value === filters.urgency)?.label}
              <button
                onClick={() => updateFilter('urgency', '')}
                className="ml-1 hover:text-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};