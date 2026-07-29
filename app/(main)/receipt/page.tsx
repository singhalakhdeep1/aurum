/**
 * Receipt Scanning Page
 * Scan and extract data from receipts using AI
 */

'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/ui/card';
import { Button } from '@/shared/components/ui/ui/button';
import { Camera, Upload, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

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
    async function fetchReceipts() {
      try {
        const response = await fetch('/api/receipts');
        if (!response.ok) throw new Error('Failed to fetch receipts');
        const data = await response.json();
        setReceipts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load receipts');
      } finally {
        setLoading(false);
      }
    }

    fetchReceipts();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Receipt Scanning</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Scan receipts to automatically extract transaction data
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Scan Section */}
        <Card>
          <CardHeader>
            <CardTitle>Scan Receipt</CardTitle>
            <CardDescription>
              Choose how you want to capture your receipt
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full h-32 flex flex-col items-center justify-center gap-2 text-lg">
              <Camera className="h-8 w-8" />
              Take Photo
            </Button>
            <Button variant="outline" className="w-full h-32 flex flex-col items-center justify-center gap-2 text-lg">
              <Upload className="h-8 w-8" />
              Upload Image
            </Button>
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
              Supported formats: JPG, PNG, PDF
            </p>
          </CardContent>
        </Card>

        {/* Recent Scans */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Scans</CardTitle>
            <CardDescription>
              Your recently scanned receipts
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
            ) : receipts.length === 0 ? (
              <div className="text-center py-8 text-sm text-gray-600 dark:text-gray-400">
                No receipts scanned yet
              </div>
            ) : (
              <div className="space-y-4">
                {receipts.map((receipt) => (
                  <div key={receipt.id} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      receipt.status === 'success' 
                        ? 'bg-blue-100 dark:bg-blue-900/20' 
                        : 'bg-red-100 dark:bg-red-900/20'
                    }`}>
                      {receipt.status === 'success' ? (
                        <FileText className="h-6 w-6 text-blue-500" />
                      ) : (
                        <AlertCircle className="h-6 w-6 text-red-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{receipt.merchant}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(receipt.date).toLocaleDateString()} • ${receipt.amount.toFixed(2)}
                      </p>
                    </div>
                    {receipt.status === 'success' ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <Button variant="outline" size="sm">
                        Retry
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* How it works */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>How it works</CardTitle>
          <CardDescription>
            Learn how to get the best results from receipt scanning
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-500">1</span>
              </div>
              <h3 className="font-medium mb-2">Capture</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Take a clear photo or upload an image of your receipt
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-500">2</span>
              </div>
              <h3 className="font-medium mb-2">Extract</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                AI automatically extracts date, amount, and merchant
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-500">3</span>
              </div>
              <h3 className="font-medium mb-2">Save</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Review and save the extracted data as a transaction
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Tips for better results</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <li>• Ensure good lighting when taking photos</li>
            <li>• Hold the camera steady and focus on the receipt</li>
            <li>• Make sure the entire receipt is visible in the frame</li>
            <li>• Avoid glare or shadows on the receipt</li>
            <li>• Use high-resolution images for better accuracy</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
