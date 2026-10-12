/**
 * Subscriptions Page
 * Track recurring subscriptions, their monthly cost and upcoming renewals.
 */

'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { AlertCircle, Calendar, Loader2, Pause, Play, Plus, Trash2, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  calculateMonthlyCost,
  generateSubscriptionAnalytics,
  generateSubscriptionInsights,
  type Subscription,
} from '@/shared/lib/subscriptions/subscription-manager';

const CYCLES = ['daily', 'weekly', 'monthly', 'quarterly', 'yearly'] as const;
const CATEGORIES = ['Entertainment', 'Software', 'Utilities', 'Health', 'News', 'Education', 'Shopping', 'Other'];

interface ApiSubscription {
  id: string;
  name: string;
  description: string | null;
  amount: string | number;
  currency: string;
  billingCycle: Subscription['billingCycle'];
  nextBillingDate: string;
  category: string;
  status: Subscription['status'];
  autoRenew: boolean;
  freeTrialEnd: string | null;
  logo: string | null;
  website: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

const money = (n: number) => `$${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

function toSubscription(s: ApiSubscription): Subscription {
  return {
    id: s.id,
    name: s.name,
    description: s.description ?? undefined,
    amount: Number(s.amount),
    currency: s.currency,
    billingCycle: s.billingCycle,
    nextBillingDate: new Date(s.nextBillingDate),
    category: s.category,
    status: s.status,
    autoRenew: s.autoRenew,
    freeTrialEnd: s.freeTrialEnd ? new Date(s.freeTrialEnd) : undefined,
    logo: s.logo ?? undefined,
    website: s.website ?? undefined,
    notes: s.notes ?? undefined,
    createdAt: new Date(s.createdAt),
    updatedAt: new Date(s.updatedAt),
  };
}

async function request(url: string, method: string, body?: unknown) {
  const res = await fetch(url, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'Request failed');
}

const emptyForm = () => ({
  name: '',
  amount: '',
  billingCycle: 'monthly' as Subscription['billingCycle'],
  nextBillingDate: new Date().toISOString().slice(0, 10),
  category: 'Entertainment',
});

const statusVariant = (status: Subscription['status']) => (status === 'active' ? 'default' : status === 'paused' ? 'secondary' : 'outline');

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm());
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/subscriptions?pageSize=100');
      if (!res.ok) throw new Error('Failed to fetch subscriptions');
      const body: { data: ApiSubscription[] } = await res.json();
      setSubscriptions(body.data.map(toSubscription));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load subscriptions');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const analytics = useMemo(() => generateSubscriptionAnalytics(subscriptions), [subscriptions]);
  const insights = useMemo(() => generateSubscriptionInsights(subscriptions), [subscriptions]);

  const act = async (fn: () => Promise<void>, success: string) => {
    try {
      await fn();
      toast.success(success);
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong');
    }
  };

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await act(async () => {
      await request('/api/subscriptions', 'POST', {
        name: form.name.trim(),
        amount: parseFloat(form.amount),
        billingCycle: form.billingCycle,
        nextBillingDate: new Date(form.nextBillingDate).toISOString(),
        category: form.category,
      });
      setForm(emptyForm());
      setShowForm(false);
    }, 'Subscription added');
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[300px]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error) {
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

  const set = (key: keyof ReturnType<typeof emptyForm>) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Subscriptions</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Keep track of recurring payments and renewals</p>
        </div>
        <Button onClick={() => setShowForm((v) => !v)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Subscription
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>New Subscription</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={add} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <div className="space-y-2 lg:col-span-2">
                <Label htmlFor="sub-name">Name</Label>
                <Input id="sub-name" required value={form.name} onChange={set('name')} placeholder="Netflix" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sub-amount">Amount ($)</Label>
                <Input id="sub-amount" required type="number" step="0.01" min="0.01" value={form.amount} onChange={set('amount')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sub-cycle">Billed</Label>
                <select
                  id="sub-cycle"
                  value={form.billingCycle}
                  onChange={set('billingCycle')}
                  className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm dark:bg-gray-900"
                >
                  {CYCLES.map((c) => (
                    <option key={c} value={c}>
                      {c[0].toUpperCase() + c.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sub-next">Next billing</Label>
                <Input id="sub-next" required type="date" value={form.nextBillingDate} onChange={set('nextBillingDate')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sub-cat">Category</Label>
                <select
                  id="sub-cat"
                  value={form.category}
                  onChange={set('category')}
                  className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm dark:bg-gray-900"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2 sm:col-span-2 lg:col-span-5">
                <Button type="submit" disabled={saving}>
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save subscription'}
                </Button>
                <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Monthly Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{money(analytics.totalMonthlyCost)}</div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{analytics.activeSubscriptions} active</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Yearly Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{money(analytics.totalYearlyCost)}</div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Active subscriptions only</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Saved by Pausing / Cancelling</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{money(analytics.potentialSavings)}</div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Per month</p>
          </CardContent>
        </Card>
      </div>

      {(insights.length > 0 || analytics.upcomingBills.length > 0) && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {analytics.upcomingBills.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Calendar className="h-4 w-4" />
                  Upcoming in the next 30 days
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {analytics.upcomingBills.map((bill) => (
                  <div key={`${bill.subscription}-${bill.date.toISOString()}`} className="flex justify-between">
                    <span>
                      {bill.subscription} <span className="text-gray-500">· {bill.date.toLocaleDateString()}</span>
                    </span>
                    <span className="font-medium">{money(bill.amount)}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
          {insights.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {insights.map((insight, i) => (
                  <p key={`${insight.subscriptionId ?? 'all'}-${i}`}>{insight.message}</p>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>All Subscriptions</CardTitle>
        </CardHeader>
        <CardContent>
          {subscriptions.length === 0 ? (
            <p className="text-center py-8 text-gray-600 dark:text-gray-400">No subscriptions tracked yet.</p>
          ) : (
            <div className="space-y-3">
              {subscriptions.map((sub) => (
                <div key={sub.id} className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{sub.name}</h4>
                      <Badge variant={statusVariant(sub.status)}>{sub.status}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {sub.category} · {money(sub.amount)} {sub.billingCycle} ({money(calculateMonthlyCost(sub))}/mo)
                    </p>
                    {sub.status === 'active' && (
                      <p className="text-xs text-gray-500 mt-1">Next billing {sub.nextBillingDate.toLocaleDateString()}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {sub.status === 'active' && (
                      <Button size="sm" variant="outline" onClick={() => act(() => request(`/api/subscriptions/${sub.id}`, 'PUT', { status: 'paused' }), 'Subscription paused')}>
                        <Pause className="h-4 w-4 mr-1" />
                        Pause
                      </Button>
                    )}
                    {sub.status === 'paused' && (
                      <Button size="sm" variant="outline" onClick={() => act(() => request(`/api/subscriptions/${sub.id}`, 'PUT', { status: 'active' }), 'Subscription resumed')}>
                        <Play className="h-4 w-4 mr-1" />
                        Resume
                      </Button>
                    )}
                    {(sub.status === 'active' || sub.status === 'paused') && (
                      <Button size="sm" variant="outline" onClick={() => act(() => request(`/api/subscriptions/${sub.id}/cancel`, 'POST'), 'Subscription cancelled')}>
                        <XCircle className="h-4 w-4 mr-1" />
                        Cancel
                      </Button>
                    )}
                    <Button
                      size="icon"
                      variant="ghost"
                      aria-label={`Delete ${sub.name}`}
                      onClick={() => confirm(`Delete ${sub.name}?`) && act(() => request(`/api/subscriptions/${sub.id}`, 'DELETE'), 'Subscription deleted')}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
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
