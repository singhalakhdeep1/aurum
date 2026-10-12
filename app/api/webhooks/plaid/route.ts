/**
 * Plaid webhook: verifies the signature, then imports new transactions
 * whenever Plaid reports updates for an item.
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyWebhook } from '@/shared/lib/bank/plaid';
import { syncBankItem } from '@/shared/lib/bank/sync';

export async function POST(req: NextRequest) {
  const rawBody = await req.text();

  if (!(await verifyWebhook(rawBody, req.headers.get('plaid-verification')))) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  try {
    const body = JSON.parse(rawBody);
    if (body.webhook_type === 'TRANSACTIONS' && body.webhook_code === 'SYNC_UPDATES_AVAILABLE' && body.item_id) {
      await syncBankItem(body.item_id);
    }
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Plaid webhook processing failed:', error);
    // 500 makes Plaid retry the delivery
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
