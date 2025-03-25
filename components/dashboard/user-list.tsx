import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { getPaginatedUsers } from "@/lib/user";
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

export default async function UserList({
  page,
  limit,
}: {
  page: number;
  limit: number;
}) {
  const usersData = await getPaginatedUsers(page, limit);

  return (
    <>
      {usersData && usersData.length > 0 ? (
        <Card className="xl:col-span-2">
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
              <CardTitle>Users</CardTitle>
              <CardDescription className="text-balance">
                Most recent {usersData.length} users
              </CardDescription>
            </div>
            <Button size="sm" className="ml-auto shrink-0 gap-1 px-4">
              <Link href="/admin/orders" className="flex items-center gap-2">
                <span>View All</span>
                <ArrowUpRight className="hidden size-4 sm:block" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead className="hidden md:table-cell xl:table-cell">
                    Date
                  </TableHead>
                  <TableHead className="hidden sm:table-cell">
                    Email Verified
                  </TableHead>
                  <TableHead className="hidden xl:table-cell">
                    Reviews
                  </TableHead>
                  <TableHead className="text-right">Orders</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usersData &&
                  usersData.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="font-medium">{user.email}</div>
                        <div className="hidden text-sm text-muted-foreground md:inline">
                          {user.name}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell xl:table-cell">
                        {user.date.toLocaleDateString()}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {user.emailVerified ? (
                          <div>{user.emailVerified.toLocaleDateString()}</div>
                        ) : (
                          <Badge variant={"destructive"}>Not Verified</Badge>
                        )}
                      </TableCell>
                      <TableCell className="hidden xl:table-cell">
                        {user.reviews === 0 ? (
                          <Badge variant={"destructive"}>{user.reviews}</Badge>
                        ) : (
                          <Badge variant={"secondary"}>{user.reviews}</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {user.orders === 0 ? (
                          <Badge variant={"destructive"}>{user.orders}</Badge>
                        ) : (
                          <Badge variant={"secondary"}>{user.orders}</Badge>
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
          <EmptyPlaceholder.Title>No users yet!</EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            You don&apos;t have any users yet. Start your marketing campaign to
            get your first users.
          </EmptyPlaceholder.Description>
          <Link href="/guides">
            <Button>Marketing Guide</Button>
          </Link>
        </EmptyPlaceholder>
      )}
    </>
  );
}
