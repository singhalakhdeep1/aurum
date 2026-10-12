/**
 * GET /api/user/profile - Profile with XP, level and achievements
 * PUT /api/user/profile - Update display name
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/shared/lib/db/prisma';
import { requireAuth } from '@/shared/lib/middleware/auth';
import { handleApiError } from '@/shared/lib/middleware/error-handler';
import { getProfileStats } from '@/shared/lib/social/profile-stats';

const updateProfileSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100),
});

export async function GET(req: NextRequest) {
  try {
    const userId = await requireAuth(req);
    return NextResponse.json(await getProfileStats(userId));
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const userId = await requireAuth(req);
    const { name } = updateProfileSchema.parse(await req.json());
    await prisma.user.update({ where: { id: userId }, data: { name } });
    return NextResponse.json(await getProfileStats(userId));
  } catch (error) {
    return handleApiError(error);
  }
}
