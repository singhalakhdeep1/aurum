CREATE TYPE "InvestmentType" AS ENUM ('stock', 'etf', 'mutual_fund', 'bond', 'crypto', 'real_estate', 'other');
CREATE TYPE "BillingCycle" AS ENUM ('daily', 'weekly', 'monthly', 'quarterly', 'yearly');
CREATE TYPE "SubscriptionStatus" AS ENUM ('active', 'paused', 'cancelled', 'expired');

CREATE TABLE "investments" (
  "id" TEXT NOT NULL, "symbol" TEXT NOT NULL, "name" TEXT NOT NULL,
  "type" "InvestmentType" NOT NULL, "quantity" DECIMAL(65,30) NOT NULL,
  "averageCost" DECIMAL(65,30) NOT NULL, "currentPrice" DECIMAL(65,30) NOT NULL,
  "previousClose" DECIMAL(65,30), "annualDividendPerUnit" DECIMAL(65,30),
  "currency" TEXT NOT NULL DEFAULT 'USD', "purchaseDate" TIMESTAMP(3) NOT NULL,
  "sector" TEXT, "exchange" TEXT, "notes" TEXT, "userId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "investments_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "subscriptions" (
  "id" TEXT NOT NULL, "name" TEXT NOT NULL, "description" TEXT,
  "amount" DECIMAL(65,30) NOT NULL, "currency" TEXT NOT NULL DEFAULT 'USD',
  "billingCycle" "BillingCycle" NOT NULL, "nextBillingDate" TIMESTAMP(3) NOT NULL,
  "category" TEXT NOT NULL, "status" "SubscriptionStatus" NOT NULL DEFAULT 'active',
  "autoRenew" BOOLEAN NOT NULL DEFAULT true, "freeTrialEnd" TIMESTAMP(3),
  "logo" TEXT, "website" TEXT, "notes" TEXT, "userId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "investments_userId_idx" ON "investments"("userId");
CREATE INDEX "investments_userId_symbol_idx" ON "investments"("userId", "symbol");
CREATE INDEX "subscriptions_userId_idx" ON "subscriptions"("userId");
CREATE INDEX "subscriptions_userId_nextBillingDate_idx" ON "subscriptions"("userId", "nextBillingDate");
ALTER TABLE "investments" ADD CONSTRAINT "investments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
