import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function RecentItems({ items }) {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Recent Items</CardTitle>
        <CardDescription>
          Latest items added to inventory
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {items?.map((item) => (
            <div key={item._id ?? item.id} className="flex items-center">
              <Avatar className="h-9 w-9">
                <AvatarFallback>{item.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">{item.name}</p>
                <p className="text-sm text-muted-foreground">
                  {item.category}
                </p>
              </div>
              <div className="ml-auto font-medium">
                +{item.quantity}
              </div>
            </div>
          ))}
          {(!items || items.length === 0) && (
            <div className="text-center text-sm text-muted-foreground">
              No recent items found
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
