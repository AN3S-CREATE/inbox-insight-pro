import { InboxItem } from '../types/inbox';

export interface DuplicateMatch {
  existingItem: InboxItem;
  similarity: number;
  matchType: 'exact' | 'similar' | 'thread';
}

export class DeduplicationService {
  private static readonly SIMILARITY_THRESHOLD = 0.8;
  private static readonly EXACT_MATCH_THRESHOLD = 0.95;

  /**
   * Calculate similarity between two strings using Jaccard similarity
   */
  private static calculateSimilarity(str1: string, str2: string): number {
    const normalize = (str: string) => 
      str.toLowerCase()
         .replace(/[^\w\s]/g, ' ')
         .replace(/\s+/g, ' ')
         .trim();

    const text1 = normalize(str1);
    const text2 = normalize(str2);

    if (text1 === text2) return 1.0;

    const words1 = new Set(text1.split(' '));
    const words2 = new Set(text2.split(' '));

    const intersection = new Set([...words1].filter(word => words2.has(word)));
    const union = new Set([...words1, ...words2]);

    return intersection.size / union.size;
  }

  /**
   * Check if two items are from the same email thread
   */
  private static isEmailThread(item1: InboxItem, item2: InboxItem): boolean {
    if (item1.itemType !== 'email' || item2.itemType !== 'email') {
      return false;
    }

    // Check if same sender/recipient pair
    const sameParticipants = (
      (item1.sender === item2.sender && item1.recipient === item2.recipient) ||
      (item1.sender === item2.recipient && item1.recipient === item2.sender)
    );

    // Check if subjects are similar (accounting for Re:, Fwd:, etc.)
    const normalizeSubject = (subject: string) => 
      subject.replace(/^(re:|fwd:|fw:)\s*/i, '').trim().toLowerCase();

    const subject1 = normalizeSubject(item1.title);
    const subject2 = normalizeSubject(item2.title);
    const subjectSimilarity = this.calculateSimilarity(subject1, subject2);

    return sameParticipants && subjectSimilarity > 0.7;
  }

  /**
   * Find potential duplicates for a new item
   */
  static findDuplicates(newItem: InboxItem, existingItems: InboxItem[]): DuplicateMatch[] {
    const matches: DuplicateMatch[] = [];

    for (const existingItem of existingItems) {
      // Skip if different item types (unless both are emails)
      if (newItem.itemType !== existingItem.itemType && 
          !(newItem.itemType === 'email' && existingItem.itemType === 'email')) {
        continue;
      }

      // Check for exact content match
      const contentSimilarity = this.calculateSimilarity(newItem.content, existingItem.content);
      const titleSimilarity = this.calculateSimilarity(newItem.title, existingItem.title);

      // Exact match detection
      if (contentSimilarity >= this.EXACT_MATCH_THRESHOLD) {
        matches.push({
          existingItem,
          similarity: contentSimilarity,
          matchType: 'exact'
        });
        continue;
      }

      // Email thread detection
      if (this.isEmailThread(newItem, existingItem)) {
        matches.push({
          existingItem,
          similarity: Math.max(contentSimilarity, titleSimilarity),
          matchType: 'thread'
        });
        continue;
      }

      // Similar content detection
      const combinedSimilarity = (contentSimilarity * 0.7) + (titleSimilarity * 0.3);
      if (combinedSimilarity >= this.SIMILARITY_THRESHOLD) {
        matches.push({
          existingItem,
          similarity: combinedSimilarity,
          matchType: 'similar'
        });
      }
    }

    // Sort by similarity score (highest first)
    return matches.sort((a, b) => b.similarity - a.similarity);
  }

  /**
   * Merge two items, keeping the most recent information
   */
  static mergeItems(newItem: InboxItem, existingItem: InboxItem): InboxItem {
    const newDate = new Date(newItem.dateTime);
    const existingDate = new Date(existingItem.dateTime);
    const useNewItem = newDate >= existingDate;

    return {
      id: existingItem.id, // Keep existing ID
      title: useNewItem ? newItem.title : existingItem.title,
      company: useNewItem ? newItem.company : existingItem.company,
      companyLabel: useNewItem ? newItem.companyLabel : existingItem.companyLabel,
      itemType: useNewItem ? newItem.itemType : existingItem.itemType,
      itemTypeLabel: useNewItem ? newItem.itemTypeLabel : existingItem.itemTypeLabel,
      personalNote: this.mergePersistentFields(newItem.personalNote, existingItem.personalNote),
      sender: useNewItem ? newItem.sender : existingItem.sender,
      recipient: useNewItem ? newItem.recipient : existingItem.recipient,
      department: useNewItem ? newItem.department : existingItem.department,
      departmentLabel: useNewItem ? newItem.departmentLabel : existingItem.departmentLabel,
      urgency: useNewItem ? newItem.urgency : existingItem.urgency,
      urgencyLabel: useNewItem ? newItem.urgencyLabel : existingItem.urgencyLabel,
      dateTime: useNewItem ? newItem.dateTime : existingItem.dateTime,
      summary: useNewItem ? newItem.summary : existingItem.summary,
      recommendation: useNewItem ? newItem.recommendation : existingItem.recommendation,
      content: this.mergeContent(newItem.content, existingItem.content, useNewItem)
    };
  }

  /**
   * Merge persistent fields (like personal notes) to avoid losing information
   */
  private static mergePersistentFields(newValue: string, existingValue: string): string {
    if (!newValue && !existingValue) return '';
    if (!newValue) return existingValue;
    if (!existingValue) return newValue;
    
    // If they're different, combine them
    if (newValue !== existingValue) {
      return `${existingValue} | Updated: ${newValue}`;
    }
    
    return newValue;
  }

  /**
   * Merge content, handling email threads and updates
   */
  private static mergeContent(newContent: string, existingContent: string, useNewItem: boolean): string {
    if (useNewItem) {
      // For email threads, append new content
      if (newContent.includes('Subject:') && existingContent.includes('Subject:')) {
        return `${existingContent}\n\n--- THREAD UPDATE ---\n${newContent}`;
      }
      return newContent;
    }
    
    return existingContent;
  }

  /**
   * Generate a deduplication report
   */
  static generateDeduplicationReport(matches: DuplicateMatch[]): string {
    if (matches.length === 0) {
      return 'No duplicates found. Item will be added as new.';
    }

    const bestMatch = matches[0];
    const matchTypeLabels = {
      exact: 'Exact duplicate',
      similar: 'Similar content',
      thread: 'Email thread continuation'
    };

    return `Found ${matches.length} potential duplicate(s). Best match: ${matchTypeLabels[bestMatch.matchType]} (${Math.round(bestMatch.similarity * 100)}% similarity). Item will be merged with existing entry.`;
  }
}