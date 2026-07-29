'use client';

import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Bell, BellOff } from 'lucide-react';
import { toast } from 'sonner';

export default function NotificationPermission() {
  const [permission, setPermission] = useState('default');
  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if (!('Notification' in window)) {
      toast.error('This browser does not support notifications');
      return;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);

      if (result === 'granted') {
        await subscribeToPush();
        toast.success('Notifications enabled!');
      } else {
        toast.error('Notification permission denied');
      }
    } catch (error) {
      toast.error('Failed to request notification permission');
    }
  };

  const subscribeToPush = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY),
      });

      setSubscription(subscription);
      
      // Send subscription to your backend
      await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subscription),
      });
    } catch (error) {
      console.error('Push subscription error:', error);
      toast.error('Failed to subscribe to push notifications');
    }
  };

  if (permission === 'granted') {
    return (
      <Button variant="ghost" size="icon">
        <Bell className="h-5 w-5 text-green-500" />
      </Button>
    );
  }

  if (permission === 'denied') {
    return (
      <Button variant="ghost" size="icon">
        <BellOff className="h-5 w-5 text-red-500" />
      </Button>
    );
  }

  return (
    <Button variant="ghost" size="icon" onClick={requestPermission}>
      <Bell className="h-5 w-5" />
    </Button>
  );
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  
  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  
  return outputArray;
}
