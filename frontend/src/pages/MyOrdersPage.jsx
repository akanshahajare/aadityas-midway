import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getMyOrders } from "../services/orderService";

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
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const MyOrdersPage = () => {
  const { user, token, isAuthenticated } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOrders = async () => {
      if (!isAuthenticated || !token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await getMyOrders(token);

        setOrders(response?.data || []);
      } catch (err) {
        console.error("Failed to load orders:", err);
        setError(
          err.message || "Failed to load your orders"
        );
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [token, isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <main className="min-h-[70vh] bg-brand-cream">
        <div className="container-midway flex min-h-[70vh] items-center justify-center py-16">
          <div className="w-full max-w-md rounded-2xl border border-brand-green/10 bg-brand-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-green/10 text-brand-green">
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
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21a8 8 0 0 1 16 0" />
              </svg>
            </div>

            <h1 className="mt-5 font-display text-3xl font-bold text-brand-green-dark">
              Login Required
            </h1>

            <p className="mt-3 text-sm leading-6 text-text-secondary">
              Please login to view your order history.
            </p>

            <Link
              to="/auth"
              state={{ from: "/orders" }}
              className="btn-primary mt-6 inline-flex"
            >
              Login / Register
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-brand-cream">
      <section className="border-b border-brand-green/10 bg-brand-white">
        <div className="container-midway py-12">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-gold-dark">
            Account
          </p>

          <h1 className="mt-2 font-display text-4xl font-bold text-brand-green-dark">
            My Orders
          </h1>

          <p className="mt-2 text-text-secondary">
            Welcome back, {user?.name}.
          </p>
        </div>
      </section>

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
              onClick={() => window.location.reload()}
              className="mt-4 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && orders.length === 0 && (
          <div className="rounded-2xl border border-brand-green/10 bg-brand-white p-10 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-cream text-brand-green">
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
                <path d="M6 3h12v18H6z" />
                <path d="M9 7h6" />
                <path d="M9 11h6" />
                <path d="M9 15h4" />
              </svg>
            </div>

            <h2 className="mt-5 font-display text-2xl font-bold text-brand-green-dark">
              No Orders Yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-text-secondary">
              Your completed and ongoing orders will appear here.
            </p>

            <Link
              to="/menu"
              className="btn-primary mt-6 inline-flex"
            >
              Explore Menu
            </Link>
          </div>
        )}

        {!loading && !error && orders.length > 0 && (
          <div className="space-y-5">
            {orders.map((order) => (
              <Link
                key={order._id}
                to={`/orders/${order._id}`}
                className="block rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2"
              >
                <article className="overflow-hidden rounded-2xl border border-brand-green/10 bg-brand-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                  {/* Order Header */}
                  <div className="flex flex-col gap-4 border-b border-brand-green/10 p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                        Order ID
                      </p>

                      <p className="mt-1 font-mono text-sm font-semibold text-brand-green-dark">
                        #{order._id.slice(-8).toUpperCase()}
                      </p>

                      <p className="mt-1 text-xs text-text-secondary">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="rounded-full border border-brand-green/10 bg-brand-cream px-3 py-1.5 text-xs font-semibold capitalize text-brand-green-dark">
                        {order.orderType}
                      </span>

                      <span
                        className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                          statusStyles[order.status] ||
                          "border-gray-200 bg-gray-50 text-gray-700"
                        }`}
                      >
                        {formatStatus(order.status)}
                      </span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="divide-y divide-brand-green/10 px-5">
                    {order.items.map((item, index) => (
                      <div
                        key={`${order._id}-${item.menuItem}-${index}`}
                        className="flex items-center justify-between gap-4 py-4"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-text-primary">
                            {item.name}
                          </p>

                          <p className="mt-1 text-xs text-text-secondary">
                            ₹{item.price} × {item.quantity}
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
                    ))}
                  </div>

                  {/* Order Footer */}
                  <div className="flex flex-col gap-3 border-t border-brand-green/10 bg-brand-cream/50 p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-sm text-text-secondary">
                      <span className="font-semibold text-text-primary">
                        Payment:
                      </span>{" "}
                      {order.payment?.method === "cash"
                        ? "Cash"
                        : "Online"}
                    </div>

                    <div className="text-right">
                      <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                        Total
                      </p>

                      <p className="mt-1 font-display text-2xl font-bold text-brand-green-dark">
                        ₹{Number(order.pricing?.total || 0).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default MyOrdersPage;