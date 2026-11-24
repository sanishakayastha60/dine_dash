import { Suspense } from "react";
import { getCategories } from "@/actions/CategoryAction";
import CategoryManagement from "../../components/categories/CategoryForm";

async function CategoriesContent() {
  const result = await getCategories();

  if (!result.success) {
    return <p>{result.message}</p>;
  }

  return <CategoryManagement initialCategories={result.categories} />;
}

export default function CategoriesPage() {
  return (
    <main className="max-w-5xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Manage Categories</h1>

        <p className="text-gray-500">
          Select the food categories available in your restaurant.
        </p>
      </div>

      <Suspense fallback={<p>Loading categories...</p>}>
        <CategoriesContent />
      </Suspense>
    </main>
  );
}
