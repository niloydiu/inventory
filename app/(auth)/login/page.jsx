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
import { PageLoader } from "@/components/ui/loader";
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
    return <PageLoader />;
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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12 sm:px-6 lg:px-8">
      {/* Animated gradient background */}
      <div className="absolute inset-0 animated-gradient opacity-20" />

      {/* Decorative elements */}
      <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" />

      <Card className="relative w-full max-w-md shadow-premium hover-lift glass">
        <CardHeader className="space-y-2 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-primary to-purple-600 shadow-lg">
            <svg
              className="h-8 w-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-base">
            Sign in to your inventory management account
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <LoginForm />
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="relative w-full">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                New to the platform?
              </span>
            </div>
          </div>
          <p className="text-center text-sm text-muted-foreground">
            <Link
              href="/register"
              className="font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              Create an account
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
