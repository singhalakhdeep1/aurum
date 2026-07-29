/**
 * Investment Portfolio Page
 * View and manage investment portfolio
 */

'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/ui/card';
import { Button } from '@/shared/components/ui/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/ui/table';
import { Plus, TrendingUp, TrendingDown, DollarSign, Loader2, AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Investment {
  id: string;
  symbol: string;
  name: string;
  type: string;
  quantity: number;
  averageCost: number;
  currentPrice: number;
  totalValue: number;
  totalCost: number;
  gainLoss: number;
  gainLossPercentage: number;
}

export default function InvestmentsPage() {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchInvestments() {
      try {
        const response = await fetch('/api/investments');
        if (!response.ok) throw new Error('Failed to fetch investments');
        const data = await response.json();
        setInvestments(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load investments');
      } finally {
        setLoading(false);
      }
    }

    fetchInvestments();
  }, []);

  const totalValue = investments.reduce((sum, inv) => sum + inv.totalValue, 0);
  const totalCost = investments.reduce((sum, inv) => sum + inv.totalCost, 0);
  const totalGainLoss = totalValue - totalCost;
  const totalGainLossPercentage = totalCost > 0 ? (totalGainLoss / totalCost) * 100 : 0;

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
            <h3 className="text-lg font-medium mb-2">Error loading investments</h3>
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
          <h1 className="text-3xl font-bold">Investment Portfolio</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track your investment performance
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Investment
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Current portfolio value
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalCost.toLocaleString()}</div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Total investment cost
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Gain/Loss</CardTitle>
            {totalGainLoss >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalGainLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              ${totalGainLoss.toLocaleString()}
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              {totalGainLossPercentage.toFixed(2)}% return
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Investments</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{investments.length}</div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Total positions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Investment Table */}
      <Card>
        <CardHeader>
          <CardTitle>Your Investments</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Symbol</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Avg Cost</TableHead>
                <TableHead className="text-right">Current Price</TableHead>
                <TableHead className="text-right">Total Value</TableHead>
                <TableHead className="text-right">Gain/Loss</TableHead>
                <TableHead className="text-right">Return %</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {investments.map((investment) => (
                <TableRow key={investment.id}>
                  <TableCell className="font-medium">{investment.symbol}</TableCell>
                  <TableCell>{investment.name}</TableCell>
                  <TableCell className="capitalize">{investment.type}</TableCell>
                  <TableCell className="text-right">{investment.quantity}</TableCell>
                  <TableCell className="text-right">${investment.averageCost}</TableCell>
                  <TableCell className="text-right">${investment.currentPrice}</TableCell>
                  <TableCell className="text-right">${investment.totalValue.toLocaleString()}</TableCell>
                  <TableCell className={`text-right ${investment.gainLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    ${investment.gainLoss}
                  </TableCell>
                  <TableCell className={`text-right ${investment.gainLossPercentage >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {investment.gainLossPercentage.toFixed(2)}%
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
