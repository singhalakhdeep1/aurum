/**
 * Receipts Page
 * History of receipt scans. Scanning itself happens in the Add Transaction form,
 * where the extracted amount, date, merchant and category pre-fill the transaction.
 */

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AlertCircle, CheckCircle, Loader2, ScanLine, XCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Receipt {
  id: string;
  merchant: string;
  date: string;
  amount: number;
  status: 'success' | 'failed';
}

export default function ReceiptPage() {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/receipts');
        if (!res.ok) throw new Error('Failed to fetch receipts');
        setReceipts(await res.json());
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load receipts');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Receipts</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Your receipt scan history</p>
        </div>
        <Link href="/transaction/create">
          <Button>
            <ScanLine className="mr-2 h-4 w-4" />
            Scan a Receipt
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Scans</CardTitle>
          <CardDescription>The last 100 receipts you scanned with AI</CardDescription>
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
          ) : receipts.length === 0 ? (
            <p className="text-center py-8 text-gray-600 dark:text-gray-400">
              No receipts scanned yet. Use Add Transaction and upload a photo of a receipt to fill the form automatically.
            </p>
          ) : (
            <div className="space-y-3">
              {receipts.map((r) => (
                <div key={r.id} className="flex items-center justify-between rounded-lg border p-4">
                  <div className="flex items-center gap-3">
                    {r.status === 'success' ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                    <div>
                      <p className="font-medium">{r.status === 'success' ? r.merchant : 'Scan failed'}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{new Date(r.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  {r.status === 'success' && (
                    <p className="font-semibold">
                      ${r.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
