/**
 * Settings Page
 * Notification preferences (saved to the server, honoured by the email and push
 * jobs) and appearance. Account security is managed through Clerk.
 */

'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { toast } from 'sonner';
import { UserButton } from '@clerk/nextjs';
import { Bell, Loader2, Moon, Palette, Shield, Sun, Monitor, User } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface UserSettings {
  pushNotifications: boolean;
  emailNotifications: boolean;
  budgetAlerts: boolean;
}

const TOGGLES: { key: keyof UserSettings; label: string; description: string }[] = [
  { key: 'pushNotifications', label: 'Push Notifications', description: 'Browser notifications for budget alerts. Use the bell in the header to enable them on this device.' },
  { key: 'emailNotifications', label: 'Email Notifications', description: 'Budget alerts and your monthly financial report by email.' },
  { key: 'budgetAlerts', label: 'Budget Alerts', description: 'Get notified when you pass 80% of your monthly budget.' },
];

const THEMES = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
] as const;

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    async function load() {
      try {
        const res = await fetch('/api/user/settings');
        if (!res.ok) throw new Error('Failed to load settings');
        setSettings(await res.json());
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load settings');
      }
    }
    load();
  }, []);

  const update = async (key: keyof UserSettings, value: boolean) => {
    if (!settings) return;
    const previous = settings;
    setSettings({ ...settings, [key]: value });
    try {
      const res = await fetch('/api/user/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [key]: value }),
      });
      if (!res.ok) throw new Error('Failed to save');
      toast.success('Settings saved');
    } catch {
      setSettings(previous);
      toast.error('Could not save your change');
    }
  };

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

  if (!settings) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[300px]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your account and preferences</p>
      </div>

      <div className="space-y-6 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Account
            </CardTitle>
            <CardDescription>Name, email and sign-in methods are managed in your account menu</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-4">
            <UserButton />
            <p className="text-sm text-gray-600 dark:text-gray-400">Click your avatar and choose &ldquo;Manage account&rdquo;.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>Changes are saved automatically</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {TOGGLES.map(({ key, label, description }) => (
              <div key={key} className="flex items-center justify-between gap-4">
                <div>
                  <Label htmlFor={key}>{label}</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
                </div>
                <Switch id={key} checked={settings[key]} onCheckedChange={(checked: boolean) => update(key, checked)} />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security
            </CardTitle>
            <CardDescription>Two-factor authentication and active sessions</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-gray-600 dark:text-gray-400">
            Security options such as two-factor authentication are available under <strong>Manage account &rarr; Security</strong> in your account menu above.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Appearance
            </CardTitle>
            <CardDescription>Choose how Aurum looks on this device</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              {THEMES.map(({ value, label, icon: Icon }) => (
                <Button
                  key={value}
                  variant={mounted && theme === value ? 'default' : 'outline'}
                  onClick={() => setTheme(value)}
                  className="flex-1"
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
