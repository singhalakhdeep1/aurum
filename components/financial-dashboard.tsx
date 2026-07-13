'use client';

import React, { useState } from 'react';
import { Button } from './ui/button';
import { TrendingUp, TrendingDown, DollarSign, PieChart, ArrowUpRight, ArrowDownRight, Wallet } from 'lucide-react';

interface FinancialDashboardProps {
  userId?: string;
}

export default function FinancialDashboard({ userId }: FinancialDashboardProps) {
  const [portfolio, setPortfolio] = useState({
    totalValue: 125000,
    dailyChange: 2500,
    dailyChangePercent: 2.1,
    assets: [
      { name: 'Gold', value: 50000, change: 1.5, allocation: 40 },
      { name: 'Stocks', value: 40000, change: 3.2, allocation: 32 },
      { name: 'Crypto', value: 20000, change: -2.1, allocation: 16 },
      { name: 'Cash', value: 15000, change: 0, allocation: 12 }
    ]
  });

  const [transactions, setTransactions] = useState([
    { id: '1', type: 'buy', asset: 'Gold', amount: 5000, date: new Date() },
    { id: '2', type: 'sell', asset: 'Stocks', amount: 3000, date: new Date() },
    { id: '3', type: 'buy', asset: 'Crypto', amount: 2000, date: new Date() }
  ]);

  const [budget, setBudget] = useState({
    monthly: 10000,
    spent: 6500,
    remaining: 3500,
    categories: [
      { name: 'Investments', amount: 4000, budget: 5000 },
      { name: 'Living', amount: 2000, budget: 3000 },
      { name: 'Savings', amount: 500, budget: 2000 }
    ]
  });

  return (
    <div className="space-y-4">
      {/* Portfolio Overview */}
      <div className="border rounded-lg bg-background p-4">
        <div className="flex items-center gap-2 mb-4">
          <PieChart className="w-5 h-5 text-purple-500" />
          <h3 className="font-semibold">Portfolio Overview</h3>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="bg-muted rounded-lg p-3">
            <p className="text-sm text-muted-foreground">Total Value</p>
            <p className="text-2xl font-bold">${portfolio.totalValue.toLocaleString()}</p>
          </div>
          <div className="bg-muted rounded-lg p-3">
            <p className="text-sm text-muted-foreground">Daily Change</p>
            <div className="flex items-center gap-1">
              {portfolio.dailyChange >= 0 ? (
                <TrendingUp className="w-4 h-4 text-green-500" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500" />
              )}
              <p className={`text-2xl font-bold ${portfolio.dailyChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                ${portfolio.dailyChange.toLocaleString()}
              </p>
            </div>
          </div>
          <div className="bg-muted rounded-lg p-3">
            <p className="text-sm text-muted-foreground">Change %</p>
            <p className={`text-2xl font-bold ${portfolio.dailyChangePercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {portfolio.dailyChangePercent.toFixed(2)}%
            </p>
          </div>
        </div>

        {/* Asset Allocation */}
        <div className="space-y-2">
          <h4 className="font-medium">Asset Allocation</h4>
          {portfolio.assets.map((asset, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{asset.name}</span>
                  <span className="text-sm">${asset.value.toLocaleString()}</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-500"
                    style={{ width: `${asset.allocation}%` }}
                  />
                </div>
              </div>
              <div className={`flex items-center gap-1 text-sm ${asset.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {asset.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                <span>{asset.change.toFixed(1)}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Budget Tracker */}
      <div className="border rounded-lg bg-background p-4">
        <div className="flex items-center gap-2 mb-4">
          <Wallet className="w-5 h-5 text-blue-500" />
          <h3 className="font-semibold">Budget Tracker</h3>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="bg-muted rounded-lg p-3">
            <p className="text-sm text-muted-foreground">Monthly Budget</p>
            <p className="text-xl font-bold">${budget.monthly.toLocaleString()}</p>
          </div>
          <div className="bg-muted rounded-lg p-3">
            <p className="text-sm text-muted-foreground">Spent</p>
            <p className="text-xl font-bold">${budget.spent.toLocaleString()}</p>
          </div>
          <div className="bg-muted rounded-lg p-3">
            <p className="text-sm text-muted-foreground">Remaining</p>
            <p className="text-xl font-bold text-green-500">${budget.remaining.toLocaleString()}</p>
          </div>
        </div>

        <div className="space-y-2">
          {budget.categories.map((category, index) => {
            const percentage = (category.amount / category.budget) * 100;
            return (
              <div key={index} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{category.name}</span>
                  <span>${category.amount.toLocaleString()} / ${category.budget.toLocaleString()}</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full ${percentage > 90 ? 'bg-red-500' : percentage > 70 ? 'bg-yellow-500' : 'bg-green-500'}`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="border rounded-lg bg-background p-4">
        <div className="flex items-center gap-2 mb-4">
          <DollarSign className="w-5 h-5 text-green-500" />
          <h3 className="font-semibold">Recent Transactions</h3>
        </div>

        <div className="space-y-2">
          {transactions.map(tx => (
            <div key={tx.id} className="flex items-center justify-between p-2 border rounded">
              <div className="flex items-center gap-2">
                {tx.type === 'buy' ? (
                  <ArrowDownRight className="w-4 h-4 text-red-500 rotate-45" />
                ) : (
                  <ArrowUpRight className="w-4 h-4 text-green-500" />
                )}
                <div>
                  <p className="text-sm font-medium capitalize">{tx.type} {tx.asset}</p>
                  <p className="text-xs text-muted-foreground">{tx.date.toLocaleDateString()}</p>
                </div>
              </div>
              <span className={`text-sm font-medium ${tx.type === 'buy' ? 'text-red-500' : 'text-green-500'}`}>
                {tx.type === 'buy' ? '-' : '+'}${tx.amount.toLocaleString()}
              </span>
            </div>
          ))}
        </div>

        <Button variant="outline" className="w-full mt-4">
          View All Transactions
        </Button>
      </div>
    </div>
  );
}
