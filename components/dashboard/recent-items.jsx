import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function RecentItems({ items }) {
  return (
    <Card className="col-span-3 hover-lift">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <svg
              className="h-4 w-4 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </div>
          Recent Items
        </CardTitle>
        <CardDescription>Latest items added to inventory</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {items?.map((item) => (
            <div
              key={item._id ?? item.id}
              className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <Avatar className="h-11 w-11 ring-2 ring-primary/10">
                <AvatarFallback className="bg-linear-to-br from-primary/20 to-purple-500/20 text-primary font-semibold">
                  {item.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0 space-y-1">
                <p className="text-sm font-semibold leading-none truncate">
                  {item.name}
                </p>
                <p className="text-xs text-muted-foreground">{item.category}</p>
              </div>
              <div className="text-sm font-bold text-primary">
                +{item.quantity}
              </div>
            </div>
          ))}
          {(!items || items.length === 0) && (
            <div className="text-center py-8">
              <svg
                className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
              <p className="text-sm text-muted-foreground font-medium">
                No recent items
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
