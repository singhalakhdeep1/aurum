/**
 * Subscription Overview Component
 * Displays subscription summary on dashboard
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/ui/card";
import { Button } from "@/shared/components/ui/ui/button";
import { Calendar, AlertCircle, TrendingUp } from "lucide-react";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";

export async function SubscriptionOverview() {
  const { userId: clerkUserId } = await auth();
  const user = clerkUserId
    ? await db.user.findUnique({ where: { clerkUserId }, select: { id: true } })
    : null;
  const subscriptions = user
    ? await db.subscription.findMany({
        where: { userId: user.id, status: "active" },
        orderBy: { nextBillingDate: "asc" },
        take: 5,
      })
    : [];
  const now = new Date();
  const normalizedSubscriptions = subscriptions.map((subscription) => ({
    ...subscription,
    amount: Number(subscription.amount),
    nextBilling: subscription.nextBillingDate.toISOString(),
    daysUntil: Math.max(0, Math.ceil((subscription.nextBillingDate.getTime() - now.getTime()) / 86_400_000)),
  }));

  const monthlyTotal = normalizedSubscriptions.reduce((sum, sub) => sum + sub.amount, 0);
  const upcomingBills = normalizedSubscriptions.filter(sub => sub.daysUntil <= 7);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Subscriptions</CardTitle>
          <Link href="/subscriptions">
            <Button variant="ghost" size="sm">Manage</Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Summary */}
          <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Monthly Total</p>
              <p className="text-2xl font-bold">${monthlyTotal.toFixed(2)}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-500" />
          </div>

          {/* Upcoming Bills */}
          {upcomingBills.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="h-4 w-4 text-orange-500" />
                <p className="text-sm font-medium">Upcoming Bills</p>
              </div>
              <div className="space-y-2">
                {upcomingBills.map((sub) => (
                  <div key={sub.name} className="flex justify-between items-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <div>
                      <p className="font-medium">{sub.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {sub.daysUntil === 0 ? "Due today" : `Due in ${sub.daysUntil} days`}
                      </p>
                    </div>
                    <p className="font-bold">${sub.amount}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* All Subscriptions */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="h-4 w-4 text-gray-500" />
              <p className="text-sm font-medium">All Subscriptions</p>
            </div>
            <div className="space-y-2">
              {normalizedSubscriptions.map((sub) => (
                <div key={sub.name} className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{sub.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(sub.nextBilling).toLocaleDateString()}
                    </p>
                  </div>
                  <p className="font-bold">${sub.amount}</p>
                </div>
              ))}
              {normalizedSubscriptions.length === 0 && (
                <p className="text-sm text-gray-600 dark:text-gray-400">No active subscriptions yet.</p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
