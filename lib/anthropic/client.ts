// Anthropic Claude client for aurum

import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export async function generateText(prompt: string): Promise<string> {
  const message = await anthropic.messages.create({
    model: 'claude-3-opus-20240229',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  return message.content[0].type === 'text' ? message.content[0].text : '';
}

export async function generateWithSystem(
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  const message = await anthropic.messages.create({
    model: 'claude-3-opus-20240229',
    max_tokens: 1024,
    system: systemPrompt,
    messages: [
      {
        role: 'user',
        content: userPrompt,
      },
    ],
  });

  return message.content[0].type === 'text' ? message.content[0].text : '';
}

export async function streamText(
  prompt: string,
  onChunk: (chunk: string) => void
): Promise<void> {
  const stream = await anthropic.messages.create({
    model: 'claude-3-opus-20240229',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
    stream: true,
  });

  for await (const event of stream) {
    if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
      onChunk(event.delta.text);
    }
  }
}

export async function analyzeFinancialDocument(text: string): Promise<string> {
  return await generateWithSystem(
    'You are a financial analyst. Analyze the document and provide insights.',
    text
  );
}

export async function chatWithHistory(
  messages: Array<{ role: string; content: string }>
): Promise<string> {
  const message = await anthropic.messages.create({
    model: 'claude-3-opus-20240229',
    max_tokens: 1024,
    messages: messages as any,
  });

  return message.content[0].type === 'text' ? message.content[0].text : '';
}

export { anthropic };
