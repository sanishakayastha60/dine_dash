import { getSelectedCategories } from "@/actions/CategoryAction";
import AddMenuCard from "./AddMenuCard";

export default async function AddMenuCardWrapper() {
  const result = await getSelectedCategories();

  if (!result.success) {
    return <p>Unable to load food categories.</p>;
  }

  return <AddMenuCard categories={result.categories} />;
}
