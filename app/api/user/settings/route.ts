/**
 * GET /api/user/settings - Notification preferences
 * PUT /api/user/settings - Update any subset of them
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/shared/lib/db/prisma';
import { requireAuth } from '@/shared/lib/middleware/auth';
import { handleApiError } from '@/shared/lib/middleware/error-handler';

const updateSettingsSchema = z
  .object({
    pushNotifications: z.boolean(),
    emailNotifications: z.boolean(),
    budgetAlerts: z.boolean(),
  })
  .partial();

const select = {
  pushNotifications: true,
  emailNotifications: true,
  budgetAlerts: true,
} as const;

export async function GET(req: NextRequest) {
  try {
    const userId = await requireAuth(req);
    const settings = await prisma.userSettings.upsert({
      where: { userId },
      update: {},
      create: { userId },
      select,
    });
    return NextResponse.json(settings);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const userId = await requireAuth(req);
    const data = updateSettingsSchema.parse(await req.json());
    const settings = await prisma.userSettings.upsert({
      where: { userId },
      update: data,
      create: { userId, ...data },
      select,
    });
    return NextResponse.json(settings);
  } catch (error) {
    return handleApiError(error);
  }
}
