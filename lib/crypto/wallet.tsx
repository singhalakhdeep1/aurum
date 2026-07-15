import { createPublicClient, createWalletClient, http, parseUnits } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { mainnet, polygon, bsc } from 'viem/chains'

export type Chain = typeof mainnet | typeof polygon | typeof bsc

const chains: Record<string, Chain> = {
  ethereum: mainnet,
  polygon: polygon,
  bsc: bsc,
}

export async function createWallet() {
  const account = privateKeyToAccount(generatePrivateKey())
  return {
    address: account.address,
    privateKey: account.privateKey,
  }
}

function generatePrivateKey(): `0x${string}` {
  // In production, use a secure random generator
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return `0x${Array.from(array, (b) => b.toString(16).padStart(2, '0')).join('')}`
}

export async function getBalance(address: string, chainName: string = 'ethereum') {
  const chain = chains[chainName] || mainnet
  const client = createPublicClient({
    chain,
    transport: http(process.env.RPC_URL || 'https://eth.llamarpc.com'),
  })
  
  const balance = await client.getBalance({ address })
  return balance
}

export async function sendTransaction(
  privateKey: string,
  to: string,
  value: number,
  chainName: string = 'ethereum'
) {
  const chain = chains[chainName] || mainnet
  const account = privateKeyToAccount(privateKey as `0x${string}`)
  
  const walletClient = createWalletClient({
    account,
    chain,
    transport: http(process.env.RPC_URL || 'https://eth.llamarpc.com'),
  })
  
  const hash = await walletClient.sendTransaction({
    to: to as `0x${string}`,
    value: parseUnits(value.toString(), 18),
  })
  
  return hash
}

export async function estimateGasFee(
  to: string,
  value: number,
  chainName: string = 'ethereum'
) {
  const chain = chains[chainName] || mainnet
  const client = createPublicClient({
    chain,
    transport: http(process.env.RPC_URL || 'https://eth.llamarpc.com'),
  })
  
  const gasEstimate = await client.estimateGas({
    to: to as `0x${string}`,
    value: parseUnits(value.toString(), 18),
  })
  
  const gasPrice = await client.getGasPrice()
  const gasFee = gasEstimate * gasPrice
  
  return {
    gasEstimate: gasEstimate.toString(),
    gasPrice: gasPrice.toString(),
    gasFee: gasFee.toString(),
  }
}

export async function getTokenBalance(
  tokenAddress: string,
  walletAddress: string,
  chainName: string = 'ethereum'
) {
  const chain = chains[chainName] || mainnet
  const client = createPublicClient({
    chain,
    transport: http(process.env.RPC_URL || 'https://eth.llamarpc.com'),
  })
  
  // ERC20 balanceOf function signature
  const balance = await client.readContract({
    address: tokenAddress as `0x${string}`,
    abi: [
      {
        constant: true,
        inputs: [{ name: '_owner', type: 'address' }],
        name: 'balanceOf',
        outputs: [{ name: 'balance', type: 'uint256' }],
        type: 'function',
      },
    ],
    functionName: 'balanceOf',
    args: [walletAddress as `0x${string}`],
  })
  
  return balance
}
