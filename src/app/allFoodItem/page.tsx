import { getAllPublicMenuItems } from "@/actions/MenuItemAction";
import FoodSearch from "../components/search/FoodSearch";
import Link from "next/link";
export default async function AllFoodItemsPage() {
  const result = await getAllPublicMenuItems();

  const foodItems = result.menuItems ?? [];

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="mx-auto max-w-7xl">
        <Link href="/" className="text-red-500 hover:underline">
          ← Back to Home
        </Link>
        <h1 className="mb-2 text-3xl font-bold">Explore All Food Items</h1>

        <p className="mb-8 text-gray-500">
          Discover delicious food from different restaurants.
        </p>

        <FoodSearch foodItems={foodItems} />
      </div>
    </main>
  );
}
