/**
 * Application Constants
 * Centralized constants used throughout the app
 */

export const APP_NAME = 'Aurum';
export const APP_DESCRIPTION = 'AI-powered finance platform';

export const CURRENCY_SYMBOLS = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  INR: '₹',
} as const;

export const TRANSACTION_CATEGORIES = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Healthcare',
  'Utilities',
  'Education',
  'Travel',
  'Groceries',
  'Other',
] as const;

export const ACCOUNT_TYPES = ['Current', 'Savings'] as const;

export const BILLING_CYCLES = ['daily', 'weekly', 'monthly', 'quarterly', 'yearly'] as const;

export const INVESTMENT_TYPES = ['stock', 'etf', 'mutual_fund', 'bond', 'crypto', 'real_estate', 'other'] as const;

export const ACHIEVEMENT_CATEGORIES = ['savings', 'investing', 'budgeting', 'consistency', 'social'] as const;

export const ACHIEVEMENT_RARITIES = ['common', 'rare', 'epic', 'legendary'] as const;

export const LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'zh', name: 'Chinese', nativeName: '中文' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'ko', name: 'Korean', nativeName: '한국어' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
] as const;

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
} as const;

export const API_ROUTES = {
  AUTH: '/api/auth',
  ACCOUNTS: '/api/accounts',
  TRANSACTIONS: '/api/transactions',
  BUDGET: '/api/budget',
  INVESTMENTS: '/api/investments',
  SUBSCRIPTIONS: '/api/subscriptions',
  NOTIFICATIONS: '/api/notifications',
  WEBHOOKS: '/api/webhooks',
} as const;
