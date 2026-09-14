import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import {
  getAllOrders,
  updateOrderStatus,
} from "../services/orderService";

const statusOptions = [
  "received",
  "preparing",
  "ready",
  "served",
  "completed",
  "cancelled",
];

const statusStyles = {
  received:
    "bg-blue-50 text-blue-700 border-blue-200",
  preparing:
    "bg-yellow-50 text-yellow-700 border-yellow-200",
  ready:
    "bg-green-50 text-green-700 border-green-200",
  served:
    "bg-purple-50 text-purple-700 border-purple-200",
  completed:
    "bg-emerald-50 text-emerald-700 border-emerald-200",
  cancelled:
    "bg-red-50 text-red-700 border-red-200",
};

const formatStatus = (status) => {
  if (!status) return "Unknown";

  return status
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

const formatDate = (date) => {
  return new Date(date).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const AdminOrdersPage = () => {
  const { token, user, isAuthenticated } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  const loadOrders = async () => {
    if (!token || !isAuthenticated) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await getAllOrders(token);

      setOrders(response?.data || []);
    } catch (err) {
      console.error("Failed to load admin orders:", err);

      setError(
        err.message || "Failed to load orders"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [token, isAuthenticated]);

  const handleStatusChange = async (
    orderId,
    newStatus
  ) => {
    try {
      setUpdatingOrderId(orderId);

      const response = await updateOrderStatus(
        orderId,
        newStatus,
        token
      );

      const updatedOrder = response?.data;

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order._id === orderId
            ? updatedOrder || {
                ...order,
                status: newStatus,
              }
            : order
        )
      );
    } catch (err) {
      console.error(
        "Failed to update order status:",
        err
      );

      alert(
        err.message ||
          "Failed to update order status"
      );
    } finally {
      setUpdatingOrderId(null);
    }
  };

  if (!isAuthenticated) {
    return (
      <main className="min-h-[70vh] bg-brand-cream px-4 py-16">
        <div className="mx-auto max-w-xl rounded-3xl bg-white p-8 text-center shadow-sm">
          <h1 className="font-display text-3xl font-bold text-brand-green-dark">
            Admin Login Required
          </h1>

          <p className="mt-3 text-text-secondary">
            Please login with an administrator account
            to access this page.
          </p>

          <Link
            to="/auth"
            className="btn-primary mt-6 inline-flex"
          >
            Login
          </Link>
        </div>
      </main>
    );
  }

  if (user?.role !== "admin") {
    return (
      <main className="min-h-[70vh] bg-brand-cream px-4 py-16">
        <div className="mx-auto max-w-xl rounded-3xl bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-600">
            <svg
              width="30"
              height="30"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M12 8v4" />
              <path d="M12 16h.01" />
            </svg>
          </div>

          <h1 className="mt-5 font-display text-3xl font-bold text-brand-green-dark">
            Access Denied
          </h1>

          <p className="mt-3 text-text-secondary">
            You do not have permission to access the
            admin dashboard.
          </p>

          <Link
            to="/"
            className="mt-6 inline-flex rounded-lg bg-brand-green px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-green-dark"
          >
            Back to Home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-brand-cream">
      {/* Header */}
      <section className="border-b border-brand-green/10 bg-brand-white">
        <div className="container-midway py-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-gold-dark">
            Administration
          </p>

          <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="font-display text-4xl font-bold text-brand-green-dark">
                Order Management
              </h1>

              <p className="mt-2 text-text-secondary">
                View and manage all customer orders.
              </p>
            </div>

            <button
              type="button"
              onClick={loadOrders}
              disabled={loading}
              className="inline-flex items-center justify-center rounded-lg border border-brand-green/20 bg-white px-5 py-2.5 text-sm font-semibold text-brand-green-dark transition hover:bg-brand-cream disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Refreshing..." : "Refresh Orders"}
            </button>
          </div>
        </div>
      </section>

      {/* Orders */}
      <section className="container-midway py-10">
        {loading && (
          <div className="flex justify-center py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-green/20 border-t-brand-green" />
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
            <p className="font-semibold text-red-700">
              Unable to load orders
            </p>

            <p className="mt-2 text-sm text-red-600">
              {error}
            </p>

            <button
              type="button"
              onClick={loadOrders}
              className="mt-4 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading &&
          !error &&
          orders.length === 0 && (
            <div className="rounded-2xl border border-brand-green/10 bg-brand-white p-10 text-center shadow-sm">
              <h2 className="font-display text-2xl font-bold text-brand-green-dark">
                No Orders Yet
              </h2>

              <p className="mt-2 text-sm text-text-secondary">
                Customer orders will appear here.
              </p>
            </div>
          )}

        {!loading &&
          !error &&
          orders.length > 0 && (
            <div className="space-y-5">
              {orders.map((order) => (
                <article
                  key={order._id}
                  className="overflow-hidden rounded-2xl border border-brand-green/10 bg-brand-white shadow-sm"
                >
                  {/* Header */}
                  <div className="flex flex-col gap-4 border-b border-brand-green/10 p-5 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                        Order ID
                      </p>

                      <p className="mt-1 font-mono text-sm font-bold text-brand-green-dark">
                        #{order._id
                          .slice(-8)
                          .toUpperCase()}
                      </p>

                      <p className="mt-1 text-xs text-text-secondary">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                      <span className="rounded-full border border-brand-green/10 bg-brand-cream px-3 py-1.5 text-xs font-semibold capitalize text-brand-green-dark">
                        {order.orderType?.replace(
                          "-",
                          " "
                        )}
                      </span>

                      <select
                        value={order.status}
                        disabled={
                          updatingOrderId ===
                          order._id
                        }
                        onChange={(event) =>
                          handleStatusChange(
                            order._id,
                            event.target.value
                          )
                        }
                        className={`rounded-full border px-3 py-1.5 text-xs font-semibold outline-none ${
                          statusStyles[
                            order.status
                          ] ||
                          "border-gray-200 bg-gray-50 text-gray-700"
                        }`}
                      >
                        {statusOptions.map(
                          (status) => (
                            <option
                              key={status}
                              value={status}
                            >
                              {formatStatus(status)}
                            </option>
                          )
                        )}
                      </select>
                    </div>
                  </div>

                  {/* Customer */}
                  <div className="grid gap-4 border-b border-brand-green/10 bg-brand-cream/40 p-5 sm:grid-cols-2 lg:grid-cols-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                        Customer
                      </p>

                      <p className="mt-1 text-sm font-semibold text-brand-charcoal">
                        {order.customer?.name ||
                          "N/A"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                        Phone
                      </p>

                      <p className="mt-1 text-sm font-semibold text-brand-charcoal">
                        {order.customer?.phone ||
                          "N/A"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                        Email
                      </p>

                      <p className="mt-1 break-all text-sm font-semibold text-brand-charcoal">
                        {order.customer?.email ||
                          "N/A"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                        Table
                      </p>

                      <p className="mt-1 text-sm font-semibold text-brand-charcoal">
                        {order.tableNumber ||
                          "N/A"}
                      </p>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="divide-y divide-brand-green/10 px-5">
                    {order.items?.map(
                      (item, index) => (
                        <div
                          key={`${order._id}-${item.menuItem}-${index}`}
                          className="flex items-center justify-between gap-4 py-4"
                        >
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-brand-charcoal">
                              {item.name}
                            </p>

                            <p className="mt-1 text-xs text-text-secondary">
                              ₹{item.price} ×{" "}
                              {item.quantity}
                            </p>
                          </div>

                          <p className="shrink-0 text-sm font-bold text-brand-green-dark">
                            ₹
                            {(
                              Number(item.price) *
                              Number(item.quantity)
                            ).toFixed(2)}
                          </p>
                        </div>
                      )
                    )}
                  </div>

                  {/* Footer */}
                  <div className="flex flex-col gap-4 border-t border-brand-green/10 bg-brand-cream/50 p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-sm text-text-secondary">
                      <span className="font-semibold text-brand-charcoal">
                        Payment:
                      </span>{" "}
                      {order.payment?.method ===
                      "cash"
                        ? "Cash"
                        : "Online"}

                      <span className="mx-2">
                        •
                      </span>

                      <span
                        className={`font-semibold capitalize ${
                          order.payment?.status ===
                          "paid"
                            ? "text-green-700"
                            : "text-yellow-700"
                        }`}
                      >
                        {order.payment?.status ||
                          "pending"}
                      </span>
                    </div>

                    <div className="text-left sm:text-right">
                      <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                        Total
                      </p>

                      <p className="mt-1 font-display text-2xl font-bold text-brand-green-dark">
                        ₹
                        {Number(
                          order.pricing?.total || 0
                        ).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
      </section>
    </main>
  );
};

export default AdminOrdersPage;