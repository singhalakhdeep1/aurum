# Aurum - AI/ML Implementation

## Overview
This document describes the AI/ML technologies integration added to the aurum finance platform.

## Technologies Added

### 1. LangChain
- Chain orchestration
- Multiple LLM providers
- Vector store integration
- Prompt templates

### 2. Pinecone
- Vector database
- Semantic search
- Vector operations
- Index management

### 3. Vercel AI SDK
- Streaming responses
- Multiple AI providers
- Chat with history
- Financial analysis streaming

### 4. OpenAI Function Calling
- Structured output
- Financial analysis
- Transaction extraction
- Fraud detection

### 5. Anthropic Claude
- Text generation
- System prompts
- Streaming support
- Chat with history

### 6. Cohere
- Text generation
- Chat API
- Reranking
- Embeddings
- Classification
- Summarization

## Files Created

### LangChain
- `lib/langchain/chain.ts` - LangChain finance chain with multi-provider support

### Pinecone
- `lib/pinecone/client.ts` - Pinecone vector database client

### Vercel AI SDK
- `lib/vercel-ai/streaming.ts` - Streaming responses for multiple providers

### OpenAI Functions
- `lib/openai/functions.ts` - Function calling with structured output

### Anthropic
- `lib/anthropic/client.ts` - Anthropic Claude client

### Cohere
- `lib/cohere/client.ts` - Cohere client with multiple capabilities

## Features

### LangChain
- Multi-provider LLM support (OpenAI, Anthropic, Cohere)
- Financial text analysis
- Financial advice generation
- Report summarization
- Chat with history
- Vector store integration with Pinecone
- Similarity search

### Pinecone
- Vector upsert and query
- Metadata filtering
- Index creation and management
- List and describe indexes

### Vercel AI SDK
- Streaming responses for OpenAI, Anthropic, Cohere
- Financial analysis streaming
- Chat with history streaming
- Configurable temperature and max tokens

### OpenAI Function Calling
- Financial text analysis with structured output
- Transaction extraction
- Expense categorization
- Budget advice generation
- Fraud detection

### Anthropic Claude
- Text generation
- System prompt support
- Streaming responses
- Financial document analysis
- Chat with history

### Cohere
- Text generation
- Chat with conversation history
- Streaming generation
- Document reranking
- Text embeddings
- Text classification
- Text summarization

## Installation Required

Add to `package.json`:
```json
{
  "dependencies": {
    "@langchain/openai": "^0.0.0",
    "@langchain/anthropic": "^0.0.0",
    "@langchain/cohere": "^0.0.0",
    "@langchain/pinecone": "^0.0.0",
    "@pinecone-database/pinecone": "^5.1.0",
    "ai": "^4.0.0",
    "@ai-sdk/openai": "^1.0.0",
    "@ai-sdk/anthropic": "^1.0.0",
    "@ai-sdk/cohere": "^1.0.0",
    "@anthropic-ai/sdk": "^0.27.0",
    "cohere-ai": "^7.0.0",
    "zod": "^3.23.8"
  }
}
```

Run:
```bash
npm install
```

## Environment Variables

```env
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key
COHERE_API_KEY=your_cohere_api_key
PINECONE_API_KEY=your_pinecone_api_key
```

## Notes
- All code is written but packages are not installed (per user request)
- TypeScript errors are expected until packages are installed
- Requires API keys for OpenAI, Anthropic, Cohere, and Pinecone
- Pinecone requires index setup before use
