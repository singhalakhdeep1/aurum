/** POST /api/bank/link-token - Start a Plaid Link session. */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/shared/lib/middleware/auth';
import { handleApiError } from '@/shared/lib/middleware/error-handler';
import { createLinkToken, isPlaidConfigured } from '@/shared/lib/bank/plaid';

export async function POST(req: NextRequest) {
  try {
    const userId = await requireAuth(req);
    if (!isPlaidConfigured()) {
      return NextResponse.json({ error: 'Bank linking is not configured on this server' }, { status: 503 });
    }
    return NextResponse.json({ linkToken: await createLinkToken(userId) });
  } catch (error) {
    return handleApiError(error);
  }
}
