import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import ProfileForm from "@/app/components/ProfileForm";
import { Suspense } from "react";

export default function DashboardPage() {
  return (
    <Suspense fallback={<div>Loading Business Dashboard...</div>}>
      <DashboardContent />
    </Suspense>
  );
}

async function DashboardContent() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/business/login");
  }

  if (session.user.role !== "BUSINESS") {
    redirect("/");
  }

  return <ProfileForm />;
}
