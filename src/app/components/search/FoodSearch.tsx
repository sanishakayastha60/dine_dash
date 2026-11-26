"use client";

import { useState } from "react";
import { SearchIcon } from "lucide-react";

interface FoodItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  category: {
    id: string;
    name: string;
  };
  business: {
    id: string;
    name: string;
    address: string;
  };
}

export default function FoodSearch({ foodItems }: { foodItems: FoodItem[] }) {
  const [search, setSearch] = useState("");

  const filteredFood = foodItems.filter((item) =>
    [
      item.name,
      item.description ?? "",
      item.category.name,
      item.business.name,
      item.business.address,
    ]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase().trim()),
  );

  return (
    <>
      {/* Search */}
      <div className="relative mb-8">
        <input
          type="text"
          placeholder="Search food, category or restaurant..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-gray-200 bg-white px-5 py-4 pl-12 shadow-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
        />

        <SearchIcon
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          size={20}
        />
      </div>

      {/* Food Items */}
      {filteredFood.length === 0 ? (
        <p className="py-10 text-center text-gray-500">
          No food items found matching "{search}".
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredFood.map((item) => (
            <div
              key={item.id}
              className="overflow-hidden rounded-xl bg-white shadow-sm"
            >
              <img
                src={item.imageUrl || "/placeholder-food.jpg"}
                alt={item.name}
                className="h-48 w-full object-cover"
              />

              <div className="p-4">
                <h2 className="text-lg font-bold">{item.name}</h2>

                <p className="mt-1 text-sm text-gray-500">
                  {item.description || "No description available"}
                </p>

                <p className="mt-2 text-sm text-red-500">
                  {item.category.name}
                </p>

                <p className="mt-3 text-xl font-bold">Rs. {item.price}</p>

                <p className="mt-2 text-sm text-gray-600">
                  {item.business.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
