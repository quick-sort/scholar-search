/**
 * Shared Types for Research Tools
 *
 * Common type definitions used across all tool implementations.
 */

/**
 * Paper search result from academic databases
 */
export interface PaperSearchResult {
  id: string;
  title: string;
  authors: string[];
  journal: string;
  publishDate: string;
  summary: string;
  url?: string;
}

/**
 * Open access paper with additional metadata
 */
export interface OpenAccessPaper {
  id: string;
  title: string;
  authors: string[];
  journal: string;
  publishDate: string;
  summary: string;
  source: string;
  url: string;
  fullTextUrl?: string;
  license?: string;
  isOpenAccess: true;
}

/**
 * Paper comparison result
 */
export interface PaperComparison {
  paperIds: string[];
  comparison: Record<string, string>;
}

/**
 * Full text paper with sections
 */
export interface FullTextPaper {
  pmcId: string;
  title: string;
  fullText: string;
  sections: Array<{ title: string; content: string }>;
}
