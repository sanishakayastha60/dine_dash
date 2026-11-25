"use client";

import { useState } from "react";

type Props = {
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  restaurantName: string;
};

export default function FoodItemCard({
  name,
  description,
  price,
  imageUrl,
  restaurantName,
}: Props) {
  const [quantity, setQuantity] = useState(0);

  return (
    <div className="w-64 border rounded-xl shadow-sm overflow-hidden bg-white">
      <div>
        <img
          src={imageUrl || "/bg.jfif"}
          alt={name}
          className="w-full h-44 object-cover"
        />
      </div>

      <div className="p-3">
        <p className="text-sm text-gray-600">{restaurantName}</p>

        <h3 className="font-bold text-lg">{name}</h3>

        <p className="text-sm text-gray-500 line-clamp-2 min-h-10">
          {description || "Delicious food prepared fresh for you."}
        </p>

        <hr className="my-2" />

        <div className="flex justify-between pt-2 items-center">
          <p className="font-semibold">Rs. {price}</p>

          {quantity === 0 ? (
            <button
              onClick={() => setQuantity(1)}
              className="bg-red-200 px-4 py-1 rounded-xl hover:bg-red-300"
            >
              Add
            </button>
          ) : (
            <div className="flex items-center gap-3 bg-red-100 rounded-xl px-2 py-1">
              <button
                onClick={() => setQuantity((prev) => Math.max(0, prev - 1))}
                className="font-bold text-lg px-1"
              >
                −
              </button>

              <span className="font-semibold">{quantity}</span>

              <button
                onClick={() => setQuantity((prev) => prev + 1)}
                className="font-bold text-lg px-1"
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
// add lai click garda order ko number dekhine garne
