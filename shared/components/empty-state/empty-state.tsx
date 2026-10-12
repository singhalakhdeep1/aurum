/**
 * Empty State Component
 * Displays when there is no data to show
 */

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, FileText, Wallet, TrendingUp, CreditCard } from 'lucide-react';

interface EmptyStateProps {
  icon?: 'plus' | 'file' | 'wallet' | 'trending' | 'card';
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

const iconMap = {
  plus: Plus,
  file: FileText,
  wallet: Wallet,
  trending: TrendingUp,
  card: CreditCard,
};

export function EmptyState({
  icon = 'plus',
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  const Icon = iconMap[icon];

  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
          <Icon className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium mb-2">{title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 max-w-md">
          {description}
        </p>
        {actionLabel && onAction && (
          <Button onClick={onAction}>
            {actionLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
