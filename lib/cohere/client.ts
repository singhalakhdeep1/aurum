// Cohere client for aurum

import cohere from 'cohere-ai';

cohere.init(process.env.COHERE_API_KEY || '');

export async function generateText(prompt: string): Promise<string> {
  const response = await cohere.generate({
    model: 'command',
    prompt,
    maxTokens: 1024,
    temperature: 0.7,
  });

  return response.generations[0].text;
}

export async function chat(
  message: string,
  conversationHistory?: Array<{ role: string; message: string }>
): Promise<string> {
  const response = await cohere.chat({
    message,
    chatHistory: conversationHistory,
    model: 'command',
  });

  return response.text;
}

export async function streamGenerate(
  prompt: string,
  onChunk: (chunk: string) => void
): Promise<void> {
  const response = await cohere.generate({
    model: 'command',
    prompt,
    maxTokens: 1024,
    temperature: 0.7,
    stream: true,
  });

  for await (const generation of response) {
    if (generation.text) {
      onChunk(generation.text);
    }
  }
}

export async function rerank(
  query: string,
  documents: string[],
  topN?: number
): Promise<Array<{ index: number; relevance_score: number }>> {
  const response = await cohere.rerank({
    model: 'rerank-english-v2.0',
    query,
    documents,
    topN: topN || documents.length,
  });

  return response.results;
}

export async function embed(text: string): Promise<number[]> {
  const response = await cohere.embed({
    texts: [text],
    model: 'embed-english-v3.0',
  });

  return response.embeddings[0];
}

export async function classifyText(text: string): Promise<any[]> {
  const response = await cohere.classify({
    inputs: [text],
    examples: [
      { text: 'Stock price went up', label: 'positive' },
      { text: 'Market crashed', label: 'negative' },
      { text: 'Stable performance', label: 'neutral' },
    ],
  });

  return response.classifications;
}

export async function summarizeText(text: string): Promise<string> {
  const response = await cohere.summarize({
    text,
    model: 'command',
    length: 'medium',
  });

  return response.summary;
}
