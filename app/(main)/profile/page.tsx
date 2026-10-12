/**
 * Profile Page
 * Display name, level / XP and achievements, all derived from real activity.
 */

'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { UserButton } from '@clerk/nextjs';
import { AlertCircle, Award, Loader2, Target, Trophy } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  progress: number;
  maxProgress: number;
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
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/user/profile');
        if (!res.ok) throw new Error('Failed to load profile');
        const data: UserProfile = await res.json();
        setProfile(data);
        setName(data.name);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'Failed to save');
      setProfile(await res.json());
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[300px]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="border-red-200 dark:border-red-800">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const xpProgress = Math.min(100, (profile.xp / profile.nextLevelXp) * 100);
  const unlocked = profile.achievements.filter((a) => a.unlocked).length;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Your progress and account details</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <UserButton />
                <div className="min-w-0">
                  <CardTitle className="truncate">{profile.name || 'Your account'}</CardTitle>
                  <CardDescription className="truncate">{profile.email}</CardDescription>
                  <p className="text-xs text-gray-500 mt-1">Member since {new Date(profile.memberSince).toLocaleDateString()}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 font-medium">
                  <Trophy className="h-4 w-4 text-yellow-500" />
                  Level {profile.level}
                </span>
                <span className="text-gray-600 dark:text-gray-400">
                  {profile.xp} / {profile.nextLevelXp} XP
                </span>
              </div>
              <Progress value={xpProgress} extraStyles="bg-yellow-500" />
              <p className="text-xs text-gray-500">
                Earn XP by recording transactions, creating accounts, setting a budget, tracking investments and subscriptions, and scanning receipts.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Edit Profile</CardTitle>
              <CardDescription>Update how your name appears in Aurum</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={save} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" value={name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)} maxLength={100} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value={profile.email} disabled />
                </div>
                <Button type="submit" className="w-full" disabled={saving || !name.trim() || name.trim() === profile.name}>
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save changes'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Achievements
              </CardTitle>
              <CardDescription>
                {unlocked} of {profile.achievements.length} unlocked
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {profile.achievements.map((a) => (
                  <div key={a.id} className={`rounded-lg border p-4 ${a.unlocked ? 'bg-yellow-50 dark:bg-yellow-900/10 border-yellow-300 dark:border-yellow-800' : ''}`}>
                    <div className="flex items-start gap-3">
                      <span className={`text-2xl ${a.unlocked ? '' : 'grayscale opacity-60'}`} aria-hidden>
                        {a.icon}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium flex items-center gap-2">
                          {a.name}
                          {a.unlocked && <Target className="h-4 w-4 text-green-500" aria-label="Unlocked" />}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{a.description}</p>
                        {!a.unlocked && (
                          <div className="mt-2 space-y-1">
                            <Progress value={(a.progress / a.maxProgress) * 100} />
                            <p className="text-xs text-gray-500">
                              {Math.floor(a.progress).toLocaleString()} / {a.maxProgress.toLocaleString()}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
