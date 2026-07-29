/**
 * Biometric Authentication Component
 * Handles fingerprint and face ID authentication
 */

'use client';

import { Fingerprint, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/shared/components/ui/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/ui/card';

type BiometricStatus = 'idle' | 'scanning' | 'success' | 'error';

interface BiometricAuthProps {
  onAuthenticate: () => Promise<boolean>;
  onCancel?: () => void;
}

export function BiometricAuth({ onAuthenticate, onCancel }: BiometricAuthProps) {
  const [status, setStatus] = React.useState<BiometricStatus>('idle');
  const [error, setError] = React.useState<string | null>(null);

  const handleAuthenticate = async () => {
    setStatus('scanning');
    setError(null);

    try {
      // Check if Web Authentication API is available
      if (!window.PublicKeyCredential) {
        throw new Error('Biometric authentication not supported on this device');
      }

      const success = await onAuthenticate();
      
      if (success) {
        setStatus('success');
      } else {
        setStatus('error');
        setError('Authentication failed');
      }
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Authentication failed');
    }
  };

  const handleRetry = () => {
    setStatus('idle');
    setError(null);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Fingerprint className="h-5 w-5" />
          Biometric Authentication
        </CardTitle>
        <CardDescription>
          Use your fingerprint or face ID to sign in
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col items-center py-8">
          {status === 'idle' && (
            <div className="text-center space-y-4">
              <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <Fingerprint className="h-12 w-12 text-gray-400" />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Touch the fingerprint sensor or look at your camera
              </p>
              <Button onClick={handleAuthenticate} className="w-full">
                Start Authentication
              </Button>
            </div>
          )}

          {status === 'scanning' && (
            <div className="text-center space-y-4">
              <div className="w-24 h-24 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center animate-pulse">
                <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Scanning...
              </p>
            </div>
          )}

          {status === 'success' && (
            <div className="text-center space-y-4">
              <div className="w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                <CheckCircle className="h-12 w-12 text-green-500" />
              </div>
              <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                Authentication successful
              </p>
            </div>
          )}

          {status === 'error' && (
            <div className="text-center space-y-4">
              <div className="w-24 h-24 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                <XCircle className="h-12 w-12 text-red-500" />
              </div>
              <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                {error || 'Authentication failed'}
              </p>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleRetry} className="flex-1">
                  Retry
                </Button>
                {onCancel && (
                  <Button variant="ghost" onClick={onCancel} className="flex-1">
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
          <p>Secure authentication using WebAuthn</p>
          <p className="mt-1">Your biometric data never leaves your device</p>
        </div>
      </CardContent>
    </Card>
  );
}
