"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  UserCheck,
  Wheat,
  MapPin,
  Wrench,
  Calendar,
  CheckCircle,
  BarChart3,
  Users,
  FileText,
  Settings,
  LogOut,
  PawPrint,
  Building2,
  FolderTree,
  ShoppingCart,
  Truck,
  Activity,
  Bell,
  PackageCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const sidebarItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ["admin", "manager", "employee"],
  },
  {
    name: "Inventory",
    href: "/inventory",
    icon: Package,
    roles: ["admin", "manager", "employee"],
  },
  {
    name: "Categories",
    href: "/categories",
    icon: FolderTree,
    roles: ["admin", "manager"],
  },
  {
    name: "Assignments",
    href: "/assignments",
    icon: UserCheck,
    roles: ["admin", "manager", "employee"],
  },
  {
    name: "Product Assignments",
    href: "/product-assignments",
    icon: PackageCheck,
    roles: ["admin", "manager", "employee"],
  },
  {
    name: "Livestock",
    href: "/livestock",
    icon: PawPrint,
    roles: ["admin", "manager", "employee"],
  },
  {
    name: "Feeds",
    href: "/feeds",
    icon: Wheat,
    roles: ["admin", "manager", "employee"],
  },
  {
    name: "Locations",
    href: "/locations",
    icon: MapPin,
    roles: ["admin", "manager"],
  },
  {
    name: "Suppliers",
    href: "/suppliers",
    icon: Building2,
    roles: ["admin", "manager"],
  },
  {
    name: "Purchase Orders",
    href: "/purchase-orders",
    icon: ShoppingCart,
    roles: ["admin", "manager"],
  },
  {
    name: "Stock Transfers",
    href: "/stock-transfers",
    icon: Truck,
    roles: ["admin", "manager"],
  },
  {
    name: "Stock Movements",
    href: "/stock-movements",
    icon: Activity,
    roles: ["admin", "manager", "employee"],
  },
  {
    name: "Maintenance",
    href: "/maintenance",
    icon: Wrench,
    roles: ["admin", "manager", "employee"],
  },
  {
    name: "Reservations",
    href: "/reservations",
    icon: Calendar,
    roles: ["admin", "manager", "employee"],
  },
  {
    name: "Approvals",
    href: "/approvals",
    icon: CheckCircle,
    roles: ["admin", "manager", "employee"],
  },
  // Temporarily hidden - notifications feature needs fixes
  // {
  //   name: "Notifications",
  //   href: "/notifications",
  //   icon: Bell,
  //   roles: ["admin", "manager", "employee"],
  // },
  {
    name: "Reports",
    href: "/reports",
    icon: BarChart3,
    roles: ["admin", "manager"],
  },
  { name: "Users", href: "/users", icon: Users, roles: ["admin"] },
  { name: "Audit Logs", href: "/audit-logs", icon: FileText, roles: ["admin"] },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
    roles: ["admin", "manager", "employee"],
  },
];

export function Sidebar({ className }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  if (!user) return null;

  const filteredItems = sidebarItems.filter((item) =>
    item.roles.includes(user.role)
  );

  return (
    <div
      className={cn(
        "flex flex-col h-full border-r bg-sidebar/50 backdrop-blur-xl",
        className
      )}
    >
      {/* Header */}
      <div className="px-6 py-6 border-b border-sidebar-border/50">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-primary to-purple-600 shadow-lg">
            <Package className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-tight">Inventory</h2>
            <p className="text-xs text-muted-foreground">Management System</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-6">
        <div className="px-3 space-y-1.5">
          {filteredItems.map((item) => (
            <Button
              key={item.href}
              variant={pathname.startsWith(item.href) ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start gap-3 h-11 px-4 transition-all duration-200",
                pathname.startsWith(item.href)
                  ? "bg-primary/10 text-primary shadow-sm font-semibold border border-primary/20"
                  : "hover:bg-sidebar-accent/50 hover:translate-x-1"
              )}
              asChild
            >
              <Link href={item.href}>
                <item.icon
                  className={cn(
                    "h-5 w-5 transition-transform",
                    pathname.startsWith(item.href) && "scale-110"
                  )}
                />
                <span className="text-sm">{item.name}</span>
              </Link>
            </Button>
          ))}
        </div>
      </div>

      {/* User info and logout */}
      <div className="px-3 py-4 border-t border-sidebar-border/50 space-y-3">
        <div className="px-4 py-3 rounded-lg bg-sidebar-accent/50">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm">
              {user?.username?.substring(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{user?.username}</p>
              <p className="text-xs text-muted-foreground capitalize">
                {user?.role}
              </p>
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 h-11 px-4 text-destructive hover:text-destructive hover:bg-destructive/10 transition-all"
          onClick={logout}
        >
          <LogOut className="h-5 w-5" />
          <span className="text-sm font-medium">Logout</span>
        </Button>
      </div>
    </div>
  );
}
