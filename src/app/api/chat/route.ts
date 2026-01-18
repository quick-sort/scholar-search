import { streamText } from 'ai';
import { getModel, CHAT_MODEL } from '@/lib/ai';
import { researchTools, openAccessTools } from '@/lib/tools';
import { routeToAgent, agents } from '@/lib/agents/research-agent';

/**
 * Chat API Route
 *
 * Handles streaming chat responses with tool support.
 * Routes requests to appropriate specialized agents based on intent.
 */

export const runtime = 'edge';

interface ChatRequest {
  messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>;
  agentType?: string;
}

function convertToCoreMessages(
  messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>
): CoreMessage[] {
  return messages.map((msg) => ({
    role: msg.role,
    content: msg.content,
  }));
}

export async function POST(req: Request) {
  try {
    const body: ChatRequest = await req.json();
    const { messages, agentType: requestedAgentType } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response('Invalid messages format', { status: 400 });
    }

    // Get the latest user message
    const lastMessage = messages[messages.length - 1];
    if (lastMessage.role !== 'user') {
      return new Response('Last message must be from user', { status: 400 });
    }

    // Determine which agent to use
    const agentType = (requestedAgentType || routeToAgent(lastMessage.content)) as keyof typeof agents;
    const agent = agents[agentType];

    console.log(`[Chat API] Routing to ${agent.name} (${agentType})`);

    // Convert messages to CoreMessage format
    const coreMessages = convertToCoreMessages([
      { role: 'system', content: agent.systemPrompt },
      ...messages.slice(0, -1), // Exclude the last user message (we'll add it back)
    ]);

    // Add the user message
    coreMessages.push({
      role: 'user',
      content: lastMessage.content,
    });

    // Stream the response with tools
    const result = streamText({
      model: getModel(agent.model || CHAT_MODEL),
      messages: coreMessages,
      temperature: agent.temperature || 0.4,
      tools: {
        // General research tools
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
        // Open access biomedical tools
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
      maxToolRoundtrips: 5,
    });

    // Return the streaming response
    return result.toTextStreamResponse({
      getErrorMessage: (error: unknown) => {
        console.error('[Chat API] Error:', error);
        if (error instanceof Error) {
          return error.message;
        }
        return 'An unknown error occurred';
      },
    });
  } catch (error) {
    console.error('[Chat API] Request error:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to process chat request',
        details: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
