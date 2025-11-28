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
  {
    name: "Notifications",
    href: "/notifications",
    icon: Bell,
    roles: ["admin", "manager", "employee"],
  },
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
      className={cn("flex flex-col h-full border-r bg-background", className)}
    >
      {/* Header */}
      <div className="px-6 py-6 border-b">
        <h2 className="text-lg font-semibold tracking-tight">
          Inventory System
        </h2>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4">
        <div className="px-3 space-y-1">
          {filteredItems.map((item) => (
            <Button
              key={item.href}
              variant={pathname.startsWith(item.href) ? "secondary" : "ghost"}
              className="w-full justify-start"
              asChild
            >
              <Link href={item.href}>
                <item.icon className="mr-2 h-4 w-4" />
                {item.name}
              </Link>
            </Button>
          ))}
        </div>
      </div>

      {/* Logout button at bottom */}
      <div className="px-3 py-4 border-t">
        <Button
          variant="ghost"
          className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
          onClick={logout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
}
