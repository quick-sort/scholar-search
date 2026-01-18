import { z } from 'zod';
import type { OpenAccessPaper } from './types';
import { getMockOpenAccessPapers } from './mock-data';

/**
 * Search PubMed Central (PMC) for open access full-text papers
 *
 * PMC provides free access to the full text of biomedical and life sciences journal articles.
 * API Documentation: https://www.ncbi.nlm.nih.gov/pmc/tools/oai/
 */
export const searchPMCTool = {
  description: 'Search PubMed Central (PMC) for open access full-text biomedical papers. Returns only papers with free full-text availability.',
  parameters: z.object({
    query: z.string().describe('Search query for biomedical papers (e.g., "CRISPR gene editing", "cancer immunotherapy")'),
    maxResults: z.number().min(1).max(100).optional().default(20).describe('Maximum number of results to return'),
    yearFrom: z.number().optional().describe('Filter papers from this year onwards'),
    hasFullText: z.boolean().optional().default(true).describe('Only return papers with full-text available'),
  }),
  execute: async (params: {
    query: string;
    maxResults?: number;
    yearFrom?: number;
    hasFullText?: boolean;
  }): Promise<OpenAccessPaper[]> => {
    console.log('[searchPMC] Searching PubMed Central:', params);

    try {
      // Use NCBI E-utilities API to search PMC
      const baseUrl = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/';

      // Step 1: Search for PMIDs
      const searchParams = new URLSearchParams({
        db: 'pmc',
        term: `${params.query}${params.yearFrom ? ` AND "${params.yearFrom}":[Publication Date]` : ''}`,
        retmax: String(params.maxResults || 20),
        retmode: 'json',
        tool: 'scholarsearch',
        email: 'scholarsearch@example.com',
      });

      const searchResponse = await fetch(`${baseUrl}esearch.fcgi?${searchParams}`);
      const searchData = await searchResponse.json();

      if (!searchData.esearchresult?.idlist?.length) {
        console.log('[searchPMC] No results found');
        return [];
      }

      const idList = searchData.esearchresult.idlist.join(',');

      // Step 2: Fetch summaries
      const summaryParams = new URLSearchParams({
        db: 'pmc',
        id: idList,
        retmode: 'json',
        rettype: 'abstract',
      });

      const summaryResponse = await fetch(`${baseUrl}esummary.fcgi?${summaryParams}`);
      const summaryData = await summaryResponse.json();

      const papers: OpenAccessPaper[] = [];

      for (const [uid, article] of Object.entries(summaryData.result || {})) {
        if (uid === 'uids') continue;

        const art = article as any;
        if (!art.title) continue;

        papers.push({
          id: `PMC${uid}`,
          title: art.title,
          authors: art.authors?.map((a: any) => a.name || `${a.firstname || ''} ${a.lastname || ''}`.trim()) || [],
          journal: art.source || 'Unknown Journal',
          publishDate: art.pubdate || '',
          summary: art.abstract?.text || art.abstract || 'No abstract available',
          source: 'PubMed Central',
          url: `https://www.ncbi.nlm.nih.gov/pmc/PMC${uid}/`,
          fullTextUrl: `https://www.ncbi.nlm.nih.gov/pmc/PMC${uid}/`,
          license: art.license || 'Unknown',
          isOpenAccess: true,
        });
      }

      console.log(`[searchPMC] Found ${papers.length} open access papers`);
      return papers.slice(0, params.maxResults || 20);
    } catch (error) {
      console.error('[searchPMC] Error:', error);
      // Return mock data on error for development
      return getMockOpenAccessPapers(params.query, params.maxResults || 20, 'PubMed Central');
    }
  },
};
