/**
 * Watch-only crypto wallets.
 *
 * GET  /api/crypto/wallet - Saved addresses with live native-token balances
 * POST /api/crypto/wallet - Save a public address to watch
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/db/prisma';
import { requireAuth } from '@/shared/lib/middleware/auth';
import { handleApiError, ValidationError } from '@/shared/lib/middleware/error-handler';
import { createWalletSchema } from '@/shared/lib/validators/schemas';
import { getNativeBalance, normalizeAddress, type ChainId } from '@/shared/lib/crypto/balances';

export async function GET(req: NextRequest) {
  try {
    const userId = await requireAuth(req);
    const wallets = await prisma.walletAddress.findMany({ where: { userId }, orderBy: { createdAt: 'asc' } });

    const result = await Promise.all(
      wallets.map(async (w) => {
        try {
          const { symbol, balance } = await getNativeBalance(w.chain as ChainId, w.address);
          return { id: w.id, chain: w.chain, address: w.address, label: w.label, symbol, balance, error: null };
        } catch {
          // A flaky public RPC should not hide the saved address
          return { id: w.id, chain: w.chain, address: w.address, label: w.label, symbol: null, balance: null, error: 'Balance unavailable' };
        }
      })
    );

    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await requireAuth(req);
    const data = createWalletSchema.parse(await req.json());

    let address: string;
    try {
      address = normalizeAddress(data.address);
    } catch {
      throw new ValidationError('Invalid wallet address (checksum mismatch)');
    }

    const wallet = await prisma.walletAddress.upsert({
      where: { userId_chain_address: { userId, chain: data.chain, address } },
      update: { label: data.label },
      create: { userId, chain: data.chain, address, label: data.label },
    });

    return NextResponse.json(wallet, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
