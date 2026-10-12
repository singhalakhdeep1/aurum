/**
 * Clerk webhook: keeps the local user table in sync with Clerk.
 * Every request must carry a valid Svix signature (CLERK_WEBHOOK_SECRET).
 */

import { NextRequest, NextResponse } from 'next/server';
import { Webhook } from 'svix';
import { prisma } from '@/shared/lib/db/prisma';

interface ClerkUserData {
  id: string;
  first_name: string | null;
  last_name: string | null;
  image_url: string | null;
  primary_email_address_id: string | null;
  email_addresses: { id: string; email_address: string }[];
}

interface ClerkEvent {
  type: string;
  data: ClerkUserData;
}

function primaryEmail(data: ClerkUserData): string | undefined {
  return (data.email_addresses.find((e) => e.id === data.primary_email_address_id) ?? data.email_addresses[0])?.email_address;
}

export async function POST(req: NextRequest) {
  const secret = process.env.CLERK_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: 'Webhook is not configured' }, { status: 503 });
  }

  const payload = await req.text();
  let event: ClerkEvent;
  try {
    event = new Webhook(secret).verify(payload, {
      'svix-id': req.headers.get('svix-id') ?? '',
      'svix-timestamp': req.headers.get('svix-timestamp') ?? '',
      'svix-signature': req.headers.get('svix-signature') ?? '',
    }) as ClerkEvent;
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    const { type, data } = event;

    if (type === 'user.created' || type === 'user.updated') {
      const email = primaryEmail(data);
      if (!email) return NextResponse.json({ received: true });

      const fields = {
        email,
        name: [data.first_name, data.last_name].filter(Boolean).join(' ') || null,
        imageUrl: data.image_url,
      };
      // Upsert: the profile may already exist (created on first sign-in) and events can be redelivered
      await prisma.user.upsert({
        where: { clerkUserId: data.id },
        update: fields,
        create: { clerkUserId: data.id, ...fields },
      });
    } else if (type === 'user.deleted') {
      await prisma.user.deleteMany({ where: { clerkUserId: data.id } });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Clerk webhook processing failed:', error);
    // 500 makes Clerk retry the delivery
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
