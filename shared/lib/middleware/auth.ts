/**
 * Authentication Middleware
 * Protects API routes with Clerk authentication
 */

import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function withAuth(handler: (req: Request, userId: string) => Promise<Response>) {
  return async (req: Request) => {
    try {
      const { userId } = await auth();
      
      if (!userId) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }
      
      return handler(req, userId);
    } catch (error) {
      return NextResponse.json(
        { error: 'Authentication failed' },
        { status: 500 }
      );
    }
  };
}

export async function requireAuth(req: Request): Promise<string> {
  const { userId } = await auth();
  
  if (!userId) {
    throw new Error('Unauthorized');
  }
  
  return userId;
}
