/**
 * Investment Portfolio Page
 * Track holdings, record price updates and see gains/losses and allocation.
 * Prices are entered manually; no market-data feed is connected.
 */

'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { AlertCircle, Check, DollarSign, Loader2, Pencil, Plus, Trash2, TrendingDown, TrendingUp, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const TYPES = [
  ['stock', 'Stock'],
  ['etf', 'ETF'],
  ['mutual_fund', 'Mutual fund'],
  ['bond', 'Bond'],
  ['crypto', 'Crypto'],
  ['real_estate', 'Real estate'],
  ['other', 'Other'],
] as const;

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

interface ApiInvestment {
  id: string;
  symbol: string;
  name: string;
  type: string;
  quantity: string | number;
  averageCost: string | number;
  currentPrice: string | number;
}

const money = (n: number) => `${n < 0 ? '-' : ''}$${Math.abs(n).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const typeLabel = (t: string) => TYPES.find(([v]) => v === t)?.[1] ?? t;

function toRow(i: ApiInvestment): Investment {
  const quantity = Number(i.quantity);
  const averageCost = Number(i.averageCost);
  const currentPrice = Number(i.currentPrice);
  const totalValue = quantity * currentPrice;
  const totalCost = quantity * averageCost;
  const gainLoss = totalValue - totalCost;
  return {
    id: i.id,
    symbol: i.symbol,
    name: i.name,
    type: i.type,
    quantity,
    averageCost,
    currentPrice,
    totalValue,
    totalCost,
    gainLoss,
    gainLossPercentage: totalCost > 0 ? (gainLoss / totalCost) * 100 : 0,
  };
}

const emptyForm = { symbol: '', name: '', type: 'stock', quantity: '', averageCost: '', currentPrice: '', purchaseDate: '' };

async function request(url: string, method: string, body?: unknown) {
  const res = await fetch(url, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Request failed');
  }
}

export default function InvestmentsPage() {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ ...emptyForm, purchaseDate: new Date().toISOString().slice(0, 10) });
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [priceDraft, setPriceDraft] = useState('');

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/investments?pageSize=100');
      if (!res.ok) throw new Error('Failed to fetch investments');
      const body: { data: ApiInvestment[] } = await res.json();
      setInvestments(body.data.map(toRow));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load investments');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await request('/api/investments', 'POST', {
        symbol: form.symbol.trim().toUpperCase(),
        name: form.name.trim(),
        type: form.type,
        quantity: parseFloat(form.quantity),
        averageCost: parseFloat(form.averageCost),
        currentPrice: parseFloat(form.currentPrice || form.averageCost),
        purchaseDate: new Date(form.purchaseDate).toISOString(),
      });
      toast.success('Investment added');
      setForm({ ...emptyForm, purchaseDate: new Date().toISOString().slice(0, 10) });
      setShowForm(false);
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to add investment');
    } finally {
      setSaving(false);
    }
  };

  const savePrice = async (id: string) => {
    const price = parseFloat(priceDraft);
    if (!Number.isFinite(price) || price <= 0) {
      toast.error('Enter a valid price');
      return;
    }
    try {
      await request(`/api/investments/${id}`, 'PUT', { currentPrice: price });
      setEditingId(null);
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update price');
    }
  };

  const remove = async (inv: Investment) => {
    if (!confirm(`Delete ${inv.symbol}?`)) return;
    try {
      await request(`/api/investments/${inv.id}`, 'DELETE');
      toast.success('Investment deleted');
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete investment');
    }
  };

  const totalValue = investments.reduce((sum, inv) => sum + inv.totalValue, 0);
  const totalCost = investments.reduce((sum, inv) => sum + inv.totalCost, 0);
  const totalGainLoss = totalValue - totalCost;
  const totalGainLossPercentage = totalCost > 0 ? (totalGainLoss / totalCost) * 100 : 0;

  const allocation = Object.entries(
    investments.reduce<Record<string, number>>((acc, inv) => ({ ...acc, [inv.type]: (acc[inv.type] ?? 0) + inv.totalValue }), {})
  ).sort((a, b) => b[1] - a[1]);

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

  const set = (key: keyof typeof emptyForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Investments</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Track your portfolio and performance</p>
        </div>
        <Button onClick={() => setShowForm((v) => !v)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Investment
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>New Investment</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={add} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="inv-symbol">Symbol</Label>
                <Input id="inv-symbol" required maxLength={20} value={form.symbol} onChange={set('symbol')} placeholder="AAPL" />
              </div>
              <div className="space-y-2 sm:col-span-1 lg:col-span-2">
                <Label htmlFor="inv-name">Name</Label>
                <Input id="inv-name" required value={form.name} onChange={set('name')} placeholder="Apple Inc." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="inv-type">Type</Label>
                <select
                  id="inv-type"
                  value={form.type}
                  onChange={set('type')}
                  className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm dark:bg-gray-900"
                >
                  {TYPES.map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="inv-qty">Quantity</Label>
                <Input id="inv-qty" required type="number" step="any" min="0.00000001" value={form.quantity} onChange={set('quantity')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="inv-cost">Average cost ($)</Label>
                <Input id="inv-cost" required type="number" step="any" min="0.00000001" value={form.averageCost} onChange={set('averageCost')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="inv-price">Current price ($)</Label>
                <Input
                  id="inv-price"
                  type="number"
                  step="any"
                  min="0.00000001"
                  value={form.currentPrice}
                  onChange={set('currentPrice')}
                  placeholder="Defaults to cost"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="inv-date">Purchase date</Label>
                <Input id="inv-date" required type="date" value={form.purchaseDate} onChange={set('purchaseDate')} />
              </div>
              <div className="flex gap-2 sm:col-span-2 lg:col-span-4">
                <Button type="submit" disabled={saving}>
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save investment'}
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
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{money(totalValue)}</div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Cost basis {money(totalCost)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Gain / Loss</CardTitle>
            {totalGainLoss >= 0 ? <TrendingUp className="h-4 w-4 text-green-500" /> : <TrendingDown className="h-4 w-4 text-red-500" />}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>{money(totalGainLoss)}</div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              {totalGainLossPercentage >= 0 ? '+' : ''}
              {totalGainLossPercentage.toFixed(2)}%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Allocation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            {allocation.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-400">No holdings yet</p>
            ) : (
              allocation.map(([type, value]) => (
                <div key={type} className="flex justify-between">
                  <span>{typeLabel(type)}</span>
                  <span className="text-gray-600 dark:text-gray-400">{totalValue ? ((value / totalValue) * 100).toFixed(1) : 0}%</span>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Holdings</CardTitle>
        </CardHeader>
        <CardContent>
          {investments.length === 0 ? (
            <p className="text-center py-8 text-gray-600 dark:text-gray-400">No investments yet. Add your first holding to start tracking.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Symbol</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Qty</TableHead>
                  <TableHead className="text-right">Avg cost</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Value</TableHead>
                  <TableHead className="text-right">Gain / loss</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {investments.map((inv) => (
                  <TableRow key={inv.id}>
                    <TableCell>
                      <div className="font-medium">{inv.symbol}</div>
                      <div className="text-xs text-gray-500">{inv.name}</div>
                    </TableCell>
                    <TableCell>{typeLabel(inv.type)}</TableCell>
                    <TableCell className="text-right">{inv.quantity}</TableCell>
                    <TableCell className="text-right">{money(inv.averageCost)}</TableCell>
                    <TableCell className="text-right">
                      {editingId === inv.id ? (
                        <span className="inline-flex items-center gap-1">
                          <Input
                            className="h-8 w-24"
                            type="number"
                            step="any"
                            autoFocus
                            value={priceDraft}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPriceDraft(e.target.value)}
                            onKeyDown={(e: React.KeyboardEvent) => e.key === 'Enter' && savePrice(inv.id)}
                          />
                          <Button size="icon" variant="ghost" className="h-8 w-8" aria-label="Save price" onClick={() => savePrice(inv.id)}>
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8" aria-label="Cancel" onClick={() => setEditingId(null)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1">
                          {money(inv.currentPrice)}
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            aria-label={`Update ${inv.symbol} price`}
                            onClick={() => {
                              setEditingId(inv.id);
                              setPriceDraft(String(inv.currentPrice));
                            }}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">{money(inv.totalValue)}</TableCell>
                    <TableCell className={`text-right ${inv.gainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {money(inv.gainLoss)}
                      <div className="text-xs">
                        {inv.gainLossPercentage >= 0 ? '+' : ''}
                        {inv.gainLossPercentage.toFixed(2)}%
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="icon" variant="ghost" aria-label={`Delete ${inv.symbol}`} onClick={() => remove(inv)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
