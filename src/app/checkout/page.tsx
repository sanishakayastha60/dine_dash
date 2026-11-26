"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CardContext";

export default function CheckoutPage() {
  const router = useRouter();

  const { cart, loading, totalItems, totalPrice } = useCart();

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState("");

  async function handleCheckout() {
    try {
      setError("");
      setPlacingOrder(true);

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerName,
          customerPhone,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Order failed");
      }

      // Redirect to order confirmation
      router.push(`/orders/${data.order.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setPlacingOrder(false);
    }
  }

  if (loading) {
    return <div className="text-center py-20">Loading checkout...</div>;
  }

  if (cart.length === 0) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold">Your cart is empty</h1>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Customer Information */}
        <div className="border rounded-xl p-6">
          <h2 className="text-xl font-bold mb-5">Customer Information</h2>

          <div className="mb-4">
            <label className="block mb-2 font-medium">Full Name</label>

            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Enter your name"
              className="w-full border rounded-lg p-3"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2 font-medium">Phone Number</label>

            <input
              type="tel"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="Enter your phone number"
              className="w-full border rounded-lg p-3"
              required
            />
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mt-5">
            <p className="font-medium">Payment Method</p>

            <p className="text-gray-500 text-sm mt-1">
              Cash payment at restaurant pickup.
            </p>
          </div>
        </div>

        {/* Order Summary */}
        <div className="border rounded-xl p-6">
          <h2 className="text-xl font-bold mb-5">Order Summary</h2>

          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex justify-between gap-3 border-b pb-3"
              >
                <div>
                  <p className="font-medium">{item.menuItem.name}</p>

                  <p className="text-sm text-gray-500">
                    {item.menuItem.business.name}
                  </p>

                  <p className="text-sm text-gray-500">
                    Quantity: {item.quantity}
                  </p>
                </div>

                <p className="font-semibold">
                  Rs. {Number(item.menuItem.price) * item.quantity}
                </p>
              </div>
            ))}
          </div>

          <div className="border-t mt-5 pt-5 space-y-3">
            <div className="flex justify-between">
              <span>Total Items</span>
              <span>{totalItems}</span>
            </div>

            <div className="flex justify-between text-xl font-bold">
              <span>Grand Total</span>
              <span>Rs. {totalPrice}</span>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm mt-4">{error}</p>}

          <button
            onClick={handleCheckout}
            disabled={
              placingOrder || !customerName.trim() || !customerPhone.trim()
            }
            className="w-full bg-red-500 text-white py-3 rounded-xl mt-6 font-semibold hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {placingOrder ? "Placing Order..." : "Confirm Order"}
          </button>
        </div>
      </div>
    </div>
  );
}
