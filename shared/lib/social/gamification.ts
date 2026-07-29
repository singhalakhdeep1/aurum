/**
 * Social Features & Gamification Service
 * Badges, achievements, leaderboards, and social engagement
 */

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'savings' | 'investing' | 'budgeting' | 'consistency' | 'social';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  unlockedAt?: Date;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date;
}

export interface LeaderboardEntry {
  userId: string;
  userName: string;
  userAvatar?: string;
  score: number;
  rank: number;
  change: number; // rank change from previous period
}

export interface UserStats {
  userId: string;
  score: number;
  level: number;
  experience: number;
  experienceToNextLevel: number;
  streak: number;
  totalSavings: number;
  totalInvestments: number;
  budgetAccuracy: number;
  achievementsUnlocked: number;
  achievementsTotal: number;
}

export interface SocialAction {
  type: 'share' | 'challenge' | 'celebrate' | 'tip' | 'invite';
  targetUserId?: string;
  data?: any;
}

/**
 * Calculate user level from experience
 */
export function calculateLevel(experience: number): number {
  // Level formula: level = floor(sqrt(experience / 100))
  return Math.floor(Math.sqrt(experience / 100)) + 1;
}

/**
 * Calculate experience needed for next level
 */
export function experienceToNextLevel(level: number): number {
  return (level * level) * 100;
}

/**
 * Award experience points
 */
export function awardExperience(currentExperience: number, points: number): number {
  return currentExperience + points;
}

/**
 * Get achievement progress
 */
export function getAchievementProgress(achievement: Achievement): number {
  return (achievement.progress / achievement.maxProgress) * 100;
}

/**
 * Check if achievement is unlocked
 */
export function isAchievementUnlocked(achievement: Achievement): boolean {
  return achievement.progress >= achievement.maxProgress;
}

/**
 * Get achievement rarity color
 */
export function getAchievementRarityColor(rarity: Achievement['rarity']): string {
  const colorMap: Record<Achievement['rarity'], string> = {
    common: 'text-gray-500',
    rare: 'text-blue-500',
    epic: 'text-purple-500',
    legendary: 'text-yellow-500',
  };
  
  return colorMap[rarity] || 'text-gray-500';
}

/**
 * Get achievement rarity background
 */
export function getAchievementRarityBg(rarity: Achievement['rarity']): string {
  const bgMap: Record<Achievement['rarity'], string> = {
    common: 'bg-gray-100 dark:bg-gray-800',
    rare: 'bg-blue-100 dark:bg-blue-900',
    epic: 'bg-purple-100 dark:bg-purple-900',
    legendary: 'bg-yellow-100 dark:bg-yellow-900',
  };
  
  return bgMap[rarity] || 'bg-gray-100 dark:bg-gray-800';
}

/**
 * Define all available achievements
 */
export function getAllAchievements(): Achievement[] {
  return [
    // Savings achievements
    {
      id: 'first_savings',
      name: 'First Steps',
      description: 'Save your first $100',
      icon: '🎯',
      category: 'savings',
      rarity: 'common',
      progress: 0,
      maxProgress: 100,
      unlocked: false,
    },
    {
      id: 'savings_1000',
      name: 'Saver',
      description: 'Save $1,000',
      icon: '💰',
      category: 'savings',
      rarity: 'common',
      progress: 0,
      maxProgress: 1000,
      unlocked: false,
    },
    {
      id: 'savings_10000',
      name: 'Super Saver',
      description: 'Save $10,000',
      icon: '💎',
      category: 'savings',
      rarity: 'rare',
      progress: 0,
      maxProgress: 10000,
      unlocked: false,
    },
    {
      id: 'savings_100000',
      name: 'Millionaire in Training',
      description: 'Save $100,000',
      icon: '🏆',
      category: 'savings',
      rarity: 'epic',
      progress: 0,
      maxProgress: 100000,
      unlocked: false,
    },
    
    // Investing achievements
    {
      id: 'first_investment',
      name: 'Investor',
      description: 'Make your first investment',
      icon: '📈',
      category: 'investing',
      rarity: 'common',
      progress: 0,
      maxProgress: 1,
      unlocked: false,
    },
    {
      id: 'diverse_portfolio',
      name: 'Diversified',
      description: 'Invest in 5 different asset types',
      icon: '🌈',
      category: 'investing',
      rarity: 'rare',
      progress: 0,
      maxProgress: 5,
      unlocked: false,
    },
    {
      id: 'profit_1000',
      name: 'Profit Taker',
      description: 'Make $1,000 in investment profits',
      icon: '🚀',
      category: 'investing',
      rarity: 'rare',
      progress: 0,
      maxProgress: 1000,
      unlocked: false,
    },
    
    // Budgeting achievements
    {
      id: 'budget_master',
      name: 'Budget Master',
      description: 'Stay under budget for 3 consecutive months',
      icon: '📊',
      category: 'budgeting',
      rarity: 'rare',
      progress: 0,
      maxProgress: 3,
      unlocked: false,
    },
    {
      id: 'expense_tracker',
      name: 'Expense Tracker',
      description: 'Track 100 expenses',
      icon: '📝',
      category: 'budgeting',
      rarity: 'common',
      progress: 0,
      maxProgress: 100,
      unlocked: false,
    },
    
    // Consistency achievements
    {
      id: 'streak_7',
      name: 'Week Warrior',
      description: 'Log in for 7 consecutive days',
      icon: '🔥',
      category: 'consistency',
      rarity: 'common',
      progress: 0,
      maxProgress: 7,
      unlocked: false,
    },
    {
      id: 'streak_30',
      name: 'Month Master',
      description: 'Log in for 30 consecutive days',
      icon: '⭐',
      category: 'consistency',
      rarity: 'rare',
      progress: 0,
      maxProgress: 30,
      unlocked: false,
    },
    {
      id: 'streak_365',
      name: 'Year Legend',
      description: 'Log in for 365 consecutive days',
      icon: '👑',
      category: 'consistency',
      rarity: 'legendary',
      progress: 0,
      maxProgress: 365,
      unlocked: false,
    },
    
    // Social achievements
    {
      id: 'social_butterfly',
      name: 'Social Butterfly',
      description: 'Invite 5 friends to the platform',
      icon: '🦋',
      category: 'social',
      rarity: 'common',
      progress: 0,
      maxProgress: 5,
      unlocked: false,
    },
    {
      id: 'mentor',
      name: 'Mentor',
      description: 'Help 10 users with financial tips',
      icon: '🤝',
      category: 'social',
      rarity: 'rare',
      progress: 0,
      maxProgress: 10,
      unlocked: false,
    },
  ];
}

