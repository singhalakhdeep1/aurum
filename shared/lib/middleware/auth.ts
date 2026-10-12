/**
 * Authentication helpers for API routes (Clerk).
 */

import { auth, currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/shared/lib/db/prisma';
import { UnauthorizedError } from './error-handler';

/**
 * Returns the internal user id for the signed-in Clerk user,
 * creating the profile on first use.
 */
export async function requireAuth(_req?: Request): Promise<string> {
  const { userId: clerkUserId } = await auth();
  if (!clerkUserId) throw new UnauthorizedError();

  const existing = await prisma.user.findUnique({ where: { clerkUserId }, select: { id: true } });
  if (existing) return existing.id;

  const clerkUser = await currentUser();
  const email = clerkUser?.emailAddresses[0]?.emailAddress;
  if (!clerkUser || !email) throw new UnauthorizedError('User profile not found');

  const created = await prisma.user.create({
    data: {
      clerkUserId,
      email,
      name: [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(' ') || null,
      imageUrl: clerkUser.imageUrl,
    },
    select: { id: true },
  });
  return created.id;
}
