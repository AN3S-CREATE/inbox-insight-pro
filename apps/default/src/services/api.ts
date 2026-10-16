import { InboxItem } from '../types/inbox';
import { DeduplicationService } from './deduplication';

const API_BASE = '/api/taskade';

// Company mappings - now includes detected companies
const COMPANY_LABELS: Record<string, string> = {
  'comp-1': 'TechCorp Inc',
  'comp-2': 'Global Solutions',
  'comp-3': 'Innovation Labs',
  'comp-4': 'DataFlow Systems',
  'comp-5': 'CloudTech Partners',
  'comp-6': 'NextGen Ventures',
  'comp-7': 'Smart Industries',
  'comp-8': 'Digital Dynamics',
  'comp-9': 'Future Systems',
  'comp-10': 'Alpha Enterprises'
};

// Department mappings
const DEPARTMENT_LABELS: Record<string, string> = {
  'finance': 'Finance',
  'marketing': 'Marketing',
  'operations': 'Operations',
  'hr': 'Human Resources',
  'it': 'IT',
  'sales': 'Sales',
  'legal': 'Legal',
  'executive': 'Executive'
};

// Item type mappings
const ITEM_TYPE_LABELS: Record<string, string> = {
  'email': 'Email',
  'voice': 'Voice Note',
  'written': 'Written Note'
};

// Urgency mappings
const URGENCY_LABELS: Record<string, string> = {
  'low': '🟢 Low',
  'medium': '🟡 Medium',
  'high': '🔴 High'
};

// Helper function to extract company from email domain
const extractCompanyFromEmail = (email: string): string => {
  if (!email) return '';
  
  const domain = email.split('@')[1];
  if (!domain) return '';
  
  // Remove common email providers
  const commonProviders = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com'];
  if (commonProviders.includes(domain.toLowerCase())) {
    return '';
  }
  
  // Extract company name from domain
  const companyName = domain.split('.')[0];
  return companyName.charAt(0).toUpperCase() + companyName.slice(1);
};

// Helper function to find matching company ID
const findCompanyId = (detectedCompany: string): string => {
  if (!detectedCompany) return '';
  
  const normalizedDetected = detectedCompany.toLowerCase();
  
  // First, try exact matches with existing companies
  for (const [id, label] of Object.entries(COMPANY_LABELS)) {
    if (label.toLowerCase().includes(normalizedDetected) || 
        normalizedDetected.includes(label.toLowerCase())) {
      return id;
    }
  }
  
  // If no match found, we'll store the detected company name directly
  return detectedCompany;
};

export const fetchInboxItems = async (): Promise<InboxItem[]> => {
  try {
    const response = await fetch(`${API_BASE}/projects/J2FLBt8mpBfcVmVp/nodes`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.ok || !data.payload?.nodes) {
      throw new Error('Invalid response format');
    }

    return data.payload.nodes.map((node: any): InboxItem => {
      const companyValue = node.fieldValues['/attributes/@comp1'] || '';
      const companyLabel = COMPANY_LABELS[companyValue] || companyValue || 'Unknown Company';
      
      return {
        id: node.id,
        title: node.fieldValues['/text'] || 'Untitled Item',
        company: companyValue,
        companyLabel: companyLabel,
        itemType: node.fieldValues['/attributes/@type1'] || 'email',
        itemTypeLabel: ITEM_TYPE_LABELS[node.fieldValues['/attributes/@type1']] || 'Email',
        personalNote: node.fieldValues['/attributes/@note1'] || '',
        sender: node.fieldValues['/attributes/@send1'] || '',
        recipient: node.fieldValues['/attributes/@recv1'] || '',
        department: node.fieldValues['/attributes/@dept1'] || '',
        departmentLabel: DEPARTMENT_LABELS[node.fieldValues['/attributes/@dept1']] || 'Unknown Department',
        urgency: node.fieldValues['/attributes/@urg1'] || 'low',
        urgencyLabel: URGENCY_LABELS[node.fieldValues['/attributes/@urg1']] || '🟢 Low',
        dateTime: node.fieldValues['/attributes/@date1'] || new Date().toISOString(),
        summary: node.fieldValues['/attributes/@summ1'] || '',
        recommendation: node.fieldValues['/attributes/@rec1'] || '',
        content: node.fieldValues['/attributes/@cont1'] || ''
      };
    });
  } catch (error) {
    console.error('Error fetching inbox items:', error);
    throw error;
  }
};

