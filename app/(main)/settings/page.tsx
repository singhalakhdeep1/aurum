/**
 * Settings Page
 * User account and application settings
 */

'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/ui/card';
import { Button } from '@/shared/components/ui/ui/button';
import { Switch } from '@/shared/components/ui/ui/switch';
import { Input } from '@/shared/components/ui/ui/input';
import { Label } from '@/shared/components/ui/ui/label';
import { User, Bell, Shield, Globe, CreditCard, Palette, Loader2 } from 'lucide-react';
import { UserButton } from '@clerk/nextjs';
import { useEffect, useState } from 'react';

interface UserSettings {
  pushNotifications: boolean;
  emailNotifications: boolean;
  budgetAlerts: boolean;
  biometricAuth: boolean;
  language: string;
  currency: string;
  darkMode: boolean;
}

interface PaymentMethod {
  id: string;
  type: string;
  lastFour: string;
  expiryDate: string;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const [settingsRes, paymentRes] = await Promise.all([
          fetch('/api/user/settings'),
          fetch('/api/user/payment-methods'),
        ]);

        if (!settingsRes.ok) throw new Error('Failed to fetch settings');
        if (!paymentRes.ok) throw new Error('Failed to fetch payment methods');

        const settingsData = await settingsRes.json();
        const paymentData = await paymentRes.json();

        setSettings(settingsData);
        setPaymentMethods(paymentData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load settings');
      } finally {
        setLoading(false);
      }
    }

    fetchSettings();
  }, []);

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
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage your account and preferences
        </p>
      </div>

      <div className="space-y-6">
        {/* Profile Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile
            </CardTitle>
            <CardDescription>
              Manage your account information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <UserButton />
              </div>
              <div>
                <h3 className="font-medium">Account</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Manage your Clerk account
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>
              Configure your notification preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="push-notifications">Push Notifications</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Receive push notifications for transactions and updates
                </p>
              </div>
              <Switch 
                id="push-notifications" 
                checked={settings?.pushNotifications}
                onCheckedChange={(checked) => setSettings(prev => prev ? {...prev, pushNotifications: checked} : null)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email-notifications">Email Notifications</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Receive email notifications for important events
                </p>
              </div>
              <Switch 
                id="email-notifications" 
                checked={settings?.emailNotifications}
                onCheckedChange={(checked) => setSettings(prev => prev ? {...prev, emailNotifications: checked} : null)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="budget-alerts">Budget Alerts</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Get notified when you're approaching budget limits
                </p>
              </div>
              <Switch 
                id="budget-alerts" 
                checked={settings?.budgetAlerts}
                onCheckedChange={(checked) => setSettings(prev => prev ? {...prev, budgetAlerts: checked} : null)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Security Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security
            </CardTitle>
            <CardDescription>
              Manage your security settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="biometric-auth">Biometric Authentication</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Use fingerprint or Face ID for quick login
                </p>
              </div>
              <Switch 
                id="biometric-auth" 
                checked={settings?.biometricAuth}
                onCheckedChange={(checked) => setSettings(prev => prev ? {...prev, biometricAuth: checked} : null)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Add an extra layer of security to your account
                </p>
              </div>
              <Button variant="outline" size="sm">
                Enable
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Language Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Language & Region
            </CardTitle>
            <CardDescription>
              Set your language and regional preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <select
                id="language"
                value={settings?.language || 'en'}
                onChange={(e) => setSettings(prev => prev ? {...prev, language: e.target.value} : null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-700"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="zh">Chinese</option>
                <option value="ja">Japanese</option>
                <option value="ko">Korean</option>
                <option value="hi">Hindi</option>
                <option value="ar">Arabic</option>
                <option value="pt">Portuguese</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <select
                id="currency"
                value={settings?.currency || 'USD'}
                onChange={(e) => setSettings(prev => prev ? {...prev, currency: e.target.value} : null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-700"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="JPY">JPY</option>
                <option value="INR">INR</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Payment Methods Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment Methods
            </CardTitle>
            <CardDescription>
              Manage your payment methods for subscriptions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {paymentMethods.length === 0 ? (
              <p className="text-sm text-gray-600 dark:text-gray-400">No payment methods added</p>
            ) : (
              paymentMethods.map((method) => (
                <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">{method.type} ending in {method.lastFour}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Expires {method.expiryDate}</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Remove
                  </Button>
                </div>
              ))
            )}
            <Button variant="outline" className="w-full">
              Add Payment Method
            </Button>
          </CardContent>
        </Card>

        {/* Appearance Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Appearance
            </CardTitle>
            <CardDescription>
              Customize the look and feel
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="dark-mode">Dark Mode</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Switch between light and dark themes
                </p>
              </div>
              <Switch 
                id="dark-mode" 
                checked={settings?.darkMode}
                onCheckedChange={(checked) => setSettings(prev => prev ? {...prev, darkMode: checked} : null)}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
