import webpush from 'web-push';

// Configure VAPID keys (these should be in your .env file)
const publicVapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const privateVapidKey = process.env.VAPID_PRIVATE_KEY;

if (!publicVapidKey || !privateVapidKey) {
  console.warn('VAPID keys not configured. Push notifications will not work.');
}

webpush.setVapidDetails(
  'mailto:your-email@example.com',
  publicVapidKey!,
  privateVapidKey!
);

interface PushSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

interface NotificationData {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  data?: any;
}

/**
 * Send push notification to a subscriber
 */
export async function sendPushNotification(subscription: PushSubscription, data: NotificationData): Promise<{ success: boolean; error?: string }> {
  try {
    await webpush.sendNotification(subscription, JSON.stringify(data));
    return { success: true };
  } catch (error: any) {
    console.error('Push notification error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Send notification to multiple subscribers
 */
export async function sendBulkPushNotifications(subscriptions: PushSubscription[], data: NotificationData): Promise<{
  total: number;
  successful: number;
  failed: number;
}> {
  const results = await Promise.allSettled(
    subscriptions.map(sub => sendPushNotification(sub, data))
  );
  
  return {
    total: subscriptions.length,
    successful: results.filter(r => r.status === 'fulfilled' && r.value.success).length,
    failed: results.filter(r => r.status === 'rejected' || !r.value.success).length,
  };
}

/**
 * Generate VAPID keys (run once to get keys)
 */
export function generateVapidKeys(): { publicKey: string; privateKey: string } {
  return webpush.generateVAPIDKeys();
}
