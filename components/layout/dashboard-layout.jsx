"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageLoader } from "@/components/ui/loader";
import { useAuth } from "@/lib/auth-context";
import { Sidebar } from "./sidebar";
import { Header } from "./header";

export default function DashboardLayout({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading state while checking authentication
  if (isLoading) {
    return <PageLoader />;
  }

  // Don't render anything if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar - Fixed on desktop */}
      <aside className="hidden md:block w-64 shrink-0">
        <Sidebar className="fixed top-0 left-0 w-64 h-screen" />
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-auto bg-linear-to-br from-background via-background to-primary/5">
          <div className="p-6 md:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
