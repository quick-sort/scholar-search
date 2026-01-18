import type { OpenAccessPaper } from './types';

/**
 * Mock data generators for development
 */

/**
 * Get mock open access papers for development
 */
export function getMockOpenAccessPapers(query: string, count: number, source: string): OpenAccessPaper[] {
  const mockPapers: OpenAccessPaper[] = [
    {
      id: 'PMC1234567',
      title: `Open Access Research on ${query}: Mechanisms and Therapeutic Applications`,
      authors: ['Dr. Sarah Chen', 'Prof. Michael Rodriguez', 'Dr. Emily Watson'],
      journal: 'Nature Communications',
      publishDate: '2024-03-15',
      summary: `This open-access study investigates the mechanisms underlying ${query} and explores potential therapeutic applications. The research demonstrates significant findings with implications for clinical practice. Full text is freely available under CC-BY license.`,
      source,
      url: `https://www.ncbi.nlm.nih.gov/pmc/PMC1234567/`,
      fullTextUrl: `https://www.ncbi.nlm.nih.gov/pmc/PMC1234567/`,
      license: 'CC-BY 4.0',
      isOpenAccess: true,
    },
    {
      id: 'PMC7654321',
      title: `Systematic Review of ${query} in Clinical Practice: An Open Access Analysis`,
      authors: ['Dr. James Liu', 'Dr. Anna Martinez'],
      journal: 'PLOS Medicine',
      publishDate: '2024-02-20',
      summary: `A comprehensive systematic review examining the efficacy of ${query} interventions. This open-access publication includes detailed meta-analysis of randomized controlled trials. All data and supplementary materials are freely available.`,
      source,
      url: `https://www.ncbi.nlm.nih.gov/pmc/PMC7654321/`,
      fullTextUrl: `https://www.ncbi.nlm.nih.gov/pmc/PMC7654321/`,
      license: 'CC-BY-NC 4.0',
      isOpenAccess: true,
    },
    {
      id: 'PMC9876543',
      title: `Advances in ${query} Research: Open Access Perspectives`,
      authors: ['Prof. Maria Garcia', 'Dr. Thomas Anderson'],
      journal: 'Science Advances',
      publishDate: '2024-01-10',
      summary: `This study presents novel findings in ${query} research, with complete methodology and data openly available. The research includes reproducible protocols and shared datasets.`,
      source,
      url: `https://www.ncbi.nlm.nih.gov/pmc/PMC9876543/`,
      fullTextUrl: `https://www.ncbi.nlm.nih.gov/pmc/PMC9876543/`,
      license: 'CC-BY 4.0',
      isOpenAccess: true,
    },
  ];

  return mockPapers.slice(0, Math.min(count, mockPapers.length));
}

/**
 * Get mock preprints for development
 */
export function getMockPreprints(query: string, count: number): OpenAccessPaper[] {
  return [
    {
      id: '2024.01.123456',
      title: `[PREPRINT] ${query}: Novel Approaches and Preliminary Findings`,
      authors: ['Dr. John Smith', 'Dr. Jane Doe'],
      journal: 'bioRxiv',
      publishDate: '2024-03-01',
      summary: `This preprint presents preliminary findings on ${query}. Research is ongoing and findings have not yet been peer-reviewed. Early results suggest promising directions for future investigation.`,
      source: 'bioRxiv',
      url: 'https://doi.org/10.1101/2024.01.123456',
      fullTextUrl: 'https://www.biorxiv.org/content/10.1101/2024.01.123456v1.full',
      license: 'CC-BY-NC-ND 4.0',
      isOpenAccess: true as const,
    },
  ].slice(0, count) as OpenAccessPaper[];
}
