import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import OrderAutoRefresh from "./OrderAutoRefresh";

type Props = {
  params: Promise<{ id: string }>;
};

const statusStyles: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  ACCEPTED: "bg-blue-100 text-blue-800",
  PREPARING: "bg-purple-100 text-purple-800",
  READY: "bg-green-100 text-green-800",
  COMPLETED: "bg-gray-100 text-gray-700",
  CANCELLED: "bg-red-100 text-red-800",
  REJECTED: "bg-red-100 text-red-800",
};

export default async function OrderConfirmationPage({ params }: Props) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  if (session.user.role !== "USER") {
    redirect("/");
  }

  const { id } = await params;

  const order = await prisma.order.findFirst({
    where: {
      id,
      userId: session.user.id,
    },
    include: {
      businessOrders: {
        include: {
          business: {
            select: {
              name: true,
              address: true,
            },
          },
          items: true,
        },
      },
    },
  });

  if (!order) {
    notFound();
  }

  const hasPendingOrders = order.businessOrders.some(
    (businessOrder) => businessOrder.status === "PENDING",
  );

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      {/* Auto refresh */}
      <OrderAutoRefresh />

      {/* Success Message */}
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-green-600">
          Order Placed Successfully!
        </h1>

        <p className="mt-2 text-gray-500">
          {hasPendingOrders
            ? "Your order has been sent. Waiting for business confirmation."
            : "Your order is being processed."}
        </p>
      </div>

      {/* Master Order */}
      <div className="mb-6 rounded-xl border p-5">
        <p className="text-sm text-gray-500">Master Order Number</p>

        <h2 className="mt-1 text-2xl font-bold">{order.orderNumber}</h2>

        <p className="mt-3 text-sm text-gray-500">
          Customer: {order.customerName}
        </p>

        <p className="text-sm text-gray-500">Phone: {order.customerPhone}</p>

        <p className="mt-2 text-sm text-gray-500">
          Date: {order.createdAt.toLocaleString()}
        </p>
      </div>

      {/* Business Orders */}
      <div className="space-y-6">
        {order.businessOrders.map((businessOrder) => (
          <div
            key={businessOrder.id}
            className="overflow-hidden rounded-xl border"
          >
            {/* Business Header */}
            <div className="bg-gray-50 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-xl font-bold">
                  {businessOrder.business.name}
                </h2>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    statusStyles[businessOrder.status]
                  }`}
                >
                  {businessOrder.status}
                </span>
              </div>

              <p className="mt-1 text-sm text-gray-500">
                {businessOrder.business.address}
              </p>

              {/* Pickup Token */}

              {/* Pickup Token */}
              {businessOrder.status === "ACCEPTED" ||
              businessOrder.status === "PREPARING" ||
              businessOrder.status === "READY" ||
              businessOrder.status === "COMPLETED" ? (
                businessOrder.tokenNumber ? (
                  <div className="mt-5 rounded-xl border-2 border-dashed border-green-400 bg-white p-5 text-center">
                    <p className="text-sm text-gray-500">
                      Your Restaurant Pickup Token
                    </p>

                    <h3 className="mt-2 text-3xl font-extrabold tracking-wider text-green-600">
                      {businessOrder.tokenNumber}
                    </h3>

                    <p className="mt-2 text-xs text-gray-500">
                      Show this token at the restaurant when collecting your
                      order.
                    </p>
                  </div>
                ) : null
              ) : businessOrder.status === "PENDING" ? (
                <div className="mt-5 rounded-xl border border-yellow-200 bg-yellow-50 p-5 text-center">
                  <div className="text-3xl">⏳</div>

                  <h3 className="mt-2 font-semibold text-yellow-800">
                    Waiting for Confirmation
                  </h3>

                  <p className="mt-1 text-sm text-yellow-700">
                    The business has received your order. Your pickup token will
                    be generated once they accept it.
                  </p>
                </div>
              ) : businessOrder.status === "REJECTED" ? (
                <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-5 text-center">
                  <h3 className="font-semibold text-red-700">Order Rejected</h3>

                  <p className="mt-1 text-sm text-red-600">
                    Unfortunately, this business could not accept your order.
                  </p>
                </div>
              ) : businessOrder.status === "CANCELLED" ? (
                <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-5 text-center">
                  <h3 className="font-semibold text-red-700">
                    Order Cancelled
                  </h3>
                </div>
              ) : null}
            </div>

            {/* Ordered Items */}
            <div className="p-5">
              <h3 className="mb-4 font-semibold">Ordered Items</h3>

              <div className="space-y-3">
                {businessOrder.items.map((item) => (
                  <div key={item.id} className="flex justify-between gap-3">
                    <div>
                      <p className="font-medium">{item.menuItemName}</p>

                      <p className="text-sm text-gray-500">
                        Rs. {Number(item.price).toFixed(2)} × {item.quantity}
                      </p>
                    </div>

                    <p className="font-semibold">
                      Rs. {(Number(item.price) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <hr className="my-4" />

              <div className="flex justify-between font-bold">
                <span>Restaurant Total</span>

                <span>Rs. {Number(businessOrder.totalAmount).toFixed(2)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Grand Total */}
      <div className="mt-6 rounded-xl border p-5">
        <div className="flex justify-between text-lg font-bold">
          <span>Grand Total</span>

          <span>Rs. {Number(order.totalAmount).toFixed(2)}</span>
        </div>

        <p className="mt-2 text-sm text-gray-500">
          Payment Method: {order.paymentMethod}
        </p>

        <p className="text-sm text-gray-500">
          Payment Status: {order.paymentStatus}
        </p>
      </div>

      {/* Continue Shopping */}
      <Link
        href="/"
        className="mt-8 block rounded-xl bg-red-500 py-3 text-center font-semibold text-white hover:bg-red-600"
      >
        Continue Shopping
      </Link>
    </main>
  );
}
