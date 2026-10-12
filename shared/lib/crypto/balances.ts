/**
 * Watch-only crypto balances. Only public addresses are handled; no key
 * material is ever accepted, stored or logged.
 */

import { createPublicClient, formatEther, getAddress, http, type Chain } from 'viem';
import { bsc, mainnet, polygon } from 'viem/chains';

export type ChainId = 'ethereum' | 'polygon' | 'bsc';

const CHAINS: Record<ChainId, { chain: Chain; symbol: string; rpcEnv: string }> = {
  ethereum: { chain: mainnet, symbol: 'ETH', rpcEnv: 'ETHEREUM_RPC_URL' },
  polygon: { chain: polygon, symbol: 'POL', rpcEnv: 'POLYGON_RPC_URL' },
  bsc: { chain: bsc, symbol: 'BNB', rpcEnv: 'BSC_RPC_URL' },
};

export function normalizeAddress(address: string): string {
  return getAddress(address); // throws on bad checksum / format
}

export async function getNativeBalance(chainId: ChainId, address: string) {
  const { chain, symbol, rpcEnv } = CHAINS[chainId];
  const client = createPublicClient({ chain, transport: http(process.env[rpcEnv] || undefined, { timeout: 8_000 }) });
  const wei = await client.getBalance({ address: address as `0x${string}` });
  return { symbol, balance: formatEther(wei) };
}
