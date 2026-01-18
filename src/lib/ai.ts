import { createOpenAI } from '@ai-sdk/openai';

/**
 * AI SDK Configuration
 *
 * Centralized OpenAI client configuration for the application.
 * Supports both OpenAI and compatible APIs via environment variables.
 */

// Determine which OpenAI-compatible API to use
const baseURL = process.env.OPENAI_BASE_URL;
const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  console.warn('Warning: OPENAI_API_KEY is not set. AI features will not work.');
}

export const openai = createOpenAI({
  apiKey,
  baseURL: baseURL || undefined, // Use default if not specified
  compatibility: 'strict', // Ensure strict OpenAI API compatibility
});

/**
 * Get a language model instance
 *
 * @param model - Model identifier (defaults to gpt-4o for best performance)
 * @returns Configured language model
 */
export function getModel(model: string = 'gpt-4o') {
  return openai(model);
}

/**
 * Default model for general chat
 */
export const CHAT_MODEL = 'gpt-4o';

/**
 * Fast model for simple tasks
 */
export const FAST_MODEL = 'gpt-4o-mini';

/**
 * Reasoning model for complex analysis
 */
export const REASONING_MODEL = 'o1';
