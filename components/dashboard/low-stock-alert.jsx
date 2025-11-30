import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function LowStockAlert({ items }) {
  return (
    <Card className="col-span-3 hover-lift border-amber-500/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-amber-500/10">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
          </div>
          Low Stock Alerts
        </CardTitle>
        <CardDescription>Items that need restocking soon</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {items?.map((item) => (
            <div
              key={item._id}
              className="flex items-center justify-between p-3 rounded-lg border-2 border-amber-500/10 bg-amber-500/5 hover:border-amber-500/20 transition-all"
            >
              <div className="flex-1 min-w-0 space-y-1">
                <p className="text-sm font-semibold leading-none truncate">
                  {item.name}
                </p>
                <p className="text-xs text-muted-foreground">{item.category}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="text-amber-700 border-amber-300 bg-amber-50 font-semibold"
                >
                  {item.quantity} {item.unit_type}
                </Badge>
              </div>
            </div>
          ))}
          {(!items || items.length === 0) && (
            <div className="text-center py-8">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-green-500/10">
                <svg
                  className="h-7 w-7 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p className="text-sm text-muted-foreground font-medium">
                All items well stocked!
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                No low stock items at the moment
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
