import { getModel, CHAT_MODEL, FAST_MODEL } from '@/lib/ai';
import { generateText } from 'ai';
import { researchTools, openAccessTools } from '@/lib/tools';

/**
 * Multi-Agent Research System
 *
 * This module implements a multi-agent system for academic research assistance.
 * Each agent has a specialized role and works together to accomplish complex research tasks.
 */

/**
 * Base Agent Configuration
 */
interface AgentConfig {
  name: string;
  role: string;
  systemPrompt: string;
  model?: string;
  temperature?: number;
}

/**
 * Research Agent Types
 */

/**
 * Search Agent - Specialized in finding relevant papers
 */
export const searchAgentConfig: AgentConfig = {
  name: 'Search Agent',
  role: 'search',
  systemPrompt: `You are a Research Search Agent specializing in academic literature discovery.

Your role is to help users find the most relevant research papers for their needs. You can:

**Open Access Biomedical Resources:**
- Search PubMed Central (PMC) for free full-text papers using searchPMC
- Search Europe PMC for international open access research using searchEuropePMC
- Find preprints on bioRxiv and medRxiv using searchPreprints
- Retrieve full text from open access papers using getFullText

**General Academic Databases:**
- Search multiple academic databases (PubMed, Google Scholar, Embase) using searchPapers
- Filter results by source, date, and other criteria

**Key Advantages of Open Access Tools:**
- PMC and Europe PMC provide FREE full-text access
- No paywalls - complete papers available immediately
- getFullText can retrieve complete article text for deep analysis
- Preprints show latest research before peer review

When helping users:
1. Prioritize open access tools (searchPMC, searchEuropePMC) for immediate full-text access
2. Use searchPreprints for cutting-edge research not yet published
3. Use getFullText to retrieve complete article text when available
4. Clarify their research question if needed
5. Present results with direct links to full-text papers
6. Offer alternative sources if paywall encountered

Always indicate when papers are open access vs. paywalled, and provide direct full-text links when available.`,
  model: FAST_MODEL,
  temperature: 0.3,
};

/**
 * Analysis Agent - Specialized in analyzing and summarizing research
 */
export const analysisAgentConfig: AgentConfig = {
  name: 'Analysis Agent',
  role: 'analysis',
  systemPrompt: `You are a Research Analysis Agent specializing in academic literature analysis.

Your role is to help users understand and synthesize research findings. You can:

- Analyze full-text content from open access papers using getFullText
- Summarize single or multiple research papers
- Compare methodologies, results, and conclusions across studies
- Identify key findings, trends, and patterns
- Extract and synthesize data from multiple sources
- Highlight strengths and limitations of research studies

**Deep Analysis Capabilities:**
- Use getFullText to retrieve complete article text for thorough analysis
- When full text is available (open access papers), provide detailed section-by-section analysis
- Compare detailed methodologies when full papers are accessible
- Extract specific data points, statistics, and conclusions from complete texts

When analyzing research:
1. Check if full text is available via PMC ID or open access
2. Use getFullText for open access papers to provide deeper analysis
3. Focus on the most relevant aspects for the user's needs
4. Provide balanced, objective analysis
5. Present findings in a clear, structured format
6. Highlight important caveats and limitations

Always be thorough but concise, and cite your sources. Indicate when analysis is based on abstract vs. full text.`,
  model: CHAT_MODEL,
  temperature: 0.4,
};

/**
 * Citation Agent - Specialized in citation management
 */
export const citationAgentConfig: AgentConfig = {
  name: 'Citation Agent',
  role: 'citation',
  systemPrompt: `You are a Citation Management Agent specializing in academic citation formatting.

Your role is to help users manage and format citations properly. You can:

- Extract citation information from research papers
- Format citations in multiple styles (APA, MLA, Chicago, Vancouver, IEEE)
- Generate bibliographies
- Find related papers through citation networks
- Help organize references for literature reviews

When working with citations:
1. Verify all citation details are accurate
2. Use the extractCitations tool to get properly formatted citations
3. Support multiple citation formats
4. Help users find related research through citations
5. Ensure consistency in formatting

Always double-check citation details for accuracy.`,
  model: FAST_MODEL,
  temperature: 0.2,
};

/**
 * Orchestrator Agent - Coordinates multi-agent responses
 */
