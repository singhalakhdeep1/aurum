// Vercel AI SDK streaming for aurum

import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';
import { cohere } from '@ai-sdk/cohere';

export async function streamOpenAIResponse(prompt: string) {
  const result = await streamText({
    model: openai('gpt-4-turbo-preview'),
    prompt,
    temperature: 0.7,
    maxTokens: 1024,
  });

  return result.toDataStreamResponse();
}

export async function streamAnthropicResponse(prompt: string) {
  const result = await streamText({
    model: anthropic('claude-3-opus-20240229'),
    prompt,
    temperature: 0.7,
    maxTokens: 1024,
  });

  return result.toDataStreamResponse();
}

export async function streamCohereResponse(prompt: string) {
  const result = await streamText({
    model: cohere('command'),
    prompt,
    temperature: 0.7,
    maxTokens: 1024,
  });

  return result.toDataStreamResponse();
}

export async function streamFinancialAnalysis(text: string) {
  const result = await streamText({
    model: openai('gpt-4-turbo-preview'),
    system: 'You are a financial analyst. Analyze the given text and provide insights.',
    prompt: text,
    temperature: 0.7,
  });

  return result.toDataStreamResponse();
}

export async function streamChatWithHistory(
  messages: Array<{ role: string; content: string }>
) {
  const result = await streamText({
    model: anthropic('claude-3-opus-20240229'),
    messages,
    temperature: 0.7,
  });

  return result.toDataStreamResponse();
}
