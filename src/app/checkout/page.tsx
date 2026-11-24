import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "USER") {
    redirect("/");
  }

  return (
    <div>
      <h1>Welcome {session.user.name}</h1>
      <p>{session.user.email}</p>
      <p>{session.user.role}</p>
    </div>
  );
}
