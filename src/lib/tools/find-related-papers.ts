import { z } from 'zod';
import type { PaperSearchResult } from './types';

/**
 * Find Related Papers Tool
 *
 * Finds papers related to a given paper or research topic
 */
export const findRelatedPapersTool = {
  description: 'Find papers that are related to a specific paper (citations, references, similar topics)',
  parameters: z.object({
    paperId: z.string().describe('The paper ID to find related papers for'),
    relationType: z.enum(['citing', 'cited', 'similar']).optional().default('similar').describe('Type of relationship'),
    maxResults: z.number().min(1).max(50).optional().default(10).describe('Maximum number of related papers'),
  }),
  execute: async (params: {
    paperId: string;
    relationType?: string;
    maxResults?: number;
  }): Promise<PaperSearchResult[]> => {
    console.log('[findRelatedPapers] Finding related papers:', params);

    await new Promise((resolve) => setTimeout(resolve, 350));

    return [
      {
        id: 'related-1',
        title: `Related Research: Follow-up Study`,
        authors: ['Dr. Smith'],
        journal: 'Science',
        publishDate: '2024-04-01',
        summary: 'This paper builds upon previous research...',
        url: 'https://example.com/related/1',
      },
    ];
  },
};