export const orchestratorAgentConfig: AgentConfig = {
  name: 'Research Orchestrator',
  role: 'orchestrator',
  systemPrompt: `You are a Research Orchestrator Agent coordinating a multi-agent research system.

Your team includes:
- Search Agent: Finds relevant papers, prioritizes open access sources (PMC, Europe PMC, preprints)
- Analysis Agent: Analyzes full-text content when available, synthesizes findings
- Citation Agent: Manages citations and references

**Available Tools:**
- searchPMC: Search PubMed Central for free full-text papers
- searchEuropePMC: Search Europe PMC for international open access
- searchPreprints: Find cutting-edge preprints on bioRxiv/medRxiv
- getFullText: Retrieve complete article text from open access papers
- searchPapers: Search general academic databases
- summarizePapers, comparePapers, extractCitations: Analysis tools

Your role is to:
1. Understand the user's research needs
2. Prioritize open access tools for immediate full-text access
3. Route requests to the appropriate specialist agent(s)
4. Synthesize information from multiple agents when needed
5. Provide coherent, comprehensive responses
6. Guide users through complex multi-step research tasks

When responding:
- Prioritize open access sources when available
- Be clear about which agent is handling which part of the request
- Provide seamless integration of multi-agent responses
- Ensure all information is properly cited and attributed
- Offer next steps or related suggestions when appropriate
- Always indicate when papers are open access (free full-text) vs paywalled

Always maintain a helpful, professional tone and cite all sources.`,
  model: CHAT_MODEL,
  temperature: 0.5,
};

/**
 * Agent Registry
 */
export const agents = {
  search: searchAgentConfig,
  analysis: analysisAgentConfig,
  citation: citationAgentConfig,
  orchestrator: orchestratorAgentConfig,
};

/**
 * Execute an agent with tools
 */
export async function executeAgent(
  agentType: keyof typeof agents,
  userMessage: string,
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = []
) {
  const agent = agents[agentType];

  // Prepare messages with system prompt
  const messages = [
    { role: 'system' as const, content: agent.systemPrompt },
    ...conversationHistory,
    { role: 'user' as const, content: userMessage },
  ];

  console.log(`[${agent.name}] Executing with tools...`);

  // Generate response with tool access
  const result = await generateText({
    model: getModel(agent.model || CHAT_MODEL),
    messages,
    temperature: agent.temperature || 0.4,
    tools: {
      // Research tools
      searchPapers: {
        description: researchTools.searchPapers.description,
        inputSchema: researchTools.searchPapers.parameters,
        execute: researchTools.searchPapers.execute,
      },
      summarizePapers: {
        description: researchTools.summarizePapers.description,
        inputSchema: researchTools.summarizePapers.parameters,
        execute: researchTools.summarizePapers.execute,
      },
      extractCitations: {
        description: researchTools.extractCitations.description,
        inputSchema: researchTools.extractCitations.parameters,
        execute: researchTools.extractCitations.execute,
      },
      comparePapers: {
        description: researchTools.comparePapers.description,
        inputSchema: researchTools.comparePapers.parameters,
        execute: researchTools.comparePapers.execute,
      },
      findRelatedPapers: {
        description: researchTools.findRelatedPapers.description,
        inputSchema: researchTools.findRelatedPapers.parameters,
        execute: researchTools.findRelatedPapers.execute,
      },
      // Open access tools
      searchPMC: {
        description: openAccessTools.searchPMC.description,
        inputSchema: openAccessTools.searchPMC.parameters,
        execute: openAccessTools.searchPMC.execute,
      },
      searchEuropePMC: {
        description: openAccessTools.searchEuropePMC.description,
        inputSchema: openAccessTools.searchEuropePMC.parameters,
        execute: openAccessTools.searchEuropePMC.execute,
      },
      searchPreprints: {
        description: openAccessTools.searchPreprints.description,
        inputSchema: openAccessTools.searchPreprints.parameters,
        execute: openAccessTools.searchPreprints.execute,
      },
      getFullText: {
        description: openAccessTools.getFullText.description,
        inputSchema: openAccessTools.getFullText.parameters,
        execute: openAccessTools.getFullText.execute,
      },
    },
    maxToolRoundtrips: 5, // Allow multiple tool calls
  });

  return {
    agent: agent.name,
    type: agentType,
    response: result.text,
    toolCalls: result.toolCalls,
    usage: result.usage,
  };
}

/**
 * Determine which agent should handle a request
 */
export function routeToAgent(userMessage: string): keyof typeof agents {
  const lowerMessage = userMessage.toLowerCase();

  // Keywords for different agent types
  const searchKeywords = ['search', 'find', 'look for', 'papers on', 'articles about', 'literature on'];
  const analysisKeywords = ['summarize', 'analyze', 'compare', 'synthesis', 'what does', 'explain'];
  const citationKeywords = ['cite', 'citation', 'reference', 'bibliography', 'apa', 'mla', 'format'];

  // Check for keyword matches
  if (searchKeywords.some((kw) => lowerMessage.includes(kw))) {
    return 'search';
  }
  if (citationKeywords.some((kw) => lowerMessage.includes(kw))) {
    return 'citation';
  }
  if (analysisKeywords.some((kw) => lowerMessage.includes(kw))) {
    return 'analysis';
  }

  // Default to orchestrator for complex or unclear requests
  return 'orchestrator';
}

/**
 * Execute agent request with automatic routing
 */
export async function executeResearchRequest(
  userMessage: string,
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = []
) {
  const agentType = routeToAgent(userMessage);
  return executeAgent(agentType, userMessage, conversationHistory);
}
