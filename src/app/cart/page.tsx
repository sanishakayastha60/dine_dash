"use client";

import { useCart } from "@/context/CardContext";
import Link from "next/link";
import Image from "next/image";

export default function CartPage() {
  const {
    cart,
    loading,
    updateQuantity,
    removeFromCart,
    totalItems,
    totalPrice,
  } = useCart();

  if (loading) {
    return <div className="text-center py-20">Loading your cart...</div>;
  }

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="text-6xl mb-4">🛒</div>

        <h1 className="text-2xl font-bold">Your cart is empty</h1>

        <p className="text-gray-500 mt-2">
          Looks like you haven't added anything yet.
        </p>

        <Link
          href="/"
          className="mt-6 bg-red-500 text-white px-6 py-3 rounded-xl hover:bg-red-600"
        >
          Explore Food
        </Link>
      </div>
    );
  }

  // Group items by restaurant
  const groupedCart = cart.reduce(
    (groups, item) => {
      const restaurantName = item.menuItem.business.name;

      if (!groups[restaurantName]) {
        groups[restaurantName] = [];
      }

      groups[restaurantName].push(item);

      return groups;
    },
    {} as Record<string, typeof cart>,
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">Your Shopping Cart</h1>

      <p className="text-gray-500 mb-8">{totalItems} items in your cart</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          {Object.entries(groupedCart).map(([restaurantName, items]) => {
            const restaurantTotal = items.reduce(
              (total, item) =>
                total + Number(item.menuItem.price) * item.quantity,
              0,
            );

            return (
              <div key={restaurantName} className="border rounded-xl p-5">
                <h2 className="text-xl font-bold mb-4"> {restaurantName}</h2>

                <div className="space-y-5">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col sm:flex-row gap-4 border-b pb-5 last:border-0 last:pb-0"
                    >
                      <div className="relative w-full sm:w-28 h-28">
                        <img
                          src={item.menuItem.imageUrl || "/bg.jfif"}
                          alt={item.menuItem.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>

                      <div className="flex-1">
                        <h3 className="font-bold text-lg">
                          {item.menuItem.name}
                        </h3>

                        <p className="text-gray-500 text-sm mt-1">
                          {item.menuItem.description}
                        </p>

                        <p className="font-semibold mt-2">
                          Rs. {item.menuItem.price}
                        </p>

                        {!item.menuItem.isAvailable && (
                          <p className="text-red-500 text-sm mt-1">
                            Currently unavailable
                          </p>
                        )}

                        <div className="flex items-center gap-4 mt-3">
                          <div className="flex items-center border rounded-lg">
                            <button
                              disabled={!item.menuItem.isAvailable}
                              onClick={() =>
                                updateQuantity(
                                  item.menuItemId,
                                  item.quantity - 1,
                                )
                              }
                              className="px-3 py-1 font-bold"
                            >
                              −
                            </button>

                            <span className="px-3">{item.quantity}</span>

                            <button
                              disabled={
                                !item.menuItem.isAvailable ||
                                item.quantity >= 99
                              }
                              onClick={() =>
                                updateQuantity(
                                  item.menuItemId,
                                  item.quantity + 1,
                                )
                              }
                              className="px-3 py-1 font-bold"
                            >
                              +
                            </button>
                          </div>

                          <button
                            onClick={() => removeFromCart(item.menuItemId)}
                            className="text-red-500 text-sm hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                      </div>

                      <div className="font-bold text-right">
                        Rs. {Number(item.menuItem.price) * item.quantity}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t mt-4 pt-4 flex justify-between font-semibold">
                  <span>Restaurant subtotal</span>
                  <span>Rs. {restaurantTotal}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary */}
        <div>
          <div className="border rounded-xl p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>

            <div className="flex justify-between mb-3">
              <span className="text-gray-500">Total items</span>
              <span>{totalItems}</span>
            </div>

            <div className="flex justify-between mb-3">
              <span className="text-gray-500">Subtotal</span>
              <span>Rs. {totalPrice}</span>
            </div>

            <div className="flex justify-between mb-3">
              <span className="text-gray-500">Delivery fee</span>
              <span>Calculated at checkout</span>
            </div>

            <hr className="my-4" />

            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>Rs. {totalPrice}</span>
            </div>

            <Link
              href="/checkout"
              className="block text-center bg-red-500 text-white py-3 rounded-xl mt-6 hover:bg-red-600"
            >
              Proceed to Checkout
            </Link>

            <Link
              href="/"
              className="block text-center text-gray-500 mt-4 hover:underline"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
