"use client";

import { useEffect } from "react";

/**
 * Cache Buster Component
 * Prevents aggressive caching issues in development
 */
export function CacheBuster() {
  useEffect(() => {
    // Add timestamp to prevent caching
    if (typeof window !== "undefined") {
      // Add cache-busting parameter to all fetch requests
      const originalFetch = window.fetch;
      window.fetch = function (...args) {
        const [resource, config] = args;
        if (typeof resource === "string" && resource.includes("/api/")) {
          const url = new URL(resource, window.location.origin);
          url.searchParams.set("_t", Date.now().toString());
          args[0] = url.toString();
        }
        return originalFetch.apply(this, args);
      };
    }
  }, []);

  return null;
}

/**
 * Clear all browser caches programmatically
 */
export function clearAllCaches() {
  if (typeof window === "undefined") return;

  // Clear localStorage
  localStorage.clear();

  // Clear sessionStorage
  sessionStorage.clear();

  // Clear cookies
  document.cookie.split(";").forEach((c) => {
    document.cookie = c
      .replace(/^ +/, "")
      .replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
  });

  // Clear service worker cache
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((registration) => registration.unregister());
    });
  }

  // Clear cache storage
  if ("caches" in window) {
    caches.keys().then((names) => {
      names.forEach((name) => caches.delete(name));
    });
  }

  console.log("✅ All caches cleared");
}
