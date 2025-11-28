"use client";

import { useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { LoginForm } from "@/components/auth/login-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default function LoginPage() {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    console.log("[LoginPage] Auth state:", { isAuthenticated, isLoading });
    if (!isLoading && isAuthenticated) {
      console.log(
        "[LoginPage] User is authenticated, redirecting to dashboard"
      );
      // Use window.location for hard redirect to clear cache
      window.location.href = "/dashboard";
    }
  }, [isAuthenticated, isLoading]);

  // Add no-cache meta tags
  useEffect(() => {
    // Set meta tags to prevent caching
    const metaCache = document.createElement("meta");
    metaCache.httpEquiv = "Cache-Control";
    metaCache.content = "no-cache, no-store, must-revalidate";
    document.head.appendChild(metaCache);

    const metaPragma = document.createElement("meta");
    metaPragma.httpEquiv = "Pragma";
    metaPragma.content = "no-cache";
    document.head.appendChild(metaPragma);

    const metaExpires = document.createElement("meta");
    metaExpires.httpEquiv = "Expires";
    metaExpires.content = "0";
    document.head.appendChild(metaExpires);

    return () => {
      document.head.removeChild(metaCache);
      document.head.removeChild(metaPragma);
      document.head.removeChild(metaExpires);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  // Don't render if authenticated - prevents flash of login form
  if (isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Redirecting...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold tracking-tight">
            Sign in
          </CardTitle>
          <CardDescription>
            Enter your credentials to access the inventory system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-primary hover:underline"
            >
              Register
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
