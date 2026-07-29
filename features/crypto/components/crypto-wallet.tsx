'use client';

import React, { useState } from 'react';
import { Button } from './ui/button';
import { Wallet, Send, Receive, Copy, QrCode, TrendingUp, ArrowDownRight } from 'lucide-react';

interface CryptoWalletProps {
  onConnect?: () => void;
}

export default function CryptoWallet({ onConnect }: CryptoWalletProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState('');
  const [transactions, setTransactions] = useState([
    { id: '1', type: 'receive', amount: 0.5, date: new Date(), status: 'completed' },
    { id: '2', type: 'send', amount: 0.2, date: new Date(), status: 'completed' }
  ]);

  const handleConnect = () => {
    setIsConnected(true);
    setBalance(1.5);
    setAddress('0x1234...5678');
    onConnect?.();
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(address);
  };

  return (
    <div className="border rounded-lg bg-background p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Wallet className="w-5 h-5 text-yellow-500" />
          <h3 className="font-semibold">Crypto Wallet</h3>
        </div>
        {!isConnected ? (
          <Button onClick={handleConnect}>
            <Wallet className="w-4 h-4 mr-2" />
            Connect Wallet
          </Button>
        ) : (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-green-500">● Connected</span>
          </div>
        )}
      </div>

      {isConnected && (
        <>
          {/* Balance */}
          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg p-4 text-white">
            <p className="text-sm opacity-80">Total Balance</p>
            <p className="text-3xl font-bold">{balance.toFixed(4)} ETH</p>
            <p className="text-sm opacity-80">≈ ${(balance * 2000).toFixed(2)} USD</p>
          </div>

          {/* Address */}
          <div className="border rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Wallet Address</span>
              <Button variant="ghost" size="sm" onClick={handleCopyAddress}>
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-sm font-mono mt-1">{address}</p>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <Send className="w-4 h-4" />
              Send
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Receive className="w-4 h-4" />
              Receive
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <QrCode className="w-4 h-4" />
              QR Code
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Swap
            </Button>
          </div>

          {/* Transactions */}
          <div className="space-y-2">
            <h4 className="font-medium">Recent Transactions</h4>
            {transactions.map(tx => (
              <div key={tx.id} className="flex items-center justify-between p-2 border rounded">
                <div className="flex items-center gap-2">
                  {tx.type === 'receive' ? (
                    <ArrowDownRight className="w-4 h-4 text-green-500 rotate-45" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 text-red-500" />
                  )}
                  <div>
                    <p className="text-sm font-medium capitalize">{tx.type}</p>
                    <p className="text-xs text-muted-foreground">{tx.date.toLocaleDateString()}</p>
                  </div>
                </div>
                <span className={`text-sm font-medium ${tx.type === 'receive' ? 'text-green-500' : 'text-red-500'}`}>
                  {tx.type === 'receive' ? '+' : '-'}{tx.amount.toFixed(4)} ETH
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
