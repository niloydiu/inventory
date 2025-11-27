import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { Toaster } from "@/components/ui/sonner";
import { CacheBuster } from "@/lib/cache-buster";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Inventory Management System",
  description: "Efficiently manage your inventory, assignments, and livestock.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning>
        <AuthProvider>
          <CacheBuster />
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
