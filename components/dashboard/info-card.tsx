import { Users } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function InfoCard({
  title,
  value,
  percentage,
  difference,
  totalOrders,
}: {
  title: string;
  value?: number | string;
  percentage?: number;
  difference?: number;
  totalOrders?: number;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Users className="size-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {difference && (
          <p className="text-xs text-muted-foreground">
            {difference > 0 ? "+" + difference : "-" + difference} from last
            month
          </p>
        )}
        {percentage && (
          <p className="text-xs text-muted-foreground">
            {percentage >= 0 ? "+" + percentage : "-" + percentage}% from last
            month
          </p>
        )}
        {totalOrders && (
          <p className="text-xs text-muted-foreground">
            {totalOrders} total orders
          </p>
        )}
      </CardContent>
    </Card>
  );
}
