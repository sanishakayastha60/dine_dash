"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type OrderStatus =
  | "PENDING"
  | "ACCEPTED"
  | "PREPARING"
  | "READY"
  | "COMPLETED"
  | "CANCELLED"
  | "REJECTED";

type OrderItem = {
  id: string;
  menuItemId: string | null;
  menuItemName: string;
  quantity: number;
  price: string | number;
};

type BusinessOrder = {
  id: string;
  tokenNumber: string;
  status: OrderStatus;
  totalAmount: string | number;
  createdAt: string;
  order: {
    id: string;
    orderNumber: string;
    customerName: string;
    customerPhone: string;
    paymentMethod: string;
    paymentStatus: string;
    createdAt: string;
  };
  items: OrderItem[];
};

type Tab = "ALL" | OrderStatus;

const tabs: { label: string; value: Tab }[] = [
  { label: "All Orders", value: "ALL" },
  { label: "Pending", value: "PENDING" },
  { label: "Accepted", value: "ACCEPTED" },
  { label: "Preparing", value: "PREPARING" },
  { label: "Ready", value: "READY" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Rejected", value: "REJECTED" },
];

const statusStyles: Record<OrderStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  ACCEPTED: "bg-blue-100 text-blue-800",
  PREPARING: "bg-purple-100 text-purple-800",
  READY: "bg-green-100 text-green-800",
  COMPLETED: "bg-gray-100 text-gray-700",
  CANCELLED: "bg-red-100 text-red-800",
  REJECTED: "bg-red-100 text-red-800",
};

const nextActions: Partial<
  Record<OrderStatus, { label: string; status: OrderStatus }>
> = {
  ACCEPTED: { label: "Accept Order", status: "ACCEPTED" },
  PREPARING: { label: "Start Preparing", status: "PREPARING" },
  READY: { label: "Mark as Ready", status: "READY" },
  COMPLETED: { label: "Complete Order", status: "COMPLETED" },
};

