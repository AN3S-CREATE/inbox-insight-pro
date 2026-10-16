import React, { useState, useEffect } from 'react';
import { AIAssistant } from './AIAssistant';
import { InboxHeader } from './InboxHeader';
import { InboxFilters } from './InboxFilters';
import { InboxGrid } from './InboxGrid';
import { AddItemModal } from './AddItemModal';
import { ExportModal } from './ExportModal';
import { IntegrationModal } from './IntegrationModal';
import { InboxItem, FilterState } from '../types/inbox';
import { fetchInboxItems } from '../services/api';
import { Brain, Database, Building2, Users, AlertTriangle, Calendar, Activity, Cpu, Zap } from 'lucide-react';

export const InboxDashboard: React.FC = () => {
  const [items, setItems] = useState<InboxItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<InboxItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showIntegrationModal, setShowIntegrationModal] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    company: '',
    department: '',
    urgency: '',
    itemType: '',
    dateRange: '',
    search: ''
  });

  // Sample data for demonstration
  const sampleItems: InboxItem[] = [
    {
      id: '1',
      title: 'Microsoft Teams Integration Project',
      company: 'Microsoft Corporation',
      companyLabel: 'Microsoft Corporation',
      itemType: 'email',
      itemTypeLabel: 'Email',
      personalNote: 'Auto-detected from email domain',
      sender: 'sarah.chen@microsoft.com',
      recipient: 'it-team@ourcompany.com',
      department: 'it',
      departmentLabel: 'IT',
      urgency: 'high',
      urgencyLabel: '🔴 High',
      dateTime: '2025-01-16T10:30:00Z',
      summary: 'Microsoft is proposing a Teams integration project with our existing systems. Timeline is aggressive with Q1 deadline. Requires IT architecture review and security compliance assessment.',
      recommendation: 'Schedule immediate technical review meeting with IT security team. Evaluate integration complexity and resource requirements. Prepare compliance checklist for Microsoft enterprise solutions.',
      content: 'From: Sarah Chen <sarah.chen@microsoft.com>\nTo: it-team@ourcompany.com\nSubject: URGENT: Microsoft Teams Integration Proposal - Q1 Deadline\n\nHi Team,\n\nI hope this email finds you well. I\'m reaching out from Microsoft Corporation regarding the Teams integration project we discussed.\n\nWe need to move quickly on this initiative as the deadline is approaching fast. The integration will require:\n- API connectivity setup\n- Security compliance review\n- User authentication protocols\n- Data migration planning\n\nThis is time-sensitive and requires immediate attention from your IT architecture team.\n\nBest regards,\nSarah Chen\nSenior Solutions Architect\nMicrosoft Corporation'
    },
    {
      id: '2',
      title: 'Goldman Sachs Investment Opportunity',
      company: 'Goldman Sachs',
      companyLabel: 'Goldman Sachs',
      itemType: 'email',
      itemTypeLabel: 'Email',
      personalNote: 'Detected from signature and domain',
      sender: 'james.rodriguez@gs.com',
      recipient: 'cfo@ourcompany.com',
      department: 'finance',
      departmentLabel: 'Finance',
      urgency: 'medium',
      urgencyLabel: '🟡 Medium',
      dateTime: '2025-01-15T14:20:00Z',
      summary: 'Goldman Sachs presenting investment opportunity for portfolio diversification. Minimum investment $5M with projected 12-15% returns. Requires board approval and due diligence review.',
      recommendation: 'Schedule presentation with investment committee. Conduct thorough due diligence review. Prepare risk assessment and financial impact analysis for board consideration.',
      content: 'From: James Rodriguez <james.rodriguez@gs.com>\nTo: cfo@ourcompany.com\nSubject: Investment Opportunity - Portfolio Diversification\n\nDear CFO,\n\nI trust you are doing well. I wanted to present an exclusive investment opportunity that aligns with your company\'s growth strategy.\n\nOur research team has identified a portfolio diversification opportunity with the following highlights:\n- Minimum investment: $5,000,000\n- Projected annual returns: 12-15%\n- Investment horizon: 3-5 years\n- Risk profile: Moderate to high\n\nThis opportunity requires board-level approval and we recommend conducting thorough due diligence.\n\nI would be happy to schedule a presentation with your investment committee.\n\nBest regards,\n\nJames Rodriguez\nVice President, Investment Banking\nGoldman Sachs & Co. LLC'
    },
    {
      id: '3',
      title: 'Salesforce Marketing Campaign Analytics',
      company: 'Salesforce',
      companyLabel: 'Salesforce',
      itemType: 'voice',
      itemTypeLabel: 'Voice Note',
      personalNote: 'Voice note from marketing meeting',
      sender: 'Marketing Team',
      recipient: 'Executive Team',
      department: 'marketing',
      departmentLabel: 'Marketing',
      urgency: 'low',
      urgencyLabel: '🟢 Low',
      dateTime: '2025-01-14T09:15:00Z',
      summary: 'Marketing team reporting on Salesforce campaign performance. Q4 campaigns exceeded targets by 23%. Recommending increased budget allocation for digital advertising and lead nurturing programs.',
      recommendation: 'Approve additional marketing budget for Q1. Expand successful campaign strategies. Consider upgrading Salesforce Marketing Cloud subscription for advanced analytics capabilities.',
      content: 'Voice Note Transcript - Marketing Team Meeting\n\nHey everyone, this is Lisa from the marketing team. I wanted to give you an update on our Salesforce campaign performance for Q4.\n\nThe results have been fantastic - we exceeded our lead generation targets by 23% and our conversion rates improved significantly. The Salesforce Marketing Cloud integration has been a game-changer for our campaign analytics and customer segmentation.\n\nKey highlights:\n- Email campaigns: 34% open rate, 8.2% click-through rate\n- Social media advertising: 156% increase in qualified leads\n- Lead nurturing: 67% improvement in sales-qualified leads\n- Customer acquisition cost decreased by 18%\n\nWe\'re seeing strong ROI on our digital advertising spend, especially in the B2B segment. I recommend we increase our marketing budget for Q1 to capitalize on this momentum.'
    },
    {
      id: '4',
      title: 'TechCorp Budget Meeting Notes',
      company: 'TechCorp Inc',
      companyLabel: 'TechCorp Inc',
      itemType: 'written',
      itemTypeLabel: 'Written Note',
      personalNote: 'Meeting notes from last week',
      sender: 'Executive Team',
      recipient: 'Finance Team',
      department: 'finance',
      departmentLabel: 'Finance',
      urgency: 'high',
      urgencyLabel: '🔴 High',
      dateTime: '2025-01-10T16:00:00Z',
      summary: 'TechCorp budget meeting revealed significant cost overruns in Q4. Need immediate cost reduction measures and revised financial projections for 2025. Emergency board meeting scheduled.',
      recommendation: 'Implement immediate cost reduction measures. Prepare revised budget proposal with 15% cost savings. Schedule emergency board meeting to discuss financial restructuring options.',
      content: 'CONFIDENTIAL - TechCorp Budget Meeting Notes\nDate: January 10, 2025\nAttendees: Executive Team, Finance Team\n\nKey Discussion Points:\n\n1. Q4 Financial Performance\n- Revenue shortfall of 12% compared to projections\n- Operating expenses exceeded budget by 18%\n- Cash flow concerns for Q1 2025\n\n2. Cost Reduction Measures\n- Immediate hiring freeze across all departments\n- Renegotiate vendor contracts for 10-15% savings\n- Defer non-essential capital expenditures\n\n3. Action Items\n- CFO to prepare revised financial projections\n- Emergency board meeting scheduled for January 20\n- Department heads to submit cost reduction proposals\n\nThis information is confidential and should not be shared outside the executive team.'
    },
    {
      id: '5',
      title: 'Apple Partnership Discussion',
      company: 'Apple Inc',
      companyLabel: 'Apple Inc',
      itemType: 'email',
      itemTypeLabel: 'Email',
      personalNote: 'Partnership opportunity',
      sender: 'partnerships@apple.com',
      recipient: 'business-dev@ourcompany.com',
      department: 'executive',
      departmentLabel: 'Executive',
      urgency: 'medium',
      urgencyLabel: '🟡 Medium',
      dateTime: '2025-01-12T11:45:00Z',
      summary: 'Apple exploring strategic partnership opportunities for app ecosystem integration. Potential revenue sharing model with significant market reach benefits.',
      recommendation: 'Schedule executive-level meeting to discuss partnership terms. Prepare competitive analysis and revenue projections. Consider long-term strategic implications for company growth.',
      content: 'From: Apple Partnerships <partnerships@apple.com>\nTo: business-dev@ourcompany.com\nSubject: Strategic Partnership Opportunity - App Ecosystem Integration\n\nDear Business Development Team,\n\nWe hope this message finds you well. Apple is currently exploring strategic partnership opportunities with innovative companies like yours for deeper integration within our app ecosystem.\n\nWe believe there\'s significant potential for collaboration that could benefit both organizations:\n- Access to Apple\'s global user base of over 1 billion active devices\n- Revenue sharing opportunities through App Store integration\n- Co-marketing initiatives and promotional support\n- Technical resources and development support\n\nWe would love to schedule a meeting to discuss this opportunity in more detail and explore how we can work together to create value for our mutual customers.\n\nPlease let us know your availability for a call in the coming weeks.\n\nBest regards,\nApple Partnerships Team'
    }
  ];

  useEffect(() => {
    // Initialize with sample data
    setItems(sampleItems);
    setFilteredItems(sampleItems);
    setLoading(false);
  }, []);

  // Filter items based on current filters
  useEffect(() => {
    let filtered = [...items];

    if (filters.company) {
      filtered = filtered.filter(item => 
        item.company === filters.company || 
        item.companyLabel.toLowerCase().includes(filters.company.toLowerCase())
      );
    }

    if (filters.department) {
      filtered = filtered.filter(item => item.department === filters.department);
    }

    if (filters.urgency) {
      filtered = filtered.filter(item => item.urgency === filters.urgency);
    }

    if (filters.itemType) {
      filtered = filtered.filter(item => item.itemType === filters.itemType);
    }

    if (filters.dateRange) {
      const now = new Date();
      const filterDate = new Date();
      
      switch (filters.dateRange) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          filtered = filtered.filter(item => new Date(item.dateTime) >= filterDate);
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          filtered = filtered.filter(item => new Date(item.dateTime) >= filterDate);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          filtered = filtered.filter(item => new Date(item.dateTime) >= filterDate);
          break;
      }
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchLower) ||
        item.content.toLowerCase().includes(searchLower) ||
        item.summary.toLowerCase().includes(searchLower) ||
        item.companyLabel.toLowerCase().includes(searchLower) ||
        item.sender.toLowerCase().includes(searchLower) ||
        item.recipient.toLowerCase().includes(searchLower)
      );
    }

    setFilteredItems(filtered);
  }, [items, filters]);

  const handleRefresh = async () => {
    setLoading(true);
    try {
      // In a real app, you would fetch from the API
      // const fetchedItems = await fetchInboxItems();
      // setItems(fetchedItems);
      
      // For demo, just refresh with sample data
      setItems(sampleItems);
    } catch (error) {
      console.error('Error refreshing items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleItemAdded = () => {
    setShowAddModal(false);
    handleRefresh();
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Upload Options */}
        <InboxHeader
          totalItems={items.length}
          filteredItems={filteredItems.length}
          onAddItem={() => setShowAddModal(true)}
          onExport={() => setShowExportModal(true)}
          onIntegration={() => setShowIntegrationModal(true)}
        />

        {/* AI Assistant Demo Section */}
        <div className="bg-gray-800/50 backdrop-blur-md border border-blue-500/30 rounded-xl p-8 mb-8">
          <div className="text-center">
            <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-6">
              <Brain className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">AI Knowledge Assistant</h2>
            <p className="text-lg text-gray-300 mb-8 max-w-3xl mx-auto">
              Advanced neural network interface powered by executive intelligence. 
              Click the AI assistant button to start querying your knowledge base with natural language.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              <div className="bg-gray-700/50 backdrop-blur-md border border-blue-500/20 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Activity className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Smart Search</h3>
                </div>
                <p className="text-sm text-gray-300">Natural language queries with instant results from your knowledge base.</p>
              </div>
              
              <div className="bg-gray-700/50 backdrop-blur-md border border-green-500/20 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Company Filtering</h3>
                </div>
                <p className="text-sm text-gray-300">Find all communications related to specific companies like Microsoft, Apple, Goldman Sachs.</p>
              </div>
              
              <div className="bg-gray-700/50 backdrop-blur-md border border-orange-500/20 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Temporal Analysis</h3>
                </div>
                <p className="text-sm text-gray-300">Search by time periods with AI understanding of temporal context.</p>
              </div>
              
              <div className="bg-gray-700/50 backdrop-blur-md border border-purple-500/20 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Dept Classification</h3>
                </div>
                <p className="text-sm text-gray-300">Filter by departments: finance, marketing, IT, operations, and more.</p>
              </div>
              
              <div className="bg-gray-700/50 backdrop-blur-md border border-red-500/20 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Urgency Detection</h3>
                </div>
                <p className="text-sm text-gray-300">Quickly identify urgent items requiring immediate attention.</p>
              </div>
              
              <div className="bg-gray-700/50 backdrop-blur-md border border-yellow-500/20 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
                    <Cpu className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">AI Insights</h3>
                </div>
                <p className="text-sm text-gray-300">Get summaries, recommendations, and contextual insights for each item.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <InboxFilters
          filters={filters}
          onFiltersChange={setFilters}
          items={items}
        />

        {/* Items Grid */}
        <InboxGrid
          items={filteredItems}
          loading={loading}
          onRefresh={handleRefresh}
        />
      </div>

      {/* Modals */}
      {showAddModal && (
        <AddItemModal
          onClose={() => setShowAddModal(false)}
          onItemAdded={handleItemAdded}
        />
      )}

      {showExportModal && (
        <ExportModal
          items={filteredItems}
          onClose={() => setShowExportModal(false)}
        />
      )}

      {showIntegrationModal && (
        <IntegrationModal
          onClose={() => setShowIntegrationModal(false)}
        />
      )}

      {/* AI Assistant - Always available */}
      <AIAssistant items={items} />
    </div>
  );
};