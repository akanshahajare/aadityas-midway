import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { getAllOrders } from "../services/orderService";

const formatCurrency = (amount) =>
  `₹${Number(amount || 0).toLocaleString("en-IN")}`;

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const getStatusLabel = (status) => {
  const labels = {
    received: "Received",
    preparing: "Preparing",
    ready: "Ready",
    served: "Served",
    completed: "Completed",
    cancelled: "Cancelled",
  };

  return labels[status] || status;
};

const getStatusClasses = (status) => {
  const classes = {
    received: "bg-blue-50 text-blue-700",
    preparing: "bg-amber-50 text-amber-700",
    ready: "bg-green-50 text-green-700",
    served: "bg-purple-50 text-purple-700",
    completed: "bg-emerald-50 text-emerald-700",
    cancelled: "bg-red-50 text-red-700",
  };

  return classes[status] || "bg-gray-100 text-gray-700";
};

const AdminDashboardPage = () => {
  const { token } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getAllOrders(token);
        setOrders(response?.data || []);
      } catch (err) {
        console.error("Failed to load dashboard orders:", err);
        setError(err.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      loadOrders();
    }
  }, [token]);

  const stats = useMemo(() => {
    const today = new Date();

    const todaysOrders = orders.filter((order) => {
      const orderDate = new Date(order.createdAt);

      return (
        orderDate.getDate() === today.getDate() &&
        orderDate.getMonth() === today.getMonth() &&
        orderDate.getFullYear() === today.getFullYear()
      );
    });

    const revenue = orders
      .filter((order) => order.status !== "cancelled")
      .reduce(
        (total, order) =>
          total + Number(order.pricing?.total || 0),
        0
      );

    const pendingOrders = orders.filter(
      (order) =>
        ["received", "preparing", "ready"].includes(order.status)
    );

    return {
      totalOrders: orders.length,
      todaysOrders: todaysOrders.length,
      revenue,
      pendingOrders: pendingOrders.length,
    };
  }, [orders]);

  const recentOrders = orders.slice(0, 6);

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-brand-green/20 border-t-brand-green" />
            <p className="mt-4 text-sm text-text-secondary">
              Loading dashboard...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <h2 className="font-display text-xl font-bold text-red-800">
            Unable to load dashboard
          </h2>

          <p className="mt-2 text-sm text-red-700">
            {error}
          </p>

          <Link
            to="/admin/orders"
            className="mt-5 inline-flex rounded-xl bg-brand-green px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-green-dark"
          >
            Open Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Page Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold-dark">
            Overview
          </p>

          <h1 className="mt-1 font-display text-3xl font-bold text-brand-green-dark sm:text-4xl">
            Dashboard
          </h1>

          <p className="mt-2 text-sm text-text-secondary">
            Here's what's happening with your restaurant.
          </p>
        </div>

        <Link
          to="/admin/orders"
          className="inline-flex w-fit items-center gap-2 rounded-xl bg-brand-green px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-green-dark"
        >
          Manage Orders
          <span>→</span>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-brand-green/10 bg-brand-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-text-secondary">
                Total Orders
              </p>

              <p className="mt-2 font-display text-3xl font-bold text-brand-green-dark">
                {stats.totalOrders}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-green/10 text-brand-green">
              📋
            </div>
          </div>

          <p className="mt-4 text-xs text-text-secondary">
            All orders received
          </p>
        </div>

        <div className="rounded-2xl border border-brand-green/10 bg-brand-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-text-secondary">
                Today's Orders
              </p>

              <p className="mt-2 font-display text-3xl font-bold text-brand-green-dark">
                {stats.todaysOrders}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-gold/15 text-brand-gold-dark">
              🗓️
            </div>
          </div>

          <p className="mt-4 text-xs text-text-secondary">
            Orders placed today
          </p>
        </div>

        <div className="rounded-2xl border border-brand-green/10 bg-brand-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-text-secondary">
                Total Revenue
              </p>

              <p className="mt-2 font-display text-3xl font-bold text-brand-green-dark">
                {formatCurrency(stats.revenue)}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              ₹
            </div>
          </div>

          <p className="mt-4 text-xs text-text-secondary">
            Excluding cancelled orders
          </p>
        </div>

        <div className="rounded-2xl border border-brand-green/10 bg-brand-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-text-secondary">
                Pending Orders
              </p>

              <p className="mt-2 font-display text-3xl font-bold text-brand-green-dark">
                {stats.pendingOrders}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
              ⏳
            </div>
          </div>

          <p className="mt-4 text-xs text-text-secondary">
            Received, preparing or ready
          </p>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="mt-6 rounded-2xl border border-brand-green/10 bg-brand-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-brand-green/10 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-xl font-bold text-brand-green-dark">
              Recent Orders
            </h2>

            <p className="mt-1 text-sm text-text-secondary">
              Latest orders placed by customers
            </p>
          </div>

          <Link
            to="/admin/orders"
            className="text-sm font-semibold text-brand-green hover:text-brand-green-dark"
          >
            View all →
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm text-text-secondary">
              No orders have been placed yet.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-brand-green/10">
            {recentOrders.map((order) => (
              <Link
                key={order._id}
                to={`/orders/${order._id}`}
                className="block p-5 transition hover:bg-brand-cream/50"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-brand-green-dark">
                        #{order._id?.slice(-6)?.toUpperCase()}
                      </span>

                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClasses(
                          order.status
                        )}`}
                      >
                        {getStatusLabel(order.status)}
                      </span>
                    </div>

                    <p className="mt-1 text-sm text-text-secondary">
                      {order.customer?.name || "Customer"} •{" "}
                      {order.orderType || "Order"}
                    </p>

                    <p className="mt-1 text-xs text-text-secondary">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-6 lg:justify-end">
                    <div className="text-sm text-text-secondary">
                      {order.items?.length || 0} item
                      {(order.items?.length || 0) !== 1 ? "s" : ""}
                    </div>

                    <div className="text-right">
                      <p className="font-semibold text-brand-green-dark">
                        {formatCurrency(order.pricing?.total)}
                      </p>

                      <p className="mt-1 text-xs capitalize text-text-secondary">
                        {order.payment?.method || "Payment"}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <Link
          to="/admin/orders"
          className="group rounded-2xl border border-brand-green/10 bg-brand-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-green/10 text-brand-green">
            📋
          </div>

          <h3 className="mt-4 font-display text-lg font-bold text-brand-green-dark">
            Manage Orders
          </h3>

          <p className="mt-1 text-sm text-text-secondary">
            View orders and update their status.
          </p>

          <span className="mt-4 inline-block text-sm font-semibold text-brand-green">
            Open orders →
          </span>
        </Link>

        <Link
          to="/admin/menu"
          className="group rounded-2xl border border-brand-green/10 bg-brand-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-gold/15 text-brand-gold-dark">
            🍽️
          </div>

          <h3 className="mt-4 font-display text-lg font-bold text-brand-green-dark">
            Manage Menu
          </h3>

          <p className="mt-1 text-sm text-text-secondary">
            Add, edit and remove restaurant menu items.
          </p>

          <span className="mt-4 inline-block text-sm font-semibold text-brand-green">
            Open menu →
          </span>
        </Link>

        <Link
          to="/admin/customers"
          className="group rounded-2xl border border-brand-green/10 bg-brand-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-green/10 text-brand-green">
            👥
          </div>

          <h3 className="mt-4 font-display text-lg font-bold text-brand-green-dark">
            Customers
          </h3>

          <p className="mt-1 text-sm text-text-secondary">
            View customer activity and accounts.
          </p>

          <span className="mt-4 inline-block text-sm font-semibold text-brand-green">
            View customers →
          </span>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
