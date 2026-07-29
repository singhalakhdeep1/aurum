/**
 * Leaderboard Component
 * Displays user rankings based on savings and achievements
 */

'use client';

import { Trophy, Medal, Crown, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/ui/card';
import { Badge } from '@/shared/components/ui/ui/badge';

interface LeaderboardEntry {
  id: string;
  rank: number;
  username: string;
  avatar?: string;
  totalSaved: number;
  streak: number;
  achievements: number;
  change?: number;
}

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  currentUserId?: string;
}

export function Leaderboard({ entries, currentUserId }: LeaderboardProps) {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Medal className="h-5 w-5 text-amber-600" />;
      default:
        return <span className="text-sm font-medium text-gray-600 dark:text-gray-400">#{rank}</span>;
    }
  };

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300';
      case 2:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300';
      case 3:
        return 'bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300';
      default:
        return 'bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-400';
    }
  };

  const currentUserEntry = entries.find(entry => entry.id === currentUserId);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Top 3 */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {entries.slice(0, 3).map((entry) => (
            <div
              key={entry.id}
              className={`p-4 rounded-lg text-center ${
                entry.id === currentUserId
                  ? 'bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500'
                  : 'bg-gray-50 dark:bg-gray-800'
              }`}
            >
              <div className="mb-2">{getRankIcon(entry.rank)}</div>
              <div className="text-2xl mb-1">{entry.avatar || '👤'}</div>
              <p className="font-medium text-sm truncate">{entry.username}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                ${entry.totalSaved.toLocaleString()}
              </p>
            </div>
          ))}
        </div>

        {/* Full Leaderboard */}
        <div className="space-y-2">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className={`flex items-center gap-3 p-3 rounded-lg ${
                entry.id === currentUserId
                  ? 'bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500'
                  : 'bg-gray-50 dark:bg-gray-800'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getRankBadge(entry.rank)}`}>
                {getRankIcon(entry.rank)}
              </div>
              
              <div className="text-xl">{entry.avatar || '👤'}</div>
              
              <div className="flex-1">
                <p className="font-medium">{entry.username}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  ${entry.totalSaved.toLocaleString()} saved
                </p>
              </div>

              <div className="flex items-center gap-2">
                {entry.change !== undefined && (
                  <div className={`flex items-center gap-1 text-xs ${
                    entry.change > 0 ? 'text-green-500' : entry.change < 0 ? 'text-red-500' : 'text-gray-500'
                  }`}>
                    <TrendingUp className="h-3 w-3" />
                    <span>{Math.abs(entry.change)}</span>
                  </div>
                )}
                
                <Badge variant="outline" className="text-xs">
                  {entry.achievements} 🏆
                </Badge>
              </div>
            </div>
          ))}
        </div>

        {/* Current User Position */}
        {currentUserEntry && currentUserEntry.rank > 3 && (
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getRankBadge(currentUserEntry.rank)}`}>
                <span className="text-sm font-medium">#{currentUserEntry.rank}</span>
              </div>
              
              <div className="text-xl">{currentUserEntry.avatar || '👤'}</div>
              
              <div className="flex-1">
                <p className="font-medium">{currentUserEntry.username} (You)</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  ${currentUserEntry.totalSaved.toLocaleString()} saved
                </p>
              </div>

              <Badge variant="outline" className="text-xs">
                {currentUserEntry.achievements} 🏆
              </Badge>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