export const createInboxItem = async (itemData: {
  title: string;
  company?: string;
  itemType: string;
  personalNote: string;
  sender: string;
  recipient: string;
  content: string;
}): Promise<{ success: boolean; message: string; isDuplicate: boolean }> => {
  try {
    // First, get existing items for deduplication check
    const existingItems = await fetchInboxItems();

    // First, analyze the item using the enhanced automation workflow
    const analysisResponse = await fetch(`${API_BASE}/webhooks/01K38JDHRFTA1TTKEJF8Z5XCPW/run`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: itemData.content,
        itemType: itemData.itemType,
        sender: itemData.sender,
        recipient: itemData.recipient,
        personalNote: itemData.personalNote,
        company: itemData.company || ''
      })
    });

    if (!analysisResponse.ok) {
      throw new Error(`Analysis failed: ${analysisResponse.status}`);
    }

    const analysisResult = await analysisResponse.json();
    console.log('Enhanced analysis result:', analysisResult);

    // Extract AI analysis results
    let detectedCompany = itemData.company || '';
    let department = 'executive';
    let urgency = 'medium';
    let summary = 'AI analysis pending...';
    let recommendation = 'Please review this item for further action.';

    if (analysisResult.body) {
      detectedCompany = analysisResult.body.detectedCompany || detectedCompany;
      department = analysisResult.body.detectedDepartment || department;
      urgency = analysisResult.body.detectedUrgency || urgency;
      summary = analysisResult.body.summary || summary;
      recommendation = analysisResult.body.recommendation || recommendation;
    }

    // If no company was provided or detected, try to extract from email
    if (!detectedCompany && itemData.sender) {
      detectedCompany = extractCompanyFromEmail(itemData.sender);
    }

    // Find the best matching company ID
    const companyId = findCompanyId(detectedCompany);

    // Create the new item object for deduplication check
    const newItem: InboxItem = {
      id: 'temp-id',
      title: itemData.title,
      company: companyId,
      companyLabel: COMPANY_LABELS[companyId] || companyId || 'Unknown Company',
      itemType: itemData.itemType as any,
      itemTypeLabel: ITEM_TYPE_LABELS[itemData.itemType] || itemData.itemType,
      personalNote: itemData.personalNote,
      sender: itemData.sender,
      recipient: itemData.recipient,
      department: department,
      departmentLabel: DEPARTMENT_LABELS[department] || department,
      urgency: urgency as any,
      urgencyLabel: URGENCY_LABELS[urgency] || urgency,
      dateTime: new Date().toISOString(),
      summary: summary,
      recommendation: recommendation,
      content: itemData.content
    };

    // Check for duplicates
    const duplicateMatches = DeduplicationService.findDuplicates(newItem, existingItems);
    const deduplicationReport = DeduplicationService.generateDeduplicationReport(duplicateMatches);

    console.log('Deduplication report:', deduplicationReport);

    if (duplicateMatches.length > 0) {
      // Handle duplicate - merge with existing item
      const bestMatch = duplicateMatches[0];
      const mergedItem = DeduplicationService.mergeItems(newItem, bestMatch.existingItem);

      // Update the existing item instead of creating new one
      const updateResponse = await fetch(`${API_BASE}/projects/J2FLBt8mpBfcVmVp/nodes/${bestMatch.existingItem.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          '/text': mergedItem.title,
          '/attributes/@comp1': mergedItem.company,
          '/attributes/@type1': mergedItem.itemType,
          '/attributes/@note1': mergedItem.personalNote,
          '/attributes/@send1': mergedItem.sender,
          '/attributes/@recv1': mergedItem.recipient,
          '/attributes/@dept1': mergedItem.department,
          '/attributes/@urg1': mergedItem.urgency,
          '/attributes/@date1': mergedItem.dateTime,
          '/attributes/@summ1': mergedItem.summary,
          '/attributes/@rec1': mergedItem.recommendation,
          '/attributes/@cont1': mergedItem.content
        })
      });

      if (!updateResponse.ok) {
        console.warn('Failed to update existing item, creating new one instead');
        // Fall through to create new item
      } else {
        return {
          success: true,
          message: `Item merged with existing entry (${Math.round(bestMatch.similarity * 100)}% similarity). ${deduplicationReport}`,
          isDuplicate: true
        };
      }
    }

    // Create new item (no duplicates found or merge failed)
    const createResponse = await fetch(`${API_BASE}/projects/J2FLBt8mpBfcVmVp/nodes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        '/text': itemData.title,
        '/attributes/@comp1': companyId,
        '/attributes/@type1': itemData.itemType,
        '/attributes/@note1': itemData.personalNote,
        '/attributes/@send1': itemData.sender,
        '/attributes/@recv1': itemData.recipient,
        '/attributes/@dept1': department,
        '/attributes/@urg1': urgency,
        '/attributes/@date1': new Date().toISOString(),
        '/attributes/@summ1': summary,
        '/attributes/@rec1': recommendation,
        '/attributes/@cont1': itemData.content
      })
    });

    if (!createResponse.ok) {
      throw new Error(`Create failed: ${createResponse.status}`);
    }

    return {
      success: true,
      message: 'New item created successfully. ' + deduplicationReport,
      isDuplicate: false
    };

  } catch (error) {
    console.error('Error creating inbox item:', error);
    throw error;
  }
};

