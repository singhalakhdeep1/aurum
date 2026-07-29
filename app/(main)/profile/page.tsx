/**
 * Profile Page
 * View and edit user profile information
 */

'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/ui/card';
import { Button } from '@/shared/components/ui/ui/button';
import { Input } from '@/shared/components/ui/ui/input';
import { Label } from '@/shared/components/ui/ui/label';
import { User, Mail, Calendar, Award, Target, Trophy, Loader2, AlertCircle } from 'lucide-react';
import { UserButton, useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';

interface Achievement {
  id: string;
  name: string;
  icon: string;
  unlocked: boolean;
}

interface UserProfile {
  name: string;
  email: string;
  imageUrl: string | null;
  memberSince: string;
  level: number;
  xp: number;
  nextLevelXp: number;
  achievements: Achievement[];
}

export default function ProfilePage() {
  const { user, isLoaded: userLoaded } = useUser();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      if (!userLoaded) return;
      
      try {
        const response = await fetch('/api/user/profile');
        if (!response.ok) throw new Error('Failed to fetch profile');
        const data = await response.json();
        setProfile(data);
      } catch (err) {
        // If API fails, use Clerk data as fallback
        setProfile({
          name: user?.fullName || 'User',
          email: user?.primaryEmailAddress?.emailAddress || '',
          imageUrl: user?.imageUrl || null,
          memberSince: user?.createdAt ? new Date(user.createdAt).toISOString() : new Date().toISOString(),
          level: 1,
          xp: 0,
          nextLevelXp: 100,
          achievements: [],
        });
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [user, userLoaded]);

  if (loading || !userLoaded) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="border-red-200 dark:border-red-800">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <h3 className="text-lg font-medium mb-2">Error loading profile</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const user = profile || {
    name: user?.fullName || 'User',
    email: user?.primaryEmailAddress?.emailAddress || '',
    imageUrl: user?.imageUrl || null,
    memberSince: user?.createdAt ? new Date(user.createdAt).toISOString() : new Date().toISOString(),
    level: 1,
    xp: 0,
    nextLevelXp: 100,
    achievements: [],
  };

  const xpProgress = (user.xp / user.nextLevelXp) * 100;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          View and manage your profile
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>Your account information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <UserButton />
                </div>
                <div className="text-center">
                  <h3 className="font-medium text-lg">{user.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    Member since {new Date(user.memberSince).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div className="space-y-2 pt-4 border-t">
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600 dark:text-gray-400">Level {user.level}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Trophy className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600 dark:text-gray-400">{user.xp} XP</span>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex justify-between text-sm mb-2">
                  <span>XP Progress</span>
                  <span>{user.xp} / {user.nextLevelXp}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${xpProgress}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Achievements & Stats */}
        <div className="lg:col-span-2 space-y-6">
          {/* Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Achievements
              </CardTitle>
              <CardDescription>
                Your accomplishments and milestones
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {user.achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`p-4 rounded-lg border ${
                      achievement.unlocked
                        ? 'bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-800'
                        : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 opacity-50'
                    }`}
                  >
                    <div className="text-3xl mb-2">{achievement.icon}</div>
                    <h4 className="font-medium text-sm">{achievement.name}</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {achievement.unlocked ? 'Unlocked' : 'Locked'}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Quick Stats
              </CardTitle>
              <CardDescription>
                Your financial overview
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">12</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Accounts</p>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">156</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Transactions</p>
                </div>
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">8</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Budgets</p>
                </div>
                <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">5</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Subscriptions</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Edit Profile Form */}
          <Card>
            <CardHeader>
              <CardTitle>Edit Profile</CardTitle>
              <CardDescription>
                Update your profile information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" defaultValue={user.name} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" defaultValue={user.email} disabled />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Email cannot be changed. Manage via Clerk.
                </p>
              </div>
              <Button className="w-full">Save Changes</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
