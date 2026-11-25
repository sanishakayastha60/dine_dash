"use client";

type Props = {
  id: string;
  name: string;
  description: string | null;
  address: string;
  businessType: string;
  coverUrl: string | null;
  logoUrl: string | null;
};

import { useRouter } from "next/navigation";

export default function BusinessCard({
  id,
  name,
  description,
  address,
  businessType,
  coverUrl,
  logoUrl,
}: Props) {
  const router = useRouter();
  return (
    <div className="w-64 border rounded-xl shadow-sm overflow-hidden bg-white">
      <div>
        <img
          src={coverUrl || "/bg.jfif"}
          alt={name}
          className="w-full h-44 object-cover"
        />
      </div>

      <div className="p-3">
        <div className="flex items-center gap-2">
          {logoUrl && (
            <img
              src={logoUrl}
              alt={`${name} logo`}
              className="w-10 h-10 rounded-full object-cover"
            />
          )}

          <div>
            <h3 className="font-bold text-lg line-clamp-1">{name}</h3>

            <p className="text-sm text-gray-600">{businessType}</p>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-500 line-clamp-2 min-h-10 mt-2">
          {description || "Discover this business."}
        </p>

        <hr className="my-2" />

        {/* Address */}
        <p className="text-sm text-gray-600 line-clamp-2">{address}</p>

        <div className="flex justify-between items-center mt-3">
          <button
            onClick={() => router.push(`/info/${id}`)}
            className="bg-red-200 px-3 py-1 rounded-xl hover:bg-red-300 text-sm"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}