function formatPrice(price: string | number) {
  return `Rs. ${Number(price).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(date: string) {
  return new Date(date).toLocaleString();
}

export default function BusinessOrdersPage() {
  const [orders, setOrders] = useState<BusinessOrder[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = useCallback(async (showLoader = false) => {
    if (showLoader) setLoading(true);

    try {
      const response = await fetch("/api/business/orders", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch orders");
      }

      setOrders(data.orders || []);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      if (showLoader) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders(true);

    const interval = setInterval(() => {
      fetchOrders();
    }, 10000);

    return () => clearInterval(interval);
  }, [fetchOrders]);

  const updateStatus = async (orderId: string, status: OrderStatus) => {
    try {
      setUpdatingId(orderId);

      const response = await fetch(`/api/business/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update order");
      }

      await fetchOrders();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = useMemo(() => {
    if (activeTab === "ALL") return orders;

    return orders.filter((order) => order.status === activeTab);
  }, [orders, activeTab]);

  const countOrders = (status: Tab) => {
    if (status === "ALL") return orders.length;

    return orders.filter((order) => order.status === status).length;
  };

  const getAction = (status: OrderStatus) => {
    switch (status) {
      case "PENDING":
        return [
          { label: "Accept Order", status: "ACCEPTED" as OrderStatus },
          { label: "Reject", status: "REJECTED" as OrderStatus },
        ];

      case "ACCEPTED":
        return [
          { label: "Start Preparing", status: "PREPARING" as OrderStatus },
        ];

      case "PREPARING":
        return [{ label: "Mark as Ready", status: "READY" as OrderStatus }];

      case "READY":
        return [
          { label: "Complete Order", status: "COMPLETED" as OrderStatus },
        ];

      default:
        return [];
    }
  };

  const pendingCount = countOrders("PENDING");
  const preparingCount = countOrders("PREPARING");
  const completedCount = countOrders("COMPLETED");

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
              Orders
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage and track your business orders.
            </p>
          </div>

          <button
            onClick={() => fetchOrders(true)}
            disabled={loading}
            className="rounded-lg border bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50"
          >
            {loading ? "Refreshing..." : "↻ Refresh Orders"}
          </button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard title="Total Orders" value={orders.length} color="blue" />

          <StatCard
            title="Pending Orders"
            value={pendingCount}
            color="yellow"
          />

          <StatCard
            title="Preparing Orders"
            value={preparingCount}
            color="purple"
          />
        </div>

        {/* Tabs */}
        <div className="overflow-x-auto rounded-xl border bg-white">
          <div className="flex min-w-max gap-1 p-2">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                  activeTab === tab.value
                    ? "bg-black text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {tab.label}

                <span className="ml-2 text-xs opacity-70">
                  {countOrders(tab.value)}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}

            <button
              onClick={() => fetchOrders(true)}
              className="ml-3 font-semibold underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="rounded-xl border bg-white py-20 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-black" />
            <p className="mt-4 text-sm text-gray-500">Loading orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          /* Empty State */
          <div className="rounded-xl border bg-white py-20 text-center">
            <div className="text-5xl">📦</div>

            <h3 className="mt-4 text-lg font-semibold text-gray-900">
              No orders found
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Orders will appear here when customers place them.
            </p>
          </div>
        ) : (
          /* Orders List */
          <div className="space-y-5">
            {filteredOrders.map((order) => {
              const actions = getAction(order.status);
              const isUpdating = updatingId === order.id;

              return (
                <div
                  key={order.id}
                  className="overflow-hidden rounded-xl border bg-white shadow-sm"
                >
                  {/* Order Header */}
                  <div className="flex flex-col justify-between gap-3 border-b p-5 sm:flex-row sm:items-center">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold text-gray-900">
                          {order.tokenNumber}
                        </h3>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[order.status]}`}
                        >
                          {order.status}
                        </span>
                      </div>

                      <p className="mt-1 text-xs text-gray-500">
                        Order #{order.order.orderNumber}
                      </p>
                    </div>

                    <div className="text-left sm:text-right">
                      <p className="text-xs text-gray-500">Order placed</p>

                      <p className="text-sm font-medium text-gray-700">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                  </div>

                  {/* Order Body */}
                  <div className="grid gap-6 p-5 md:grid-cols-2">
                    {/* Customer Information */}
                    <div>
                      <h4 className="mb-3 text-sm font-semibold text-gray-900">
                        Customer Information
                      </h4>

                      <div className="space-y-2 text-sm">
                        <p className="text-gray-700">
                          <span className="text-gray-400">Name:</span>{" "}
                          {order.order.customerName}
                        </p>

                        <p className="text-gray-700">
                          <span className="text-gray-400">Phone:</span>{" "}
                          {order.order.customerPhone}
                        </p>

                        <p className="text-gray-700">
                          <span className="text-gray-400">Payment:</span>{" "}
                          {order.order.paymentMethod}
                        </p>

                        <p className="text-gray-700">
                          <span className="text-gray-400">Payment Status:</span>{" "}
                          {order.order.paymentStatus}
                        </p>
                      </div>
                    </div>

                    {/* Items */}
                    <div>
                      <h4 className="mb-3 text-sm font-semibold text-gray-900">
                        Ordered Items
                      </h4>

                      <div className="space-y-3">
                        {order.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex justify-between gap-3 text-sm"
                          >
                            <div>
                              <p className="font-medium text-gray-800">
                                {item.menuItemName}
                              </p>

                              <p className="text-xs text-gray-500">
                                {item.quantity} × {formatPrice(item.price)}
                              </p>
                            </div>

                            <p className="font-medium text-gray-800">
                              {formatPrice(Number(item.price) * item.quantity)}
                            </p>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 flex justify-between border-t pt-3">
                        <span className="font-semibold text-gray-900">
                          Total
                        </span>

                        <span className="font-bold text-gray-900">
                          {formatPrice(order.totalAmount)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap justify-between gap-3 border-t bg-gray-50 p-5">
                    <div>
                      <p className="text-xs text-gray-500">Order Token</p>

                      <p className="font-semibold text-gray-800">
                        {order.tokenNumber}
                      </p>
                    </div>

                    {actions.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {actions.map((action) => (
                          <button
                            key={action.status}
                            disabled={isUpdating}
                            onClick={() =>
                              updateStatus(order.id, action.status)
                            }
                            className={`rounded-lg px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                              action.status === "REJECTED"
                                ? "border border-red-200 bg-white text-red-600 hover:bg-red-50"
                                : "bg-black text-white hover:bg-gray-800"
                            }`}
                          >
                            {isUpdating ? "Updating..." : action.label}
                          </button>
                        ))}
                      </div>
                    )}

                    {actions.length === 0 && (
                      <span className="self-center text-sm text-gray-400">
                        No further actions
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// Statistics card component
function StatCard({
  title,
  value,
  color,
}: {
  title: string;
  value: number;
  color: "blue" | "yellow" | "purple";
}) {
  const colors = {
    blue: "border-blue-200 bg-blue-50 text-blue-700",
    yellow: "border-yellow-200 bg-yellow-50 text-yellow-700",
    purple: "border-purple-200 bg-purple-50 text-purple-700",
  };

  return (
    <div className={`rounded-xl border p-5 ${colors[color]}`}>
      <p className="text-sm font-medium">{title}</p>

      <p className="mt-2 text-3xl font-bold">{value}</p>
    </div>
  );
}
