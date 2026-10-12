/**
 * Bank Feed Linking Page
 * Link bank accounts with Plaid and import their transactions automatically.
 */

'use client';

import { useCallback, useEffect, useState } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import { toast } from 'sonner';
import { CheckCircle, Link as LinkIcon, Loader2, RefreshCw, Shield } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface LinkedAccount {
  id: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  balance: number;
  status: string;
  lastSync: string | null;
}

async function api<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error || 'Request failed');
  return body as T;
}

export default function BankPage() {
  const [accounts, setAccounts] = useState<LinkedAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);

  const load = useCallback(async () => {
    try {
      setAccounts(await api<LinkedAccount[]>('/api/bank/accounts'));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load linked accounts');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: async (publicToken, metadata) => {
      try {
        const result = await api<{ linked: number; imported: number }>('/api/bank/exchange', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ publicToken, institutionName: metadata.institution?.name }),
        });
        toast.success(`Linked ${result.linked} account(s), imported ${result.imported} transactions`);
        await load();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Failed to link account');
      } finally {
        setLinkToken(null);
      }
    },
    onExit: () => setLinkToken(null),
  });

  // Open Plaid Link as soon as a fresh token has been loaded
  useEffect(() => {
    if (linkToken && ready) open();
  }, [linkToken, ready, open]);

  const startLinking = async () => {
    setStarting(true);
    try {
      const { linkToken } = await api<{ linkToken: string }>('/api/bank/link-token', { method: 'POST' });
      setLinkToken(linkToken);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not start bank linking');
    } finally {
      setStarting(false);
    }
  };

  const sync = async (id: string) => {
    setBusyId(id);
    try {
      const result = await api<{ added: number }>('/api/bank/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      toast.success(result.added ? `Imported ${result.added} new transactions` : 'Already up to date');
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Sync failed');
    } finally {
      setBusyId(null);
    }
  };

  const unlink = async (account: LinkedAccount) => {
    if (!confirm(`Unlink ${account.bankName} - ${account.accountName}? Imported transactions are kept.`)) return;
    setBusyId(account.id);
    try {
      await api(`/api/bank/accounts/${account.id}`, { method: 'DELETE' });
      toast.success('Account unlinked');
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to unlink account');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Bank Feed Linking</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Connect your bank accounts for automatic transaction import
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Link New Account</CardTitle>
              <CardDescription>Connect a bank account securely through Plaid</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                className="w-full h-24 flex flex-col items-center justify-center gap-2 text-lg"
                onClick={startLinking}
                disabled={starting || Boolean(linkToken)}
              >
                {starting ? <Loader2 className="h-8 w-8 animate-spin" /> : <LinkIcon className="h-8 w-8" />}
                Link Bank Account
              </Button>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Shield className="h-4 w-4" />
                <span>Secure connection via Plaid</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Your bank credentials go directly to Plaid and are never seen or stored by Aurum.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Linked Accounts</CardTitle>
              <CardDescription>
                Each linked account also appears in your accounts list, and new transactions are imported
                automatically.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                </div>
              ) : error ? (
                <div className="text-center py-8 text-sm text-gray-600 dark:text-gray-400">{error}</div>
              ) : accounts.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">No linked accounts yet</div>
              ) : (
                <div className="space-y-4">
                  {accounts.map((account) => (
                    <div
                      key={account.id}
                      className="flex flex-col gap-4 p-4 border rounded-lg sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                          <CheckCircle className="h-6 w-6 text-blue-500" />
                        </div>
                        <div>
                          <h4 className="font-medium">{account.bankName}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {account.accountName} • {account.accountNumber}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {account.lastSync ? `Last synced: ${new Date(account.lastSync).toLocaleString()}` : 'Not synced yet'}
                          </p>
                        </div>
                      </div>
                      <div className="sm:text-right">
                        <p className="text-lg font-bold">
                          ${account.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                        <div className="flex gap-2 mt-2 sm:justify-end">
                          <Button variant="outline" size="sm" disabled={busyId === account.id} onClick={() => sync(account.id)}>
                            {busyId === account.id ? (
                              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                            ) : (
                              <RefreshCw className="h-4 w-4 mr-1" />
                            )}
                            Sync
                          </Button>
                          <Button variant="ghost" size="sm" disabled={busyId === account.id} onClick={() => unlink(account)}>
                            Unlink
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            How your data is handled
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
            {[
              'Bank credentials are entered into Plaid and never reach Aurum',
              'Access tokens are encrypted at rest (AES-256-GCM)',
              'Read-only access: Aurum cannot move your money',
              'You can unlink any account at any time; imported transactions are kept',
            ].map((line) => (
              <li key={line} className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
