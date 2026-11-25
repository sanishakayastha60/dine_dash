import { requireAdmin } from "@/lib/authorization";
import { Suspense } from "react";
import { getAllBusinessInfo } from "@/actions/BusinessInfoAction";
import BusinessTable from "@/app/components/admin/BusinessTable";

export default async function AdminDashboard() {
  return (
    <Suspense>
      <AdminDashboardContent />
    </Suspense>
  );
}

async function AdminDashboardContent() {
  const admin = await requireAdmin();
  const result = await getAllBusinessInfo();
  if (result.success) {
    console.log(result.businesses);
  }
  if (!result.success) {
    return <div>{result.message}</div>;
  }
  return (
    <div>
      <h1>Super Admin Dashboard</h1>
      <BusinessTable businesses={result.businesses} />
    </div>
  );
}
