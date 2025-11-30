"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { assignmentsApi, itemsApi, usersApi } from "@/lib/api";
import { AssignmentForm } from "@/components/assignments/assignment-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NewAssignmentPage() {
  const router = useRouter();
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function fetchData() {
      if (!token) return;

      try {
        console.log("Fetching items and users...");

        const [itemsData, usersData] = await Promise.all([
          itemsApi.getAll(token),
          usersApi.getAll(token),
        ]);

        console.log("Items API response:", itemsData);
        console.log("Users API response:", usersData);

        // Handle the response structure from our fixed API
        let itemsList = [];
        if (Array.isArray(itemsData)) {
          itemsList = itemsData;
        } else if (itemsData && itemsData.data) {
          itemsList = Array.isArray(itemsData.data) ? itemsData.data : [];
        }

        let usersList = [];
        if (Array.isArray(usersData)) {
          usersList = usersData;
        } else if (usersData && usersData.data) {
          usersList = Array.isArray(usersData.data) ? usersData.data : [];
        }

        console.log("Final items list:", itemsList);
        console.log("Final users list:", usersList);

        setItems(itemsList);
        setUsers(usersList);
      } catch (error) {
        console.error("Failed to load data:", error);
        toast.error("Failed to load data");
        setItems([]);
        setUsers([]);
      }
    }

    fetchData();
  }, [token]);

  async function onSubmit(data) {
    setIsLoading(true);
    try {
      console.log("Submitting assignment data:", data);
      const result = await assignmentsApi.create(data, token);
      console.log("Assignment created:", result);
      toast.success("Assignment created successfully");
      router.push("/assignments");
    } catch (error) {
      console.error("Assignment creation error:", error);
      // Show the detailed error message
      const errorMessage = error.message || "Failed to create assignment";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/assignments">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">New Assignment</h2>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Assignment Details</CardTitle>
            <CardDescription>Assign an item to an employee</CardDescription>
          </CardHeader>
          <CardContent>
            <AssignmentForm
              onSubmit={onSubmit}
              isLoading={isLoading}
              items={items}
              users={users}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
