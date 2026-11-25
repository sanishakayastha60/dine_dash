import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import ProfileForm from "@/app/components/ProfileForm";
import { Suspense } from "react";
import { prisma } from "@/lib/prisma";

export default function DashboardPage() {
  return (
    <Suspense fallback={<div>Loading Business Dashboard...</div>}>
      <DashboardContent />
    </Suspense>
  );
}

async function DashboardContent() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/business/login");
  }

  if (session.user.role !== "BUSINESS") {
    redirect("/");
  }

  const business = await prisma.businessInfo.findFirst({
    where: {
      userId: session.user.id,
    },
    select: {
      id: true,
      name: true,
      isVerified: true,
    },
  });

  if (!business) {
    redirect("/business/businessinfo");
  }

  if (!business.isVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="max-w-md rounded-xl bg-white p-8 text-center shadow-md">
          <h1 className="text-2xl font-bold">Verification Pending</h1>

          <p className="mt-3 text-gray-600">
            Your business, <strong>{business.name}</strong>, has been registered
            successfully.
          </p>

          <p className="mt-3 text-sm text-gray-500">
            Our team is reviewing your business information. You will be able to
            access your business dashboard once your business has been verified.
          </p>
        </div>
      </div>
    );
  }

  return <ProfileForm />;
}
