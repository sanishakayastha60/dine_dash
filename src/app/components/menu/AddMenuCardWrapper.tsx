import { getSelectedCategories } from "@/actions/CategoryAction";
import AddMenuCard from "./AddMenuCard";
import MenuList from "./MenuList";

export default async function AddMenuCardWrapper() {
  const result = await getSelectedCategories();

  if (!result.success) {
    return <p>Unable to load food categories.</p>;
  }
  if (result.categories.length === 0) {
    return (
      <p className="text-sm text-gray-500">
        No selected food categories. Please select categories first.
      </p>
    );
  }

  return (
    <div>
      <AddMenuCard categories={result.categories} />
      <MenuList />
    </div>
  );
}
