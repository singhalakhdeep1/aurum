/**
 * Budget Tracker Component
 * Reusable component for tracking budget progress
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, AlertCircle, MoreHorizontal } from 'lucide-react';

interface BudgetTrackerProps {
  category: string;
  amount: number;
  spent: number;
  remaining: number;
  percentage: number;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function BudgetTracker({
  category,
  amount,
  spent,
  remaining,
  percentage,
  onEdit,
  onDelete,
}: BudgetTrackerProps) {
  const isOverBudget = remaining < 0;
  const isNearLimit = percentage >= 80 && percentage < 100;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{category}</CardTitle>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-2xl font-bold">${spent.toFixed(2)}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              of ${amount.toFixed(2)} budget
            </p>
          </div>
          <div className={`text-right ${isOverBudget ? 'text-red-500' : isNearLimit ? 'text-orange-500' : 'text-green-500'}`}>
            <p className="text-lg font-bold">${remaining.toFixed(2)}</p>
            <p className="text-sm">
              {isOverBudget ? 'over' : 'remaining'}
            </p>
          </div>
        </div>

        <Progress
          value={Math.min(percentage, 100)}
          className={`h-3 ${isOverBudget ? 'bg-red-500' : isNearLimit ? 'bg-orange-500' : ''}`}
        />

        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600 dark:text-gray-400">{percentage.toFixed(0)}% used</span>
          <div className="flex items-center gap-1">
            {isOverBudget ? (
              <AlertCircle className="h-4 w-4 text-red-500" />
            ) : percentage >= 50 ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-blue-500" />
            )}
            <span className={isOverBudget ? 'text-red-500' : isNearLimit ? 'text-orange-500' : 'text-gray-600 dark:text-gray-400'}>
              {isOverBudget ? 'Over budget' : isNearLimit ? 'Near limit' : 'On track'}
            </span>
          </div>
        </div>

        {(onEdit || onDelete) && (
          <div className="flex gap-2 pt-2">
            {onEdit && (
              <Button variant="outline" size="sm" className="flex-1" onClick={onEdit}>
                Edit
              </Button>
            )}
            {onDelete && (
              <Button variant="ghost" size="sm" className="flex-1 text-red-500" onClick={onDelete}>
                Delete
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
