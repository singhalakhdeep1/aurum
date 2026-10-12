/**
 * Budget Page
 * Set a monthly spending budget and track this month's spending against it.
 */

'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { AlertCircle, Loader2, Pencil } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';

interface BudgetSummary {
  budget: { id: string; amount: number } | null;
  spent: number;
  remaining: number | null;
  percentage: number;
  categories: { category: string; spent: number }[];
}

const money = (n: number) => `$${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const titleCase = (s: string) => s.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

export default function BudgetPage() {
  const [summary, setSummary] = useState<BudgetSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [amount, setAmount] = useState('');
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/budget');
      if (!res.ok) throw new Error('Failed to load budget');
      setSummary(await res.json());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load budget');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = parseFloat(amount);
    if (!Number.isFinite(value) || value <= 0) {
      toast.error('Enter a budget amount greater than zero');
      return;
    }
    setSaving(true);
    try {
      const res = await fetch('/api/budget', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: value }),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'Failed to save budget');
      toast.success('Budget updated');
      setEditing(false);
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save budget');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center min-h-[300px] items-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error || !summary) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="border-red-200 dark:border-red-800">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { budget, spent, remaining, percentage, categories } = summary;
  const showForm = editing || !budget;
  const barColor = percentage >= 100 ? 'bg-red-500' : percentage >= 80 ? 'bg-yellow-500' : 'bg-green-500';

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Budget</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Your monthly spending limit and where the money is going</p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-start justify-between">
          <div>
            <CardTitle>Monthly Budget</CardTitle>
            <CardDescription>
              {budget ? 'Expenses this month across all accounts' : 'Set a monthly limit to start tracking'}
            </CardDescription>
          </div>
          {budget && !editing && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setAmount(String(budget.amount));
                setEditing(true);
              }}
            >
              <Pencil className="h-4 w-4 mr-1" />
              Edit
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {showForm && (
            <form onSubmit={save} className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <div className="space-y-2 flex-1">
                <Label htmlFor="budget-amount">Monthly budget ($)</Label>
                <Input
                  id="budget-amount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="e.g. 2000"
                  value={amount}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAmount(e.target.value)}
                  autoFocus
                />
              </div>
              <Button type="submit" disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save budget'}
              </Button>
              {budget && (
                <Button type="button" variant="ghost" onClick={() => setEditing(false)}>
                  Cancel
                </Button>
              )}
            </form>
          )}

          {budget && (
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>
                  {money(spent)} of {money(budget.amount)} spent
                </span>
                <span className="font-medium">{percentage}%</span>
              </div>
              <Progress value={Math.min(percentage, 100)} extraStyles={barColor} />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {remaining !== null && remaining >= 0
                  ? `${money(remaining)} remaining this month`
                  : `Over budget by ${money(Math.abs(remaining ?? 0))}`}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>This Month by Category</CardTitle>
          <CardDescription>Where your expenses went</CardDescription>
        </CardHeader>
        <CardContent>
          {categories.length === 0 ? (
            <p className="text-sm text-gray-600 dark:text-gray-400">No expenses recorded this month.</p>
          ) : (
            <div className="space-y-4">
              {categories.map((c) => (
                <div key={c.category} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{titleCase(c.category)}</span>
                    <span>{money(c.spent)}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${spent ? (c.spent / spent) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
