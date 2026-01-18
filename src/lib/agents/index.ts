/**
 * Agents Module
 *
 * Exports all agent configurations and utilities for the multi-agent research system.
 */

export * from './research-agent';

// Re-export commonly used items for convenience
export { agents, executeAgent, executeResearchRequest, routeToAgent } from './research-agent';

// Agent configs
export { searchAgentConfig, analysisAgentConfig, citationAgentConfig, orchestratorAgentConfig } from './research-agent';
