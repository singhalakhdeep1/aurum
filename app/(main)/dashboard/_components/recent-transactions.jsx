/**
 * Recent Transactions Component
 * Displays recent transactions on dashboard
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/ui/table";
import { Badge } from "@/shared/components/ui/ui/badge";
import { ArrowUpRight, ArrowDownRight, MoreHorizontal } from "lucide-react";
import Link from "next/link";

export function RecentTransactions({ transactions }) {
  const recentTransactions = transactions?.slice(0, 5) || [];

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Recent Transactions</CardTitle>
          <Link href="/transaction">
            <Button variant="ghost" size="sm">View All</Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {recentTransactions.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p>No recent transactions</p>
            <Link href="/transaction/create">
              <Button variant="outline" size="sm" className="mt-2">
                Add Transaction
              </Button>
            </Link>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {transaction.type === "INCOME" ? (
                        <ArrowUpRight className="h-4 w-4 text-green-500" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 text-red-500" />
                      )}
                      <span className="font-medium">{transaction.description || "No description"}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{transaction.category}</Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(transaction.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell className={`text-right font-medium ${
                    transaction.type === "INCOME" ? "text-green-500" : "text-red-500"
                  }`}>
                    {transaction.type === "INCOME" ? "+" : "-"}${transaction.amount}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
