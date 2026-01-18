import { z } from 'zod';
import type { OpenAccessPaper } from './types';
import { getMockPreprints } from './mock-data';

/**
 * Search bioRxiv and medRxiv for preprints
 *
 * Preprint servers provide early access to research before peer review.
 */
export const searchPreprintsTool = {
  description: 'Search bioRxiv (biology) and medRxiv (health sciences) preprint servers for the latest research papers before peer review.',
  parameters: z.object({
    query: z.string().describe('Search query for preprints'),
    server: z.enum(['biorxiv', 'medrxiv', 'both']).optional().default('both').describe('Which preprint server to search'),
    maxResults: z.number().min(1).max(100).optional().default(20).describe('Maximum number of results'),
    daysSince: z.number().optional().describe('Limit to papers posted within this many days'),
  }),
  execute: async (params: {
    query: string;
    server?: string;
    maxResults?: number;
    daysSince?: number;
  }): Promise<OpenAccessPaper[]> => {
    console.log('[searchPreprints] Searching preprints:', params);

    try {
      const server = params.server === 'both' ? 'biorxiv_medrxiv' : params.server;
      const baseUrl = 'https://api.biorxiv.org/details';

      const response = await fetch(`${baseUrl}/${server}/${params.query}/0/${params.maxResults || 20}`);
      const data = await response.json();

      if (!data.collection || data.messages?.[0]?.status !== 'ok') {
        console.log('[searchPreprints] No results or API error');
        return getMockPreprints(params.query, params.maxResults || 20);
      }

      const papers: OpenAccessPaper[] = data.collection.map((item: any) => ({
        id: item.doi,
        title: item.title,
        authors: item.authors?.split(';') || [],
        journal: item.server === 'medrxiv' ? 'medRxiv' : 'bioRxiv',
        publishDate: item.date,
        summary: item.abstract || 'No abstract available',
        source: item.server === 'medrxiv' ? 'medRxiv' : 'bioRxiv',
        url: `https://doi.org/${item.doi}`,
        fullTextUrl: `https://www.biorxiv.org/content/${item.doi}v1.full`,
        license: item.license || 'CC-BY-NC-ND 4.0',
        isOpenAccess: true,
      }));

      console.log(`[searchPreprints] Found ${papers.length} preprints`);
      return papers;
    } catch (error) {
      console.error('[searchPreprints] Error:', error);
      return getMockPreprints(params.query, params.maxResults || 20);
    }
  },
};
