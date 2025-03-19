import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { getPaginatedTransactions } from "@/lib/order";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function TransactionsList({
  page,
  limit,
}: {
  page: number;
  limit: number;
}) {
  const transactions = await getPaginatedTransactions(page, limit);

  return (
    <Card className="xl:col-span-2">
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
          <CardTitle>Transactions</CardTitle>
          <CardDescription className="text-balance">
            Recent transactions from your store.
          </CardDescription>
        </div>
        <Button size="sm" className="ml-auto shrink-0 gap-1 px-4">
          <Link href="/admin/orders" className="flex items-center gap-2">
            <span>View Orders</span>
            <ArrowUpRight className="hidden size-4 sm:block" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead className="hidden sm:table-cell">Type</TableHead>
              <TableHead className="hidden xl:table-cell">Status</TableHead>
              <TableHead className="hidden md:table-cell xl:table-cell">
                Date
              </TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions &&
              transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    <div className="font-medium">{transaction.customer}</div>
                    <div className="hidden text-sm text-muted-foreground md:inline">
                      {transaction.email}
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {transaction.product}
                  </TableCell>
                  <TableCell className="hidden xl:table-cell">
                    <Badge className="text-xs" variant="outline">
                      {transaction.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell xl:table-cell">
                    {transaction.date.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    {transaction.amount / 100}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
