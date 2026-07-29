/**
 * Portfolio Card Component
 * Reusable component for displaying investment portfolio items
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/ui/card';
import { Button } from '@/shared/components/ui/ui/button';
import { TrendingUp, TrendingDown, MoreHorizontal } from 'lucide-react';

interface PortfolioCardProps {
  symbol: string;
  name: string;
  type: string;
  quantity: number;
  averageCost: number;
  currentPrice: number;
  totalValue: number;
  gainLoss: number;
  gainLossPercentage: number;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function PortfolioCard({
  symbol,
  name,
  type,
  quantity,
  averageCost,
  currentPrice,
  totalValue,
  gainLoss,
  gainLossPercentage,
  onEdit,
  onDelete,
}: PortfolioCardProps) {
  const isProfit = gainLoss >= 0;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{symbol}</CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400">{name}</p>
          </div>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-gray-600 dark:text-gray-400">Type</p>
            <p className="font-medium capitalize">{type}</p>
          </div>
          <div>
            <p className="text-gray-600 dark:text-gray-400">Quantity</p>
            <p className="font-medium">{quantity}</p>
          </div>
          <div>
            <p className="text-gray-600 dark:text-gray-400">Avg Cost</p>
            <p className="font-medium">${averageCost.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-gray-600 dark:text-gray-400">Current</p>
            <p className="font-medium">${currentPrice.toFixed(2)}</p>
          </div>
        </div>

        <div className="border-t pt-3">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Value</p>
              <p className="text-xl font-bold">${totalValue.toLocaleString()}</p>
            </div>
            <div className={`text-right ${isProfit ? 'text-green-500' : 'text-red-500'}`}>
              <div className="flex items-center gap-1 justify-end">
                {isProfit ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                <p className="font-bold">${gainLoss.toFixed(2)}</p>
              </div>
              <p className="text-sm">{gainLossPercentage.toFixed(2)}%</p>
            </div>
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
                Sell
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
