// LangChain integration for aurum

import { ChatOpenAI } from '@langchain/openai';
import { ChatAnthropic } from '@langchain/anthropic';
import { ChatCohere } from '@langchain/cohere';
import { PineconeStore } from '@langchain/pinecone';
import { Pinecone as PineconeClient } from '@pinecone-database/pinecone';
import { AIMessage, HumanMessage } from '@langchain/core/messages';
import { PromptTemplate } from '@langchain/core/prompts';

const pinecone = new PineconeClient({
  apiKey: process.env.PINECONE_API_KEY || '',
});

export class LangChainFinanceChain {
  private openai: ChatOpenAI;
  private anthropic: ChatAnthropic;
  private cohere: ChatCohere;

  constructor() {
    this.openai = new ChatOpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName: 'gpt-4-turbo-preview',
      temperature: 0.7,
    });

    this.anthropic = new ChatAnthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
      modelName: 'claude-3-opus-20240229',
      temperature: 0.7,
    });

    this.cohere = new ChatCohere({
      apiKey: process.env.COHERE_API_KEY,
      model: 'command',
      temperature: 0.7,
    });
  }

  async analyzeFinancialText(text: string): Promise<string> {
    const prompt = PromptTemplate.fromTemplate(
      'Analyze the following financial text and provide insights: {text}'
    );

    const chain = prompt.pipe(this.openai);
    const result = await chain.invoke({ text });
    return result.content as string;
  }

  async generateFinancialAdvice(context: string): Promise<string> {
    const messages = [
      new HumanMessage(
        `You are a financial advisor. Provide advice based on this context: ${context}`
      ),
    ];

    const response = await this.anthropic.invoke(messages);
    return response.content as string;
  }

  async summarizeFinancialReport(report: string): Promise<string> {
    const messages = [
      new HumanMessage(
        `Summarize this financial report in a clear and concise manner: ${report}`
      ),
    ];

    const response = await this.cohere.invoke(messages);
    return response.content as string;
  }

  async chatWithFinanceHistory(
    query: string,
    history: Array<{ role: string; content: string }>
  ): Promise<string> {
    const messages = history.map((msg) =>
      msg.role === 'user' ? new HumanMessage(msg.content) : new AIMessage(msg.content)
    );
    messages.push(new HumanMessage(query));

    const response = await this.openai.invoke(messages);
    return response.content as string;
  }

  async createVectorStore(indexName: string) {
    const index = pinecone.index(indexName);
    return PineconeStore.fromExistingIndex(this.openai, { pineconeIndex: index });
  }

  async similaritySearch(
    indexName: string,
    query: string,
    k: number = 5
  ): Promise<Array<{ pageContent: string; metadata: any }>> {
    const vectorStore = await this.createVectorStore(indexName);
    return await vectorStore.similaritySearch(query, k);
  }
}
