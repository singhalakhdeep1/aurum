/**
 * Subscription Card Component
 * Reusable component for displaying subscription items
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MoreHorizontal, AlertCircle } from 'lucide-react';

interface SubscriptionCardProps {
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
  onEdit?: () => void;
  onCancel?: () => void;
}

export function SubscriptionCard({
  name,
  description,
  amount,
  currency,
  billingCycle,
  nextBillingDate,
  category,
  status,
  autoRenew,
  logo,
  onEdit,
  onCancel,
}: SubscriptionCardProps) {
  const daysUntilBilling = Math.ceil(
    (new Date(nextBillingDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );
  const isDueSoon = daysUntilBilling <= 7;
  const isActive = status === 'active';

  const getStatusColor = () => {
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

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            {logo && (
              <div className="text-3xl">{logo}</div>
            )}
            <div>
              <CardTitle className="text-lg">{name}</CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between items-center">
          <Badge className={getStatusColor()}>{status}</Badge>
          <Badge variant="outline">{category}</Badge>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-gray-600 dark:text-gray-400">Amount</p>
            <p className="font-medium">
              {currency} {amount.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-gray-600 dark:text-gray-400">Billing</p>
            <p className="font-medium capitalize">{billingCycle}</p>
          </div>
        </div>

        <div className={`flex items-center gap-2 p-3 rounded-lg ${isDueSoon ? 'bg-orange-50 dark:bg-orange-900/20' : 'bg-gray-50 dark:bg-gray-800'}`}>
          <Calendar className={`h-4 w-4 ${isDueSoon ? 'text-orange-500' : 'text-gray-500'}`} />
          <div className="flex-1">
            <p className="text-sm font-medium">Next Billing</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {new Date(nextBillingDate).toLocaleDateString()}
            </p>
          </div>
          {isDueSoon && (
            <AlertCircle className="h-4 w-4 text-orange-500" />
          )}
        </div>

        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600 dark:text-gray-400">Auto-renew</span>
          <span className={autoRenew ? 'text-green-500' : 'text-red-500'}>
            {autoRenew ? 'Enabled' : 'Disabled'}
          </span>
        </div>

        {(onEdit || onCancel) && (
          <div className="flex gap-2 pt-2">
            {onEdit && (
              <Button variant="outline" size="sm" className="flex-1" onClick={onEdit}>
                Edit
              </Button>
            )}
            {onCancel && isActive && (
              <Button variant="ghost" size="sm" className="flex-1 text-red-500" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
