/**
 * Tools Module
 *
 * Exports all tool definitions for the AI agent system.
 * Each tool is now in its own file for better maintainability.
 */

// Export shared types
export * from './types';

// Export individual research tools
export { searchPapersTool } from './search-papers';
export { summarizePapersTool } from './summarize-papers';
export { extractCitationsTool } from './extract-citations';
export { comparePapersTool } from './compare-papers';
export { findRelatedPapersTool } from './find-related-papers';

// Export individual open access tools
export { searchPMCTool } from './search-pmc';
export { searchEuropePMCTool } from './search-europe-pmc';
export { searchPreprintsTool } from './search-preprints';
export { getFullTextTool } from './get-fulltext';

// Import tools for registries
import { searchPapersTool as spTool } from './search-papers';
import { summarizePapersTool as sumTool } from './summarize-papers';
import { extractCitationsTool as citTool } from './extract-citations';
import { comparePapersTool as compTool } from './compare-papers';
import { findRelatedPapersTool as frTool } from './find-related-papers';
import { searchPMCTool as spmcTool } from './search-pmc';
import { searchEuropePMCTool as sepmcTool } from './search-europe-pmc';
import { searchPreprintsTool as sprepTool } from './search-preprints';
import { getFullTextTool as gftTool } from './get-fulltext';

// Research tools registry
export const researchTools = {
  searchPapers: spTool,
  summarizePapers: sumTool,
  extractCitations: citTool,
  comparePapers: compTool,
  findRelatedPapers: frTool,
};

// Open access tools registry
export const openAccessTools = {
  searchPMC: spmcTool,
  searchEuropePMC: sepmcTool,
  searchPreprints: sprepTool,
  getFullText: gftTool,
};

/**
 * Get tool definitions for use with AI SDK
 * Converts tool definitions to the format expected by generateText/streamText
 */
export function getToolDefinitions() {
  return {
    searchPapers: {
      description: researchTools.searchPapers.description,
      inputSchema: researchTools.searchPapers.parameters,
    },
    summarizePapers: {
      description: researchTools.summarizePapers.description,
      inputSchema: researchTools.summarizePapers.parameters,
    },
    extractCitations: {
      description: researchTools.extractCitations.description,
      inputSchema: researchTools.extractCitations.parameters,
    },
    comparePapers: {
      description: researchTools.comparePapers.description,
      inputSchema: researchTools.comparePapers.parameters,
    },
    findRelatedPapers: {
      description: researchTools.findRelatedPapers.description,
      inputSchema: researchTools.findRelatedPapers.parameters,
    },
  };
}

/**
 * Get open access tool definitions for AI SDK integration
 */
export function getOpenAccessToolDefinitions() {
  return {
    searchPMC: {
      description: openAccessTools.searchPMC.description,
      inputSchema: openAccessTools.searchPMC.parameters,
    },
    searchEuropePMC: {
      description: openAccessTools.searchEuropePMC.description,
      inputSchema: openAccessTools.searchEuropePMC.parameters,
    },
    searchPreprints: {
      description: openAccessTools.searchPreprints.description,
      inputSchema: openAccessTools.searchPreprints.parameters,
    },
    getFullText: {
      description: openAccessTools.getFullText.description,
      inputSchema: openAccessTools.getFullText.parameters,
    },
  };
}
