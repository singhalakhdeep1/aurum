/**
 * Crypto Page
 * Watch-only wallets: save public addresses and see their on-chain native balances.
 * Aurum never asks for, stores or transmits private keys or seed phrases.
 */

'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { AlertCircle, Loader2, Plus, Shield, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const CHAINS = [
  ['ethereum', 'Ethereum'],
  ['polygon', 'Polygon'],
  ['bsc', 'BNB Smart Chain'],
] as const;

interface Wallet {
  id: string;
  chain: string;
  address: string;
  label: string | null;
  symbol: string | null;
  balance: string | null;
  error: string | null;
}

const chainName = (id: string) => CHAINS.find(([v]) => v === id)?.[1] ?? id;
const shorten = (a: string) => `${a.slice(0, 6)}…${a.slice(-4)}`;

export default function CryptoPage() {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ chain: 'ethereum', address: '', label: '' });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/crypto/wallet');
      if (!res.ok) throw new Error('Failed to load wallets');
      setWallets(await res.json());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load wallets');
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
      const res = await fetch('/api/crypto/wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chain: form.chain, address: form.address.trim(), label: form.label.trim() || undefined }),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'Failed to add wallet');
      toast.success('Wallet added');
      setForm({ chain: form.chain, address: '', label: '' });
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to add wallet');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (wallet: Wallet) => {
    if (!confirm(`Stop watching ${wallet.label || shorten(wallet.address)}?`)) return;
    try {
      const res = await fetch(`/api/crypto/wallet/${wallet.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to remove wallet');
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to remove wallet');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Crypto Wallets</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Watch balances for Ethereum, Polygon and BNB Smart Chain addresses</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add a wallet</CardTitle>
          <CardDescription className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Public address only. Never enter a private key or seed phrase.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={add} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="chain">Network</Label>
              <select
                id="chain"
                value={form.chain}
                onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm((f) => ({ ...f, chain: e.target.value }))}
                className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm dark:bg-gray-900"
              >
                {CHAINS.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2 lg:col-span-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                required
                pattern="0x[a-fA-F0-9]{40}"
                placeholder="0x…"
                value={form.address}
                onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm((f) => ({ ...f, address: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="label">Label (optional)</Label>
              <Input id="label" maxLength={100} value={form.label} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm((f) => ({ ...f, label: e.target.value }))} />
            </div>
            <div className="sm:col-span-2 lg:col-span-4">
              <Button type="submit" disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                Add wallet
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Watched wallets</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center py-8 gap-3 text-sm text-gray-600 dark:text-gray-400">
              <AlertCircle className="h-8 w-8 text-red-500" />
              {error}
            </div>
          ) : wallets.length === 0 ? (
            <p className="text-center py-8 text-gray-600 dark:text-gray-400">No wallets yet.</p>
          ) : (
            <div className="space-y-3">
              {wallets.map((w) => (
                <div key={w.id} className="flex items-center justify-between gap-4 rounded-lg border p-4">
                  <div className="min-w-0">
                    <p className="font-medium truncate">{w.label || shorten(w.address)}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                      {chainName(w.chain)} · <span className="font-mono">{w.address}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <p className="font-semibold">
                      {w.balance !== null ? `${Number(w.balance).toLocaleString(undefined, { maximumFractionDigits: 6 })} ${w.symbol}` : w.error}
                    </p>
                    <Button size="icon" variant="ghost" aria-label="Remove wallet" onClick={() => remove(w)}>
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
