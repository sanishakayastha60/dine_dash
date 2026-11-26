"use client";

import { useState } from "react";
import RestroCard from "./RestaurantCard";
import { SearchIcon } from "lucide-react";

interface Business {
  id: string;
  name: string;
  description: string | null;
  address: string;
  businessType: string;
  coverUrl: string;
  logoUrl: string;
}

export default function BusinessSearch({
  businesses,
}: {
  businesses: Business[];
}) {
  const [search, setSearch] = useState("");

  const filteredBusinesses = businesses.filter((business) =>
    [
      business.name,
      business.description,
      business.address,
      business.businessType,
    ]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  return (
    <>
      {/* Search Bar */}
      <div className="mb-8 relative">
        <input
          type="text"
          placeholder="Search restaurants or businesses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-gray-200 bg-white px-5 py-4 pl-12 shadow-sm outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-100"
        />

        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
          <SearchIcon />
        </span>
      </div>

      {/* Business Cards */}
      {filteredBusinesses.length === 0 ? (
        <p className="text-gray-500 text-center py-10">
          No businesses found matching "{search}".
        </p>
      ) : (
        <div className="flex flex-wrap gap-6">
          {filteredBusinesses.map((business) => (
            <RestroCard
              key={business.id}
              id={business.id}
              name={business.name}
              description={business.description}
              address={business.address}
              businessType={business.businessType}
              coverUrl={business.coverUrl}
              logoUrl={business.logoUrl}
            />
          ))}
        </div>
      )}
    </>
  );
}
