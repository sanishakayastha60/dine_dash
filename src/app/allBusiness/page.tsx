import { getPublicBusinessInfo } from "@/actions/BusinessInfoAction";
import Link from "next/link";
import Search from "../components/Search";

export default async function AllBusinessesPage() {
  const result = await getPublicBusinessInfo();

  const businesses = result.businesses;

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Link href="/" className="text-red-500 hover:underline">
            ← Back to Home
          </Link>

          <h1 className="text-3xl font-bold mt-4">Explore All Businesses</h1>

          <p className="text-gray-500 mt-2">
            Discover restaurants and businesses around you.
          </p>
        </div>

        {businesses.length === 0 ? (
          <p className="text-gray-500">No businesses available.</p>
        ) : (
          <Search businesses={businesses} />
        )}
      </div>
    </main>
  );
}
