import { requireAdmin } from "@/lib/authorization";
import { Suspense } from "react";

export default async function AdminDashboard() {
  return (
    <Suspense>
      <AdminDashboardContent />
    </Suspense>
  );
}

async function AdminDashboardContent() {
  const admin = await requireAdmin();
  return (
    <div>
      <h1>Super Admin Dashboard</h1>
      <p>Welcome {admin.name}</p>
    </div>
  );
}
