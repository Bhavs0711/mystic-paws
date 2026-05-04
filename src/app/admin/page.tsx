import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AdminDashboardClient } from "@/components/reading/admin-dashboard-client";

export default async function AdminPage() {
  const session = await auth();

  if (!session?.user?.isAdmin) {
    redirect("/");
  }

  return <AdminDashboardClient />;
}
