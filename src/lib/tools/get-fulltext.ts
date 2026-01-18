import { z } from 'zod';
import type { FullTextPaper } from './types';

/**
 * Get full text from PMC
 *
 * Fetches the full text of an open access article from PMC.
 */
export const getFullTextTool = {
  description: 'Retrieve the full text of an open access paper from PubMed Central using its PMC ID.',
  parameters: z.object({
    pmcId: z.string().describe('PMC ID (e.g., "PMC1234567")'),
    format: z.enum(['plain', 'markdown', 'json']).optional().default('markdown').describe('Output format'),
  }),
  execute: async (params: {
    pmcId: string;
    format?: string;
  }): Promise<FullTextPaper> => {
    console.log('[getFullText] Fetching full text for:', params.pmcId);

    try {
      // Extract numeric ID from PMC ID
      const numericId = params.pmcId.replace('PMC', '');
      const url = `https://www.ncbi.nlm.nih.gov/pmc/oai/oai.cgi?verb=GetRecord&identifier=oai:pubmedcentral.nih.gov:${numericId}&format=xml`;

      const response = await fetch(url);
      const xmlText = await response.text();

      // Parse XML to extract full text (simplified - in production use a proper XML parser)
      const titleMatch = xmlText.match(/<article-title>(.*?)<\/article-title>/);
      const title = titleMatch ? titleMatch[1].replace(/<[^>]*>/g, '') : 'Unknown Title';

      // Extract body text (simplified extraction)
      const bodyMatch = xmlText.match(/<body>([\s\S]*?)<\/body>/);
      let fullText = bodyMatch ? bodyMatch[1] : 'Full text not available';

      // Remove XML tags and format as plain text
      fullText = fullText
        .replace(/<[^>]*>/g, '')
        .replace(/\s+/g, ' ')
        .trim();

      // Simple section extraction
      const sections: Array<{ title: string; content: string }> = [];
      const sectionMatches = xmlText.matchAll(/<title content-type="section">([^<]+)<\/title>\s*<p>([^<]+)<\/p>/g);

      for (const match of sectionMatches) {
        sections.push({
          title: match[1],
          content: match[2],
        });
      }

      console.log(`[getFullText] Retrieved ${fullText.length} characters`);
      return {
        pmcId: params.pmcId,
        title,
        fullText,
        sections,
      };
    } catch (error) {
      console.error('[getFullText] Error:', error);
      throw new Error(`Failed to retrieve full text for ${params.pmcId}`);
    }
  },
};
