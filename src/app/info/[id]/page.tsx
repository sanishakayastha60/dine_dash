import { getPublicBusinessById } from "@/actions/BusinessInfoAction";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function BusinessDetailsPage({ params }: Props) {
  const { id } = await params;

  const result = await getPublicBusinessById(id);

  if (!result.success || !result.business) {
    notFound();
  }

  const business = result.business;

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Cover Image */}
      <div className="relative w-full h-64 md:h-96">
        <Image
          src={business.coverUrl || "/bg.jfif"}
          alt={business.name}
          fill
          priority
          unoptimized
          className="object-cover"
        />
      </div>

      <div className="max-w-6xl mx-auto px-5">
        {/* Business Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 -mt-16 relative z-10">
          <div className="flex flex-col md:flex-row gap-5 items-start md:items-center">
            {business.logoUrl && (
              <Image
                src={business.logoUrl}
                alt={`${business.name} logo`}
                width={110}
                height={110}
                unoptimized
                className="w-24 h-24 rounded-xl object-cover border"
              />
            )}

            <div className="flex-1">
              <h1 className="text-3xl font-bold">{business.name}</h1>

              <p className="text-gray-500 mt-1">{business.businessType}</p>
            </div>
          </div>
        </div>

        {/* Business Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {/* About */}
          <div className="md:col-span-2 bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4">About Business</h2>

            <p className="text-gray-600 leading-7 whitespace-pre-line">
              {business.description || "No description available."}
            </p>

            {business.specialNotice && (
              <div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-4">
                <h3 className="font-bold text-red-600 mb-2">Special Notice</h3>

                <p className="text-gray-700">{business.specialNotice}</p>
              </div>
            )}
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-xl shadow-sm p-6 h-fit">
            <h2 className="text-xl font-bold mb-4">Contact Information</h2>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Address</p>
                <p className="font-medium">📍 {business.address}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Phone Number</p>
                <p className="font-medium">
                  {business.phoneNumber || "Not provided"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Business Type</p>
                <p className="font-medium">{business.businessType}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="py-8">
          <Link
            href="/"
            className="bg-red-200 hover:bg-red-300 px-5 py-2 rounded-xl inline-block"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
