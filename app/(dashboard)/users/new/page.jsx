"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { createUser } from "@/lib/actions/users.actions";
import { UserForm } from "@/components/users/user-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewUserPage() {
  const router = useRouter();
  const { token, user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Only admins can create users
  if (user?.role !== "admin") {
    router.push("/users");
    return null;
  }

  async function handleSubmit(formData) {
    setIsSubmitting(true);
    try {
      const result = await createUser(formData, token);
      if (result.success) {
        toast.success("User created successfully");
        router.push("/users");
      } else {
        toast.error(result.error || "Failed to create user");
      }
    } catch (error) {
      toast.error("Failed to create user");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/users">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Create New User
            </h2>
            <p className="text-muted-foreground">
              Add a new user to the system
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
            <CardDescription>
              Enter the details for the new user account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UserForm
              onSubmit={handleSubmit}
              isLoading={isSubmitting}
              isEdit={false}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
