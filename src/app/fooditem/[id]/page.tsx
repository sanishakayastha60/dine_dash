import { getFoodItem } from "@/actions/FoodItemAction";
import { notFound } from "next/navigation";

export default async function FoodItems({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const product = await getFoodItem(id);

  if (!product) {
    notFound();
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row">
        <div className="flex w-full items-center justify-center">
          <img src="/momo.png" alt="momo" className="bg-blue-300" />
        </div>
        <div className="flex flex-col justify-center">
          <p className="text-sm text-green-700">{product.restaurant}</p>
          <h2 className="text-2xl font-bold">{product.name}</h2>
          <p className="font-light text-sm">{product.description}</p>
          <p className="font-bold italic text-xl">Rs. {product.price}</p>
        </div>
      </div>
      <hr />
      <div>
        <h3 className="text-xl font-bold">Reviews</h3>
        <div className="text-red-500">Sign in to give your reviews</div>
      </div>
    </div>
  );
}
