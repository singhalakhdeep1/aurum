/**
 * Budget Management Page
 * View and manage budget categories
 */

'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/ui/card';
import { Button } from '@/shared/components/ui/ui/button';
import { Progress } from '@/shared/components/ui/ui/progress';
import { Plus, TrendingUp, TrendingDown, AlertCircle, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Budget {
  id: string;
  category: string;
  amount: number;
  spent: number;
  remaining: number;
  percentage: number;
}

export default function BudgetPage() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBudgets() {
      try {
        const response = await fetch('/api/budget');
        if (!response.ok) throw new Error('Failed to fetch budgets');
        const data = await response.json();
        setBudgets(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load budgets');
      } finally {
        setLoading(false);
      }
    }

    fetchBudgets();
  }, []);

  const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const totalRemaining = totalBudget - totalSpent;

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="border-red-200 dark:border-red-800">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <h3 className="text-lg font-medium mb-2">Error loading budgets</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Budget Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track and manage your monthly budgets
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Budget
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalBudget}</div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Monthly allocation
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalSpent}</div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              {((totalSpent / totalBudget) * 100).toFixed(1)}% used
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Remaining</CardTitle>
            {totalRemaining < 0 ? (
              <AlertCircle className="h-4 w-4 text-red-500" />
            ) : (
              <TrendingUp className="h-4 w-4 text-green-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalRemaining < 0 ? 'text-red-500' : 'text-green-500'}`}>
              ${totalRemaining}
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              {totalRemaining < 0 ? 'Over budget' : 'Available'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Budget Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Budget Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {budgets.map((budget) => (
              <div key={budget.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{budget.category}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      ${budget.spent} of ${budget.amount}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`font-medium ${budget.remaining < 0 ? 'text-red-500' : 'text-green-500'}`}>
                      ${budget.remaining}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {budget.percentage}%
                    </p>
                  </div>
                </div>
                <Progress
                  value={Math.min(budget.percentage, 100)}
                  className={`h-2 ${budget.percentage > 100 ? 'bg-red-500' : ''}`}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
