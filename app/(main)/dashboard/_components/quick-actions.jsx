/**
 * Quick Actions Component
 * Fast access to common actions
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, ArrowUpRight, ArrowDownRight, Wallet, TrendingUp } from "lucide-react";
import Link from "next/link";

export function QuickActions() {
  const actions = [
    {
      title: "Add Transaction",
      description: "Record income or expense",
      icon: <Plus className="h-5 w-5" />,
      href: "/transaction/create",
      color: "bg-blue-500",
    },
    {
      title: "Add Income",
      description: "Record new income",
      icon: <ArrowUpRight className="h-5 w-5" />,
      href: "/transaction/create?type=INCOME",
      color: "bg-green-500",
    },
    {
      title: "Add Expense",
      description: "Record new expense",
      icon: <ArrowDownRight className="h-5 w-5" />,
      href: "/transaction/create?type=EXPENSE",
      color: "bg-red-500",
    },
    {
      title: "View Budget",
      description: "Check budget status",
      icon: <Wallet className="h-5 w-5" />,
      href: "/budget",
      color: "bg-purple-500",
    },
    {
      title: "Investments",
      description: "View portfolio",
      icon: <TrendingUp className="h-5 w-5" />,
      href: "/investments",
      color: "bg-orange-500",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {actions.map((action) => (
            <Link key={action.title} href={action.href}>
              <Button
                variant="outline"
                className="w-full h-full flex flex-col items-center justify-center gap-2 py-6 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <div className={`${action.color} p-3 rounded-full text-white`}>
                  {action.icon}
                </div>
                <span className="text-sm font-medium">{action.title}</span>
              </Button>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
