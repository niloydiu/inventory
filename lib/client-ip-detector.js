"use client";

/**
 * Client IP Detection Utility
 * Detects the user's public IP address and stores it for audit logging
 */

let ipDetectionAttempted = false;

/**
 * Detect and store the client's public IP address
 * This is used to improve audit logging when the app is behind proxies
 */
export async function detectAndStoreClientIp() {
  // Only run in browser
  if (typeof window === "undefined") return;
  
  // Only attempt once per session
  if (ipDetectionAttempted) return;
  ipDetectionAttempted = true;

  try {
    // Check if we already have it in session storage
    const storedIp = sessionStorage.getItem("client_ip");
    if (storedIp && storedIp !== "unknown") {
      console.log("[IP Detector] Using cached IP:", storedIp);
      return storedIp;
    }

    // Try to get IP from ipify (free, no authentication required)
    console.log("[IP Detector] Fetching client IP...");
    const response = await fetch("https://api.ipify.org?format=json", {
      cache: "no-store",
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data.ip) {
        console.log("[IP Detector] Detected IP:", data.ip);
        sessionStorage.setItem("client_ip", data.ip);
        return data.ip;
      }
    }
  } catch (error) {
    console.warn("[IP Detector] Failed to detect IP:", error.message);
  }

  // Fallback: mark as unknown so we don't keep trying
  sessionStorage.setItem("client_ip", "unknown");
  return "unknown";
}

/**
 * Get the stored client IP
 */
export function getStoredClientIp() {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem("client_ip");
}
