/**
 * Subscription Management Page
 * View and manage recurring subscriptions
 */

'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/ui/card';
import { Button } from '@/shared/components/ui/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/ui/table';
import { Badge } from '@/shared/components/ui/ui/badge';
import { Plus, Calendar, CreditCard, AlertCircle, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Subscription {
  id: string;
  name: string;
  description: string;
  amount: number;
  currency: string;
  billingCycle: string;
  nextBillingDate: string;
  category: string;
  status: string;
  autoRenew: boolean;
  logo?: string;
}

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSubscriptions() {
      try {
        const response = await fetch('/api/subscriptions');
        if (!response.ok) throw new Error('Failed to fetch subscriptions');
        const data = await response.json();
        setSubscriptions(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load subscriptions');
      } finally {
        setLoading(false);
      }
    }

    fetchSubscriptions();
  }, []);

  const monthlyTotal = subscriptions
    .filter(sub => sub.status === 'active' && sub.billingCycle === 'monthly')
    .reduce((sum, sub) => sum + sub.amount, 0);

  const yearlyTotal = subscriptions
    .filter(sub => sub.status === 'active' && sub.billingCycle === 'yearly')
    .reduce((sum, sub) => sum + sub.amount, 0);

  const totalMonthly = monthlyTotal + (yearlyTotal / 12);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'paused':
        return 'bg-yellow-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

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
            <h3 className="text-lg font-medium mb-2">Error loading subscriptions</h3>
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
          <h1 className="text-3xl font-bold">Subscriptions</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your recurring payments
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Subscription
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Monthly Total</CardTitle>
            <Calendar className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalMonthly.toFixed(2)}</div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Per month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Yearly Total</CardTitle>
            <CreditCard className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(totalMonthly * 12).toFixed(2)}</div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Per year
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
            <AlertCircle className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {subscriptions.filter(s => s.status === 'active').length}
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Of {subscriptions.length} total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Subscriptions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Your Subscriptions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Billing Cycle</TableHead>
                <TableHead>Next Billing</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Auto-Renew</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscriptions.map((subscription) => (
                <TableRow key={subscription.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{subscription.logo}</span>
                      <div>
                        <div className="font-medium">{subscription.name}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {subscription.description}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{subscription.category}</TableCell>
                  <TableCell>
                    ${subscription.amount.toFixed(2)}
                  </TableCell>
                  <TableCell className="capitalize">{subscription.billingCycle}</TableCell>
                  <TableCell>
                    {new Date(subscription.nextBillingDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(subscription.status)}>
                      {subscription.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {subscription.autoRenew ? (
                      <span className="text-green-500">Yes</span>
                    ) : (
                      <span className="text-red-500">No</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      Manage
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
