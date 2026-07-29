/**
 * Subscription Overview Component
 * Displays subscription summary on dashboard
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/ui/card";
import { Button } from "@/shared/components/ui/ui/button";
import { Calendar, AlertCircle, TrendingUp } from "lucide-react";
import Link from "next/link";

export function SubscriptionOverview() {
  // Mock data - in production, fetch from API
  const subscriptions = [
    { name: "Netflix", amount: 15.99, nextBilling: "2024-02-15", daysUntil: 5 },
    { name: "Spotify", amount: 9.99, nextBilling: "2024-02-20", daysUntil: 10 },
    { name: "Adobe", amount: 54.99, nextBilling: "2024-02-10", daysUntil: 0 },
  ];

  const monthlyTotal = subscriptions.reduce((sum, sub) => sum + sub.amount, 0);
  const upcomingBills = subscriptions.filter(sub => sub.daysUntil <= 7);

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
              {subscriptions.map((sub) => (
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
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
