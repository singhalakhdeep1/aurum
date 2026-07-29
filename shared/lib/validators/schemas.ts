/**
 * Zod Validation Schemas
 * Input validation for API endpoints
 */

import { z } from 'zod';

// Account Schemas
export const createAccountSchema = z.object({
  name: z.string().min(1, 'Account name is required').max(100),
  type: z.enum(['CURRENT', 'SAVINGS']),
  balance: z.number().min(0, 'Balance must be positive'),
  isDefault: z.boolean().optional(),
});

export const updateAccountSchema = createAccountSchema.partial();

// Transaction Schemas
export const createTransactionSchema = z.object({
  type: z.enum(['INCOME', 'EXPENSE']),
  amount: z.number().positive('Amount must be positive'),
  description: z.string().max(500).optional(),
  date: z.string().or(z.date()),
  category: z.string().min(1, 'Category is required'),
  accountId: z.string().min(1, 'Account ID is required'),
  receiptUrl: z.string().url().optional(),
  isRecurring: z.boolean().optional(),
  recurringInterval: z.enum(['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY']).optional(),
});

export const updateTransactionSchema = createTransactionSchema.partial();

export const deleteTransactionsSchema = z.object({
  transactionIds: z.array(z.string()).min(1, 'At least one transaction ID is required'),
});

// Budget Schemas
export const createBudgetSchema = z.object({
  amount: z.number().positive('Budget amount must be positive'),
  category: z.string().min(1, 'Category is required'),
});

export const updateBudgetSchema = createBudgetSchema.partial();

// Investment Schemas
export const createInvestmentSchema = z.object({
  symbol: z.string().min(1, 'Symbol is required'),
  name: z.string().min(1, 'Name is required'),
  type: z.enum(['stock', 'etf', 'mutual_fund', 'bond', 'crypto', 'real_estate', 'other']),
  quantity: z.number().positive('Quantity must be positive'),
  averageCost: z.number().positive('Average cost must be positive'),
  currentPrice: z.number().positive('Current price must be positive'),
  currency: z.string().default('USD'),
  purchaseDate: z.string().or(z.date()),
  sector: z.string().optional(),
  exchange: z.string().optional(),
  notes: z.string().max(1000).optional(),
});

export const updateInvestmentSchema = createInvestmentSchema.partial();

// Subscription Schemas
export const createSubscriptionSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().max(500).optional(),
  amount: z.number().positive('Amount must be positive'),
  currency: z.string().default('USD'),
  billingCycle: z.enum(['daily', 'weekly', 'monthly', 'quarterly', 'yearly']),
  nextBillingDate: z.string().or(z.date()),
  category: z.string().min(1, 'Category is required'),
  autoRenew: z.boolean().default(true),
  freeTrialEnd: z.string().or(z.date()).optional(),
  logo: z.string().url().optional(),
  website: z.string().url().optional(),
  notes: z.string().max(1000).optional(),
});

export const updateSubscriptionSchema = createSubscriptionSchema.partial();

// Crypto Wallet Schemas
export const createWalletSchema = z.object({
  chain: z.enum(['ethereum', 'polygon', 'bsc']),
  privateKey: z.string().min(1, 'Private key is required'),
});

// Plaid Schemas
export const createPlaidLinkTokenSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
});

export const exchangePlaidPublicTokenSchema = z.object({
  publicToken: z.string().min(1, 'Public token is required'),
});

// Notification Schemas
export const subscribeToPushSchema = z.object({
  subscription: z.object({
    endpoint: z.string().url(),
    keys: z.object({
      p256dh: z.string(),
      auth: z.string(),
    }),
  }),
});

// Pagination Schema
export const paginationSchema = z.object({
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().positive().max(100).default(10),
});
