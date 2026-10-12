/**
 * Achievements Component
 * Displays user achievements and badges
 */

'use client';

import { Trophy, Star, Lock, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date;
  progress?: number;
  maxProgress?: number;
}

interface AchievementsProps {
  achievements: Achievement[];
}

export function Achievements({ achievements }: AchievementsProps) {
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;
  const progressPercentage = (unlockedCount / totalCount) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Achievements
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Overview */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Progress</p>
            <p className="text-2xl font-bold">{unlockedCount} / {totalCount}</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1">
              <Star className="h-5 w-5 text-yellow-500" />
              <p className="text-lg font-bold">{progressPercentage.toFixed(0)}%</p>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Unlocked</p>
          </div>
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`p-4 rounded-lg border text-center ${
                achievement.unlocked
                  ? 'bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-800'
                  : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 opacity-60'
              }`}
            >
              <div className="text-4xl mb-2">{achievement.icon}</div>
              <h4 className="font-medium text-sm">{achievement.name}</h4>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {achievement.description}
              </p>
              
              {achievement.progress !== undefined && achievement.maxProgress && !achievement.unlocked && (
                <div className="mt-2">
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                    <span>Progress</span>
                    <span>{achievement.progress} / {achievement.maxProgress}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                    <div
                      className="bg-blue-500 h-1.5 rounded-full"
                      style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {achievement.unlocked ? (
                <Badge className="mt-2 bg-green-500">Unlocked</Badge>
              ) : (
                <div className="flex items-center justify-center gap-1 mt-2 text-xs text-gray-500 dark:text-gray-400">
                  <Lock className="h-3 w-3" />
                  <span>Locked</span>
                </div>
              )}

              {achievement.unlockedAt && (
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                  {new Date(achievement.unlockedAt).toLocaleDateString()}
                </p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * XP Bar Component
 * Displays user XP progress
 */

interface XPBarProps {
  currentXP: number;
  nextLevelXP: number;
  level: number;
}

export function XPBar({ currentXP, nextLevelXP, level }: XPBarProps) {
  const progressPercentage = (currentXP / nextLevelXP) * 100;
  const xpToNextLevel = nextLevelXP - currentXP;

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-yellow-500" />
          <span className="font-medium">Level {level}</span>
        </div>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {currentXP} / {nextLevelXP} XP
        </span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
        <div
          className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full transition-all"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
      <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
        {xpToNextLevel} XP to next level
      </p>
    </div>
  );
}
