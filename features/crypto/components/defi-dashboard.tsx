'use client';

import React, { useState } from 'react';
import { Button } from './ui/button';
import { TrendingUp, ArrowUpRight, ArrowDownRight, Wallet, Zap, Lock } from 'lucide-react';

interface DeFiProtocol {
  id: string;
  name: string;
  apy: number;
  tvl: number;
  risk: 'low' | 'medium' | 'high';
}

interface DeFiDashboardProps {
  onStake?: (protocolId: string, amount: number) => void;
}

export default function DeFiDashboard({ onStake }: DeFiDashboardProps) {
  const [protocols, setProtocols] = useState<DeFiProtocol[]>([
    { id: '1', name: 'ETH Staking', apy: 4.5, tvl: 15000000, risk: 'low' },
    { id: '2', name: 'Lending Pool', apy: 8.2, tvl: 8500000, risk: 'medium' },
    { id: '3', name: 'Yield Farming', apy: 15.5, tvl: 3200000, risk: 'high' },
    { id: '4', name: 'Liquidity Mining', apy: 12.3, tvl: 5600000, risk: 'medium' }
  ]);

  const [userPositions, setUserPositions] = useState([
    { protocolId: '1', amount: 2.5, rewards: 0.1125 },
    { protocolId: '2', amount: 1.0, rewards: 0.082 }
  ]);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-500';
      case 'medium': return 'text-yellow-500';
      case 'high': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const totalTVL = protocols.reduce((sum, p) => sum + p.tvl, 0);
  const totalRewards = userPositions.reduce((sum, p) => sum + p.rewards, 0);

  return (
    <div className="border rounded-lg bg-background p-4 space-y-4">
      <div className="flex items-center gap-2">
        <Zap className="w-5 h-5 text-purple-500" />
        <h3 className="font-semibold">DeFi Dashboard</h3>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-muted rounded-lg p-3">
          <p className="text-sm text-muted-foreground">Total TVL</p>
          <p className="text-xl font-bold">${(totalTVL / 1000000).toFixed(2)}M</p>
        </div>
        <div className="bg-muted rounded-lg p-3">
          <p className="text-sm text-muted-foreground">Your Staked</p>
          <p className="text-xl font-bold">{userPositions.reduce((s, p) => s + p.amount, 0).toFixed(2)} ETH</p>
        </div>
        <div className="bg-muted rounded-lg p-3">
          <p className="text-sm text-muted-foreground">Total Rewards</p>
          <p className="text-xl font-bold text-green-500">{totalRewards.toFixed(4)} ETH</p>
        </div>
      </div>

      {/* Available Protocols */}
      <div className="space-y-2">
        <h4 className="font-medium">Available Protocols</h4>
        {protocols.map(protocol => (
          <div key={protocol.id} className="border rounded-lg p-3 hover:bg-accent/50 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Wallet className="w-4 h-4" />
                <span className="font-medium">{protocol.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-medium ${getRiskColor(protocol.risk)}`}>
                  {protocol.risk.toUpperCase()}
                </span>
                <span className="text-sm font-bold text-green-500">{protocol.apy}% APY</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>TVL: ${(protocol.tvl / 1000000).toFixed(2)}M</span>
              <Button size="sm" onClick={() => onStake?.(protocol.id, 0.1)}>
                Stake
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* User Positions */}
      <div className="space-y-2">
        <h4 className="font-medium">Your Positions</h4>
        {userPositions.map((position, index) => {
          const protocol = protocols.find(p => p.id === position.protocolId);
          return (
            <div key={index} className="border rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{protocol?.name}</span>
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-yellow-500" />
                  <Button variant="outline" size="sm">
                    Unstake
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Staked: {position.amount} ETH</span>
                <span className="text-green-500 font-medium">
                  Rewards: {position.rewards.toFixed(4)} ETH
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-2">
        <Button variant="outline" className="flex items-center gap-2">
          <ArrowUpRight className="w-4 h-4" />
          Deposit
        </Button>
        <Button variant="outline" className="flex items-center gap-2">
          <ArrowDownRight className="w-4 h-4" />
          Withdraw
        </Button>
      </div>
    </div>
  );
}
