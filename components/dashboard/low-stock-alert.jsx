import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function LowStockAlert({ items }) {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          Low Stock Alerts
        </CardTitle>
        <CardDescription>
          Items that need restocking
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items?.map((item) => (
            <div key={item._id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">{item.name}</p>
                <p className="text-xs text-muted-foreground">
                  Category: {item.category}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">
                  {item.quantity} {item.unit_type}
                </Badge>
              </div>
            </div>
          ))}
          {(!items || items.length === 0) && (
            <div className="text-center text-sm text-muted-foreground">
              No low stock items
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
