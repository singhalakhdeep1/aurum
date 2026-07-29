/**
 * Reports & Analytics Page
 * View financial reports and analytics
 */

'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/ui/card';
import { Button } from '@/shared/components/ui/ui/button';
import { BarChart3, TrendingUp, TrendingDown, Download, Calendar, Loader2, AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

interface MonthlyData {
  month: string;
  income: number;
  expenses: number;
  savings: number;
}

interface CategoryBreakdown {
  category: string;
  amount: number;
  percentage: number;
}

interface ReportsData {
  monthlyData: MonthlyData[];
  categoryBreakdown: CategoryBreakdown[];
  insights: string[];
}

export default function ReportsPage() {
  const [data, setData] = useState<ReportsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchReports() {
      try {
        const response = await fetch('/api/reports');
        if (!response.ok) throw new Error('Failed to fetch reports');
        const reportsData = await response.json();
        setData(reportsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load reports');
      } finally {
        setLoading(false);
      }
    }

    fetchReports();
  }, []);

  const monthlyData = data?.monthlyData || [];
  const categoryBreakdown = data?.categoryBreakdown || [];
  const insights = data?.insights || [];

  const totalIncome = monthlyData.reduce((sum, m) => sum + m.income, 0);
  const totalExpenses = monthlyData.reduce((sum, m) => sum + m.expenses, 0);
  const totalSavings = monthlyData.reduce((sum, m) => sum + m.savings, 0);

  const savingsRate = totalIncome > 0 ? (totalSavings / totalIncome) * 100 : 0;

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
            <h3 className="text-lg font-medium mb-2">Error loading reports</h3>
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
          <h1 className="text-3xl font-bold">Reports & Analytics</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            View your financial insights and trends
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Last 6 Months
          </Button>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalIncome.toLocaleString()}</div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              6-month total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalExpenses.toLocaleString()}</div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              6-month total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Savings</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalSavings.toLocaleString()}</div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              6-month total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Savings Rate</CardTitle>
            <BarChart3 className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{savingsRate.toFixed(1)}%</div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Of total income
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Income vs Expenses</CardTitle>
            <CardDescription>
              Your income and expenses over the last 6 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {monthlyData.map((data) => (
                <div key={data.month} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{data.month}</span>
                    <div className="space-x-4">
                      <span className="text-green-500">+${data.income}</span>
                      <span className="text-red-500">-${data.expenses}</span>
                      <span className="text-blue-500">${data.savings}</span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <div
                      className="bg-green-500 h-4 rounded-l"
                      style={{ width: `${(data.income / 6000) * 100}%` }}
                    />
                    <div
                      className="bg-red-500 h-4"
                      style={{ width: `${(data.expenses / 6000) * 100}%` }}
                    />
                    <div
                      className="bg-blue-500 h-4 rounded-r"
                      style={{ width: `${(data.savings / 6000) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Expense Breakdown</CardTitle>
            <CardDescription>
              Your spending by category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryBreakdown.map((category) => (
                <div key={category.category} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{category.category}</span>
                    <div className="space-x-4">
                      <span>${category.amount}</span>
                      <span className="text-gray-600 dark:text-gray-400">
                        {category.percentage}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${category.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insights */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Financial Insights</CardTitle>
          <CardDescription>
            AI-powered recommendations based on your spending patterns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">
                💡 Great job on savings!
              </h4>
              <p className="text-sm text-green-700 dark:text-green-300">
                Your savings rate of {savingsRate.toFixed(1)}% is above the recommended 20%. Keep up the good work!
              </p>
            </div>
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                ⚠️ Watch your entertainment spending
              </h4>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                Your entertainment expenses have increased by 15% compared to last month. Consider setting a budget limit.
              </p>
            </div>
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                📈 Income trend
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Your income has been steadily increasing over the past 6 months. This is a positive trend!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