/**
 * Update achievement progress
 */
export function updateAchievementProgress(
  achievements: Achievement[],
  achievementId: string,
  progress: number
): Achievement[] {
  return achievements.map(achievement => {
    if (achievement.id === achievementId) {
      const newProgress = Math.min(progress, achievement.maxProgress);
      const wasUnlocked = achievement.unlocked;
      const isNowUnlocked = newProgress >= achievement.maxProgress;
      
      return {
        ...achievement,
        progress: newProgress,
        unlocked: isNowUnlocked,
        unlockedAt: isNowUnlocked && !wasUnlocked ? new Date() : achievement.unlockedAt,
      };
    }
    return achievement;
  });
}

/**
 * Calculate leaderboard rankings
 */
export function calculateLeaderboard(users: UserStats[]): LeaderboardEntry[] {
  return users
    .sort((a, b) => b.score - a.score)
    .map((user, index) => ({
      userId: user.userId,
      userName: user.userId, // In production, fetch actual name
      userAvatar: undefined,
      score: user.score,
      rank: index + 1,
      change: 0, // Would calculate from previous period
    }));
}

/**
 * Calculate user score from stats
 */
export function calculateUserScore(stats: UserStats): number {
  return (
    stats.totalSavings * 0.1 +
    stats.totalInvestments * 0.2 +
    stats.budgetAccuracy * 10 +
    stats.streak * 5 +
    stats.achievementsUnlocked * 50
  );
}

/**
 * Get level rewards
 */
export function getLevelRewards(level: number): Array<{ type: string; description: string }> {
  const rewards: Array<{ type: string; description: string }> = [];
  
  if (level % 5 === 0) {
    rewards.push({ type: 'badge', description: `Level ${level} Badge` });
  }
  
  if (level % 10 === 0) {
    rewards.push({ type: 'theme', description: 'Exclusive Theme' });
  }
  
  if (level >= 50) {
    rewards.push({ type: 'feature', description: 'Premium Features Access' });
  }
  
  return rewards;
}

/**
 * Generate daily challenge
 */
export function generateDailyChallenge(): {
  id: string;
  title: string;
  description: string;
  reward: number;
  type: 'savings' | 'tracking' | 'learning';
} {
  const challenges = [
    {
      id: 'daily_save_10',
      title: 'Save $10 Today',
      description: 'Set aside $10 in your savings account',
      reward: 50,
      type: 'savings' as const,
    },
    {
      id: 'daily_track_5',
      title: 'Track 5 Expenses',
      description: 'Log 5 expenses today',
      reward: 30,
      type: 'tracking' as const,
    },
    {
      id: 'daily_learn',
      title: 'Learn Something New',
      description: 'Read a financial tip or article',
      reward: 20,
      type: 'learning' as const,
    },
  ];
  
  return challenges[Math.floor(Math.random() * challenges.length)];
}

/**
 * Share achievement to social
 */
export function shareAchievement(achievement: Achievement, platform: 'twitter' | 'facebook' | 'linkedin'): string {
  const text = `🎉 I just unlocked the "${achievement.name}" achievement on Aurum Finance! ${achievement.description} #FinanceGoals #Aurum`;
  
  const urls = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`,
  };
  
  return urls[platform];
}

/**
 * Format level with emoji
 */
export function formatLevel(level: number): string {
  if (level >= 100) return '💎 Diamond';
  if (level >= 50) return '🥇 Gold';
  if (level >= 25) return '🥈 Silver';
  if (level >= 10) return '🥉 Bronze';
  return '⭐ Starter';
}
