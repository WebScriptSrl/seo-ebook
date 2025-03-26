import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { getPaginatedsubscribers } from "@/lib/newsletter";
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

import { EmptyPlaceholder } from "../shared/empty-placeholder";

export default async function SubscribersList({
  page,
  limit,
}: {
  page: number;
  limit: number;
}) {
  const subscribersData = await getPaginatedsubscribers(page, limit);

  return (
    <>
      {subscribersData && subscribersData.length > 0 ? (
        <Card className="xl:col-span-2">
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
              <CardTitle>Subscribers</CardTitle>
              <CardDescription className="text-balance">
                Most recent {subscribersData.length} subscribers
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
                  <TableHead>Subscriber</TableHead>
                  <TableHead className="hidden sm:table-cell">Status</TableHead>
                  <TableHead className="hidden xl:table-cell">
                    Renew Date
                  </TableHead>
                  <TableHead className="hidden md:table-cell xl:table-cell">
                    Date
                  </TableHead>
                  <TableHead className="text-right">Subscription</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscribersData &&
                  subscribersData.map((subscriber) => (
                    <TableRow key={subscriber.id}>
                      <TableCell>
                        <div className="font-medium">{subscriber.email}</div>
                        <div className="hidden text-sm text-muted-foreground md:inline">
                          {subscriber.confirmedAt?.toLocaleString()}
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {subscriber.subscribed.toString()}
                      </TableCell>
                      <TableCell className="hidden xl:table-cell">
                        <Badge className="text-xs" variant="outline">
                          {subscriber.renewed
                            ? subscriber.renewedAt?.toLocaleString()
                            : "Not Renewed"}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell xl:table-cell">
                        {subscriber.date.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        {subscriber.unsubscribed === true ? (
                          <Badge variant={"destructive"}>Unsubscribed</Badge>
                        ) : (
                          <Badge variant={"secondary"}>Active</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <EmptyPlaceholder>
          <EmptyPlaceholder.Icon name="info" />
          <EmptyPlaceholder.Title>No subscribers yet!</EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            You don&apos;t have any newsletter subscriptions yet. Start your
            marketing campaign to get your first users.
          </EmptyPlaceholder.Description>
          <Link href="/guides">
            <Button>Marketing Guide</Button>
          </Link>
        </EmptyPlaceholder>
      )}
    </>
  );
}
