import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Layers, AlertTriangle, UserCheck } from "lucide-react";

export function StatsCards({ stats }) {
  const cards = [
    {
      title: "Total Items",
      value: stats?.total_items || 0,
      description: "Across all categories",
      icon: Package,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-500/10",
      iconColor: "text-blue-600",
    },
    {
      title: "Categories",
      value: stats?.total_categories || 0,
      description: "Active categories",
      icon: Layers,
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-500/10",
      iconColor: "text-purple-600",
    },
    {
      title: "Low Stock Alerts",
      value: stats?.low_stock_count || stats?.low_stock || 0,
      description: "Items below minimum level",
      icon: AlertTriangle,
      color: "from-amber-500 to-orange-500",
      bgColor: "bg-amber-500/10",
      iconColor: "text-amber-600",
    },
    {
      title: "Active Assignments",
      value: stats?.active_assignments || 0,
      description: "Currently assigned items",
      icon: UserCheck,
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-500/10",
      iconColor: "text-green-600",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => (
        <Card
          key={index}
          className="hover-lift overflow-hidden border-2 transition-all duration-300 hover:border-primary/20 hover:shadow-premium"
        >
          <div
            className={`absolute top-0 right-0 w-32 h-32 bg-linear-to-br ${card.color} opacity-5 rounded-full -mr-16 -mt-16`}
          />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-muted-foreground">
              {card.title}
            </CardTitle>
            <div className={`p-2.5 rounded-xl ${card.bgColor} relative z-10`}>
              <card.icon className={`h-5 w-5 ${card.iconColor}`} />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold tracking-tight">
              {card.value.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {card.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
