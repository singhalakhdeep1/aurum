/**
 * Bank Feed Linking Page
 * Link bank accounts using Plaid for automatic transaction import
 */

'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/ui/card';
import { Button } from '@/shared/components/ui/ui/button';
import { Link, CheckCircle, AlertCircle, RefreshCw, Shield, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface LinkedAccount {
  id: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  balance: number;
  status: string;
  lastSync: string;
}

export default function BankPage() {
  const [linkedAccounts, setLinkedAccounts] = useState<LinkedAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLinkedAccounts() {
      try {
        const response = await fetch('/api/bank/accounts');
        if (!response.ok) throw new Error('Failed to fetch linked accounts');
        const data = await response.json();
        setLinkedAccounts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load linked accounts');
      } finally {
        setLoading(false);
      }
    }

    fetchLinkedAccounts();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Bank Feed Linking</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Connect your bank accounts for automatic transaction import
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Link New Account */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Link New Account</CardTitle>
              <CardDescription>
                Connect a new bank account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full h-24 flex flex-col items-center justify-center gap-2 text-lg">
                <Link className="h-8 w-8" />
                Link Bank Account
              </Button>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Shield className="h-4 w-4" />
                <span>Secure connection via Plaid</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Your credentials are encrypted and never stored on our servers.
              </p>
            </CardContent>
          </Card>

          {/* Supported Banks */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Supported Banks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2">
                {['Chase', 'Bank of America', 'Wells Fargo', 'Citi', 'US Bank', 'Capital One'].map((bank) => (
                  <div key={bank} className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded text-sm">
                    {bank}
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                And 10,000+ more institutions
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Linked Accounts */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Linked Accounts</CardTitle>
              <CardDescription>
                Your connected bank accounts
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                </div>
              ) : error ? (
                <div className="text-center py-8 text-sm text-gray-600 dark:text-gray-400">
                  {error}
                </div>
              ) : linkedAccounts.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <p>No linked accounts</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Link Your First Account
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {linkedAccounts.map((account) => (
                    <div key={account.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                          <CheckCircle className="h-6 w-6 text-blue-500" />
                        </div>
                        <div>
                          <h4 className="font-medium">{account.bankName}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {account.accountName} • {account.accountNumber}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                            Last synced: {new Date(account.lastSync).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold">${account.balance.toLocaleString()}</p>
                        <div className="flex gap-2 mt-2">
                          <Button variant="outline" size="sm">
                            <RefreshCw className="h-4 w-4 mr-1" />
                            Sync
                          </Button>
                          <Button variant="ghost" size="sm">
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

          {/* Sync Settings */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Sync Settings</CardTitle>
              <CardDescription>
                Configure automatic transaction import
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Auto-sync</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Automatically import transactions daily
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Enable
                </Button>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Sync Frequency</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    How often to check for new transactions
                  </p>
                </div>
                <select className="px-3 py-2 border rounded-md dark:bg-gray-800">
                  <option>Daily</option>
                  <option>Weekly</option>
                  <option>Monthly</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Security Notice */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <p>Bank-level 256-bit encryption for all data transfers</p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <p>Credentials are never stored on our servers</p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <p>Read-only access - we cannot move your money</p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <p>You can unlink your account at any time</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
