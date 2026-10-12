'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Bell, BellOff } from 'lucide-react';
import { toast } from 'sonner';

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

function urlBase64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = window.atob(base64);
  const output = new Uint8Array(new ArrayBuffer(raw.length));
  for (let i = 0; i < raw.length; i++) output[i] = raw.charCodeAt(i);
  return output;
}

/** Bell button in the header: asks for permission and registers this browser for web push. */
export default function NotificationPermission() {
  const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>('default');

  useEffect(() => {
    if (!VAPID_PUBLIC_KEY || !('Notification' in window) || !('serviceWorker' in navigator) || !('PushManager' in window)) {
      setPermission('unsupported');
      return;
    }
    setPermission(Notification.permission);
  }, []);

  const enable = async () => {
    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      if (result !== 'granted') {
        toast.error('Notification permission denied');
        return;
      }

      const registration = await navigator.serviceWorker.ready;
      const subscription =
        (await registration.pushManager.getSubscription()) ??
        (await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY!),
        }));

      const res = await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subscription.toJSON()),
      });
      if (!res.ok) throw new Error('Failed to save subscription');

      toast.success('Notifications enabled!');
    } catch (error) {
      console.error('Push subscription error:', error);
      toast.error('Failed to enable notifications');
    }
  };

  // Push is not configured or not supported in this browser: render nothing
  if (permission === 'unsupported') return null;

  if (permission === 'granted') {
    return (
      <Button variant="ghost" size="icon" title="Notifications enabled" aria-label="Notifications enabled">
        <Bell className="h-5 w-5 text-green-500" />
      </Button>
    );
  }

  if (permission === 'denied') {
    return (
      <Button variant="ghost" size="icon" title="Notifications blocked in browser settings" aria-label="Notifications blocked">
        <BellOff className="h-5 w-5 text-red-500" />
      </Button>
    );
  }

  return (
    <Button variant="ghost" size="icon" onClick={enable} title="Enable notifications" aria-label="Enable notifications">
      <Bell className="h-5 w-5" />
    </Button>
  );
}