// Enhanced search function for AI assistant
export const searchInboxItems = async (query: string, filters?: {
  company?: string;
  department?: string;
  urgency?: string;
  dateRange?: string;
}): Promise<InboxItem[]> => {
  try {
    const allItems = await fetchInboxItems();
    let filteredItems = [...allItems];

    // Apply filters
    if (filters?.company) {
      filteredItems = filteredItems.filter(item => 
        item.company.toLowerCase().includes(filters.company!.toLowerCase()) ||
        item.companyLabel.toLowerCase().includes(filters.company!.toLowerCase())
      );
    }

    if (filters?.department) {
      filteredItems = filteredItems.filter(item => 
        item.department === filters.department ||
        item.departmentLabel.toLowerCase().includes(filters.department!.toLowerCase())
      );
    }

    if (filters?.urgency) {
      filteredItems = filteredItems.filter(item => item.urgency === filters.urgency);
    }

    if (filters?.dateRange) {
      const now = new Date();
      const filterDate = new Date();
      
      switch (filters.dateRange) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          filteredItems = filteredItems.filter(item => new Date(item.dateTime) >= filterDate);
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          filteredItems = filteredItems.filter(item => new Date(item.dateTime) >= filterDate);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          filteredItems = filteredItems.filter(item => new Date(item.dateTime) >= filterDate);
          break;
        case 'last_month':
          const lastMonth = new Date();
          lastMonth.setMonth(now.getMonth() - 1);
          const startOfLastMonth = new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1);
          const endOfLastMonth = new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 0);
          filteredItems = filteredItems.filter(item => {
            const itemDate = new Date(item.dateTime);
            return itemDate >= startOfLastMonth && itemDate <= endOfLastMonth;
          });
          break;
      }
    }

    // Text search
    if (query) {
      const queryLower = query.toLowerCase();
      const searchTerms = queryLower.split(' ').filter(term => term.length > 2);
      
      filteredItems = filteredItems.filter(item => {
        const searchableText = `
          ${item.title} ${item.content} ${item.summary} ${item.recommendation} 
          ${item.companyLabel} ${item.departmentLabel} ${item.sender} ${item.recipient}
          ${item.personalNote}
        `.toLowerCase();
        
        return searchTerms.some(term => searchableText.includes(term));
      });
    }

    // Sort by relevance and date
    return filteredItems.sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());

  } catch (error) {
    console.error('Error searching inbox items:', error);
    throw error;
  }
};

// New function to get detected companies for dynamic filtering
export const getDetectedCompanies = async (): Promise<Array<{value: string, label: string}>> => {
  try {
    const items = await fetchInboxItems();
    const companies = new Set<string>();
    
    items.forEach(item => {
      if (item.company && item.companyLabel) {
        companies.add(JSON.stringify({value: item.company, label: item.companyLabel}));
      }
    });
    
    return Array.from(companies).map(company => JSON.parse(company));
  } catch (error) {
    console.error('Error getting detected companies:', error);
    return [];
  }
};