/**
 * Central Type Definitions
 * All shared types for the application
 */

// Database Types
export interface User {
  id: string;
  clerkUserId: string;
  email: string;
  name?: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
  isDefault: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  description?: string;
  date: Date;
  category: string;
  receiptUrl?: string;
  isRecurring: boolean;
  recurringInterval?: RecurringInterval;
  nextRecurringDate?: Date;
  lastProcessed?: Date;
  status: TransactionStatus;
  userId: string;
  accountId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Budget {
  id: string;
  amount: number;
  lastAlertSent?: Date;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Enums
export enum AccountType {
  CURRENT = 'CURRENT',
  SAVINGS = 'SAVINGS',
}

export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export enum RecurringInterval {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Feature Types
export interface Subscription {
  id: string;
  name: string;
  description?: string;
  amount: number;
  currency: string;
  billingCycle: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  nextBillingDate: Date;
  category: string;
  status: 'active' | 'paused' | 'cancelled' | 'expired';
  autoRenew: boolean;
  freeTrialEnd?: Date;
  logo?: string;
  website?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Investment {
  id: string;
  symbol: string;
  name: string;
  type: 'stock' | 'etf' | 'mutual_fund' | 'bond' | 'crypto' | 'real_estate' | 'other';
  quantity: number;
  averageCost: number;
  currentPrice: number;
  currency: string;
  purchaseDate: Date;
  sector?: string;
  exchange?: string;
  notes?: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'savings' | 'investing' | 'budgeting' | 'consistency' | 'social';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  unlockedAt?: Date;
}

// UI Types
export interface Theme {
  mode: 'light' | 'dark' | 'system';
}

export interface Language {
  code: string;
  name: string;
  nativeName: string;
}

// Notification Types
export interface NotificationData {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  data?: any;
}

export interface PushSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}
