"use client";

import { useState } from "react";
import { toggleCategory } from "@/actions/CategoryAction";

type Category = {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  isSelected: boolean;
};

export default function CategoryManagement({
  initialCategories,
}: {
  initialCategories: Category[];
}) {
  const [categories, setCategories] = useState(initialCategories);
  const [search, setSearch] = useState("");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(search.toLowerCase()),
  );

  async function handleToggle(id: string) {
    if (loadingId) return;

    const previousCategories = categories;
    setCategories((prev) =>
      prev.map((category) =>
        category.id === id
          ? { ...category, isSelected: !category.isSelected }
          : category,
      ),
    );

    setLoadingId(id);
    setMessage("");

    try {
      const result = await toggleCategory(id);

      if (!result.success) {
        setCategories(previousCategories);
        setMessage(result.message);
      } else {
        setMessage(result.message);
      }
    } catch (error) {
      setCategories(previousCategories);
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <input
        type="text"
        placeholder="Search food categories..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border rounded-lg p-3 bg-white"
      />

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {filteredCategories.map((category) => (
          <button
            key={category.id}
            type="button"
            disabled={loadingId !== null}
            onClick={() => handleToggle(category.id)}
            className={`relative border rounded-lg p-4 text-left ${
              category.isSelected
                ? "bg-green-100"
                : "border-gray-200 hover:border-gray-400"
            }`}
          >
            <h3 className="font-semibold">{category.name}</h3>

            <p className="text-sm text-gray-500 mt-1">{category.description}</p>

            {loadingId === category.id && (
              <p className="text-xs text-blue-600 mt-2">Saving...</p>
            )}
            {category.isSelected && (
              <p className="absolute text-xs top-0 right-0 p-2">Selected</p>
            )}
          </button>
        ))}
      </div>

      {filteredCategories.length === 0 && <p>No categories found.</p>}

      <p className="text-sm text-gray-500">
        {categories.filter((c) => c.isSelected).length} categories selected
      </p>

      {message && <p>{message}</p>}
    </div>
  );
}
