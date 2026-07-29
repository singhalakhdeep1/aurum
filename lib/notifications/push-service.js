import webpush from 'web-push';

// Configure VAPID keys (these should be in your .env file)
const publicVapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const privateVapidKey = process.env.VAPID_PRIVATE_KEY;

if (!publicVapidKey || !privateVapidKey) {
  console.warn('VAPID keys not configured. Push notifications will not work.');
}

webpush.setVapidDetails(
  'mailto:your-email@example.com',
  publicVapidKey,
  privateVapidKey
);

/**
 * Send push notification to a subscriber
 */
export async function sendPushNotification(subscription, data) {
  try {
    await webpush.sendNotification(subscription, JSON.stringify(data));
    return { success: true };
  } catch (error) {
    console.error('Push notification error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Send notification to multiple subscribers
 */
export async function sendBulkPushNotifications(subscriptions, data) {
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
export function generateVapidKeys() {
  return webpush.generateVAPIDKeys();
}
