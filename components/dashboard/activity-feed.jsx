import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

export function ActivityFeed({ activities }) {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>
          Latest actions in the system
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          <div className="space-y-4">
            {activities?.map((activity) => (
              <div key={activity._id} className="flex items-start gap-4 text-sm">
                <div className="grid gap-1">
                  <p className="font-medium">{activity.username} {activity.action}</p>
                  <p className="text-muted-foreground">{activity.description}</p>
                  <p className="text-xs text-muted-foreground">{new Date(activity.created_at).toLocaleString()}</p>
                </div>
              </div>
            ))}
            {(!activities || activities.length === 0) && (
              <div className="text-center text-sm text-muted-foreground">
                No recent activity
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
