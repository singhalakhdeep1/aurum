// OpenAI function calling for aurum

import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { z } from 'zod';

const financialAnalysisSchema = z.object({
  summary: z.string(),
  sentiment: z.enum(['positive', 'negative', 'neutral']),
  keyMetrics: z.array(z.object({
    name: z.string(),
    value: z.string(),
    trend: z.enum(['up', 'down', 'stable']),
  })),
  risks: z.array(z.string()),
  opportunities: z.array(z.string()),
});

const transactionSchema = z.object({
  amount: z.number(),
  currency: z.string(),
  category: z.string(),
  description: z.string(),
  date: z.string(),
});

const budgetSchema = z.object({
  category: z.string(),
  limit: z.number(),
  spent: z.number(),
  remaining: z.number(),
  percentage: z.number(),
});

export async function analyzeFinancialText(text: string) {
  const result = await generateObject({
    model: openai('gpt-4-turbo-preview'),
    schema: financialAnalysisSchema,
    prompt: `Analyze this financial text: ${text}`,
  });

  return result.object;
}

export async function extractTransaction(text: string) {
  const result = await generateObject({
    model: openai('gpt-4-turbo-preview'),
    schema: transactionSchema,
    prompt: `Extract transaction details from: ${text}`,
  });

  return result.object;
}

export async function categorizeExpense(text: string) {
  const result = await generateObject({
    model: openai('gpt-4-turbo-preview'),
    schema: z.object({
      category: z.string(),
      confidence: z.number(),
      subcategory: z.string().optional(),
    }),
    prompt: `Categorize this expense: ${text}`,
  });

  return result.object;
}

export async function generateBudgetAdvice(income: number, expenses: number[]) {
  const result = await generateObject({
    model: openai('gpt-4-turbo-preview'),
    schema: z.object({
      advice: z.string(),
      budgetBreakdown: z.array(budgetSchema),
      savingsRecommendation: z.string(),
    }),
    prompt: `Generate budget advice for income ${income} and expenses ${JSON.stringify(expenses)}`,
  });

  return result.object;
}

export async function detectFraudulentTransaction(transaction: string) {
  const result = await generateObject({
    model: openai('gpt-4-turbo-preview'),
    schema: z.object({
      isFraudulent: z.boolean(),
      confidence: z.number(),
      reasons: z.array(z.string()),
      recommendedAction: z.string(),
    }),
    prompt: `Analyze this transaction for fraud: ${transaction}`,
  });

  return result.object;
}
