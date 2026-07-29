/**
 * Clerk Webhook Handler
 * Handles Clerk authentication events
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/db/prisma';
import { handleApiError } from '@/shared/lib/middleware/error-handler';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const eventType = body.type;
    const data = body.data;
    
    // Verify webhook signature
    // const svix = new Svix(process.env.CLERK_WEBHOOK_SECRET);
    // const evt = svix.verify(req.body, headers);
    
    // Handle different event types
    switch (eventType) {
      case 'user.created':
        // Create user in database
        await prisma.user.create({
          data: {
            clerkUserId: data.id,
            email: data.email_addresses[0]?.email_address,
            name: `${data.first_name} ${data.last_name}`.trim(),
            imageUrl: data.image_url,
          },
        });
        break;
        
      case 'user.updated':
        // Update user in database
        await prisma.user.update({
          where: { clerkUserId: data.id },
          data: {
            email: data.email_addresses[0]?.email_address,
            name: `${data.first_name} ${data.last_name}`.trim(),
            imageUrl: data.image_url,
          },
        });
        break;
        
      case 'user.deleted':
        // Delete user from database
        await prisma.user.delete({
          where: { clerkUserId: data.id },
        });
        break;
        
      default:
        console.log(`Unhandled Clerk event type: ${eventType}`);
    }
    
    return NextResponse.json({ received: true });
  } catch (error) {
    return handleApiError(error);
  }
}
