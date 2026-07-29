import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function POST(request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const subscription = await request.json();

    // Store subscription in database (you may need to add a PushSubscription model)
    // For now, we'll store it in a JSON field in the User model
    const user = await prisma.user.update({
      where: { clerkUserId: userId },
      data: {
        pushSubscription: subscription,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Subscription error:', error);
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
  }
}
