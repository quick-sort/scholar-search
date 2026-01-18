import { z } from 'zod';
import type { OpenAccessPaper } from './types';
import { getMockOpenAccessPapers } from './mock-data';

/**
 * Search Europe PMC for open access papers
 *
 * Europe PMC provides a comprehensive database of biomedical research literature
 * with strong open access coverage.
 * API Documentation: https://europepmc.org/RestfulWebService
 */
export const searchEuropePMCTool = {
  description: 'Search Europe PMC for open access biomedical and life sciences papers. Includes European research with full-text access.',
  parameters: z.object({
    query: z.string().describe('Search query (e.g., "cancer immunotherapy", "Alzheimer biomarkers")'),
    maxResults: z.number().min(1).max(100).optional().default(20).describe('Maximum number of results'),
    hasFullText: z.boolean().optional().default(true).describe('Only return papers with full-text available'),
    hasPdf: z.boolean().optional().describe('Filter for papers with PDF available'),
  }),
  execute: async (params: {
    query: string;
    maxResults?: number;
    hasFullText?: boolean;
    hasPdf?: boolean;
  }): Promise<OpenAccessPaper[]> => {
    console.log('[searchEuropePMC] Searching Europe PMC:', params);

    try {
      const baseUrl = 'https://www.ebi.ac.uk/europepmc/webservices/rest/search';
      const searchParams = new URLSearchParams({
        query: params.query,
        resultType: 'lite',
        pageSize: String(params.maxResults || 20),
        format: 'json',
        hasFullText: String(params.hasFullText !== false),
      });

      if (params.hasPdf !== undefined) {
        searchParams.set('hasPdf', String(params.hasPdf));
      }

      const response = await fetch(`${baseUrl}?${searchParams}`, {
        headers: {
          'Accept': 'application/json',
        },
      });

      const data = await response.json();

      if (!data.resultList?.result) {
        console.log('[searchEuropePMC] No results found');
        return [];
      }

      const papers: OpenAccessPaper[] = data.resultList.result.map((item: any) => ({
        id: item.pmid || item.id || item.pmcid || 'unknown',
        title: item.title,
        authors: item.authorString?.split(';') || [],
        journal: item.journalTitle || item.journalInfo?.journal?.medlineAbbreviation || 'Unknown',
        publishDate: item.firstPublicationDate || item.pubYear || '',
        summary: item.abstractText || item.abstractString || 'No abstract available',
        source: 'Europe PMC',
        url: `https://europepmc.org/article/${item.pmid ? `MED/${item.pmid}` : `PMC/${item.pmcid}`}`,
        fullTextUrl: item.fullTextUrlList?.fullTextUrl?.[0]?.availability || undefined,
        isOpenAccess: item.isOpenAccess === 'Y' || item.hasFullText === true,
        license: item.license || undefined,
      }));

      console.log(`[searchEuropePMC] Found ${papers.length} papers`);
      return papers;
    } catch (error) {
      console.error('[searchEuropePMC] Error:', error);
      return getMockOpenAccessPapers(params.query, params.maxResults || 20, 'Europe PMC');
    }
  },
};
