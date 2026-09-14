import { useEffect, useMemo, useState } from "react";
import { getAllOrders } from "../services/orderService";
import { useAuth } from "../context/AuthContext";

const FILTERS = [
  { label: "Last 7 days", value: 7 },
  { label: "Last 30 days", value: 30 },
  { label: "All time", value: 0 },
];

const formatCurrency = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const getOrderStatusLabel = (status) => {
  const labels = {
    received: "Received",
    preparing: "Preparing",
    ready: "Ready",
    ready_to_serve: "Ready to Serve",
    served: "Served",
    completed: "Completed",
    cancelled: "Cancelled",
  };

  return labels[status] || status || "Unknown";
};

const getStatusClasses = (status) => {
  const classes = {
    received: "bg-blue-50 text-blue-700",
    preparing: "bg-amber-50 text-amber-700",
    ready: "bg-purple-50 text-purple-700",
    ready_to_serve: "bg-purple-50 text-purple-700",
    served: "bg-green-50 text-green-700",
    completed: "bg-emerald-50 text-emerald-700",
    cancelled: "bg-red-50 text-red-700",
  };

  return classes[status] || "bg-gray-100 text-gray-700";
};

const isCancelled = (order) =>
  String(order?.status || "").toLowerCase() === "cancelled";

const getOrderItems = (order) => {
  if (Array.isArray(order?.items)) {
    return order.items;
  }

  return [];
};

const getItemQuantity = (item) => Number(item?.quantity || 0);

const getItemRevenue = (item) => {
  const price = Number(item?.price || 0);
  const quantity = getItemQuantity(item);

  return price * quantity;
};

const getOrderRevenue = (order) => {
  if (isCancelled(order)) {
    return 0;
  }

  if (order?.pricing?.total !== undefined) {
    return Number(order.pricing.total || 0);
  }

  if (order?.total !== undefined) {
    return Number(order.total || 0);
  }

  return getOrderItems(order).reduce(
    (total, item) => total + getItemRevenue(item),
    0
  );
};

function StatCard({ title, value, subtitle, icon }) {
  return (
    <div className="rounded-2xl border border-[#E8E1D2] bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-[#8A867C]">
            {title}
          </p>

          <p className="mt-2 text-2xl font-bold text-[#173F35]">
            {value}
          </p>

          {subtitle && (
            <p className="mt-1 text-xs text-[#8A867C]">
              {subtitle}
            </p>
          )}
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FAF6EC] text-xl">
          {icon}
        </div>
      </div>
    </div>
  );
}

function AdminAnalyticsPage() {
  const { token } = useAuth();

  const [orders, setOrders] = useState([]);
  const [filterDays, setFilterDays] = useState(30);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAnalytics = async () => {
    if (!token) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await getAllOrders(token);

      const data = Array.isArray(response)
        ? response
        : response?.data || [];

      setOrders(data);
    } catch (err) {
      console.error("Failed to load analytics:", err);

      setError(
        err.message || "Failed to load analytics data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadAnalytics();
    }
  }, [token]);

  const filteredOrders = useMemo(() => {
    if (!filterDays) {
      return orders;
    }

    const cutoff = new Date();

    cutoff.setDate(cutoff.getDate() - filterDays);

    return orders.filter((order) => {
      if (!order?.createdAt) {
        return false;
      }

      return new Date(order.createdAt) >= cutoff;
    });
  }, [orders, filterDays]);

  const analytics = useMemo(() => {
    const validOrders = filteredOrders.filter(
      (order) => !isCancelled(order)
    );

    const revenue = validOrders.reduce(
      (total, order) => total + getOrderRevenue(order),
      0
    );

    const averageOrderValue =
      validOrders.length > 0
        ? revenue / validOrders.length
        : 0;

    const statusCounts = filteredOrders.reduce(
      (result, order) => {
        const status = order?.status || "unknown";

        result[status] = (result[status] || 0) + 1;

        return result;
      },
      {}
    );

    const orderTypeCounts = filteredOrders.reduce(
      (result, order) => {
        const type = order?.orderType || "Unknown";

        result[type] = (result[type] || 0) + 1;

        return result;
      },
      {}
    );

    const itemMap = {};

    validOrders.forEach((order) => {
      getOrderItems(order).forEach((item) => {
        const name = item?.name || "Unknown item";
        const quantity = getItemQuantity(item);
        const itemRevenue = getItemRevenue(item);

        if (!itemMap[name]) {
          itemMap[name] = {
            name,
            quantity: 0,
            revenue: 0,
          };
        }

        itemMap[name].quantity += quantity;
        itemMap[name].revenue += itemRevenue;
      });
    });

    const topItems = Object.values(itemMap)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    const dailyMap = {};

    validOrders.forEach((order) => {
      if (!order?.createdAt) {
        return;
      }

      const dateKey = new Date(order.createdAt)
        .toISOString()
        .split("T")[0];

      if (!dailyMap[dateKey]) {
        dailyMap[dateKey] = {
          date: dateKey,
          orders: 0,
          revenue: 0,
        };
      }

      dailyMap[dateKey].orders += 1;
      dailyMap[dateKey].revenue += getOrderRevenue(order);
    });

    const dailyRevenue = Object.values(dailyMap)
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-7);

    return {
      totalOrders: filteredOrders.length,
      completedBusinessOrders: validOrders.length,
      cancelledOrders:
        filteredOrders.length - validOrders.length,
      revenue,
      averageOrderValue,
      statusCounts,
      orderTypeCounts,
      topItems,
      dailyRevenue,
    };
  }, [filteredOrders]);

  if (loading) {
    return (
      <div className="flex min-h-full items-center justify-center p-8">
        <div className="text-sm text-[#625F56]">
          Loading analytics...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 lg:p-8">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <h2 className="text-lg font-semibold text-red-800">
            Unable to load analytics
          </h2>

          <p className="mt-2 text-sm text-red-700">
            {error}
          </p>

          <button
            onClick={loadAnalytics}
            className="mt-4 rounded-lg bg-[#173F35] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0F2D26]"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const maxDailyRevenue = Math.max(
    ...analytics.dailyRevenue.map(
      (item) => item.revenue
    ),
    1
  );

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#173F35]">
            Analytics
          </h1>

          <p className="mt-1 text-sm text-[#625F56]">
            Track restaurant performance and order trends.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {FILTERS.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setFilterDays(filter.value)}
              className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${
                filterDays === filter.value
                  ? "border-[#173F35] bg-[#173F35] text-white"
                  : "border-[#D8CFBD] bg-white text-[#625F56] hover:bg-[#FAF6EC]"
              }`}
            >
              {filter.label}
            </button>
          ))}

          <button
            onClick={loadAnalytics}
            className="rounded-lg border border-[#D8CFBD] bg-white px-4 py-2 text-sm font-medium text-[#173F35] hover:bg-[#FAF6EC]"
          >
            ↻ Refresh
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Orders"
          value={analytics.totalOrders}
          subtitle={`${analytics.cancelledOrders} cancelled`}
          icon="🧾"
        />

        <StatCard
          title="Revenue"
          value={formatCurrency(analytics.revenue)}
          subtitle="Excluding cancelled orders"
          icon="₹"
        />

        <StatCard
          title="Average Order"
          value={formatCurrency(
            analytics.averageOrderValue
          )}
          subtitle="Average completed order value"
          icon="📊"
        />

        <StatCard
          title="Active Business Orders"
          value={analytics.completedBusinessOrders}
          subtitle="Orders contributing to revenue"
          icon="🍽️"
        />
      </div>

      {/* Main analytics grid */}
      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        {/* Revenue chart */}
        <div className="rounded-2xl border border-[#E8E1D2] bg-white p-6 shadow-sm xl:col-span-2">
          <div>
            <h2 className="font-serif text-xl font-bold text-[#173F35]">
              Revenue Trend
            </h2>

            <p className="mt-1 text-sm text-[#8A867C]">
              Revenue across the latest active days.
            </p>
          </div>

          {analytics.dailyRevenue.length === 0 ? (
            <div className="flex h-64 items-center justify-center text-sm text-[#8A867C]">
              No revenue data available for this period.
            </div>
          ) : (
            <div className="mt-8 flex h-64 items-end gap-3 overflow-x-auto">
              {analytics.dailyRevenue.map((item) => {
                const height =
                  (item.revenue / maxDailyRevenue) * 100;

                return (
                  <div
                    key={item.date}
                    className="flex min-w-[60px] flex-1 flex-col items-center justify-end gap-2"
                  >
                    <span className="text-xs font-medium text-[#625F56]">
                      {formatCurrency(item.revenue)}
                    </span>

                    <div className="flex h-40 w-full items-end justify-center">
                      <div
                        className="w-full max-w-[44px] rounded-t-lg bg-[#D4A72C] transition-all"
                        style={{
                          height: `${Math.max(
                            height,
                            4
                          )}%`,
                        }}
                        title={`${formatCurrency(
                          item.revenue
                        )} revenue`}
                      />
                    </div>

                    <span className="text-[11px] text-[#8A867C]">
                      {new Date(
                        item.date
                      ).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                      })}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Order status */}
        <div className="rounded-2xl border border-[#E8E1D2] bg-white p-6 shadow-sm">
          <h2 className="font-serif text-xl font-bold text-[#173F35]">
            Order Status
          </h2>

          <p className="mt-1 text-sm text-[#8A867C]">
            Current order distribution.
          </p>

          <div className="mt-6 space-y-3">
            {Object.keys(analytics.statusCounts).length ===
            0 ? (
              <p className="text-sm text-[#8A867C]">
                No order data available.
              </p>
            ) : (
              Object.entries(analytics.statusCounts)
                .sort(([, a], [, b]) => b - a)
                .map(([status, count]) => (
                  <div
                    key={status}
                    className="flex items-center justify-between rounded-xl border border-[#E8E1D2] p-3"
                  >
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(
                        status
                      )}`}
                    >
                      {getOrderStatusLabel(status)}
                    </span>

                    <span className="font-semibold text-[#173F35]">
                      {count}
                    </span>
                  </div>
                ))
            )}
          </div>
        </div>
      </div>

      {/* Bottom analytics */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Top items */}
        <div className="rounded-2xl border border-[#E8E1D2] bg-white p-6 shadow-sm">
          <h2 className="font-serif text-xl font-bold text-[#173F35]">
            Top Selling Items
          </h2>

          <p className="mt-1 text-sm text-[#8A867C]">
            Items ordered most frequently.
          </p>

          <div className="mt-6">
            {analytics.topItems.length === 0 ? (
              <p className="text-sm text-[#8A867C]">
                No item data available.
              </p>
            ) : (
              <div className="space-y-4">
                {analytics.topItems.map((item, index) => (
                  <div
                    key={item.name}
                    className="flex items-center gap-4"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FAF6EC] text-sm font-bold text-[#173F35]">
                      {index + 1}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <p className="truncate text-sm font-semibold text-[#24231F]">
                          {item.name}
                        </p>

                        <span className="shrink-0 text-sm font-semibold text-[#173F35]">
                          {item.quantity}
                        </span>
                      </div>

                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#F1EBDD]">
                        <div
                          className="h-full rounded-full bg-[#D4A72C]"
                          style={{
                            width: `${
                              (item.quantity /
                                analytics.topItems[0]
                                  .quantity) *
                              100
                            }%`,
                          }}
                        />
                      </div>

                      <p className="mt-1 text-xs text-[#8A867C]">
                        {formatCurrency(item.revenue)} revenue
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Order type */}
        <div className="rounded-2xl border border-[#E8E1D2] bg-white p-6 shadow-sm">
          <h2 className="font-serif text-xl font-bold text-[#173F35]">
            Order Types
          </h2>

          <p className="mt-1 text-sm text-[#8A867C]">
            Breakdown by order type.
          </p>

          <div className="mt-6 space-y-4">
            {Object.keys(analytics.orderTypeCounts).length ===
            0 ? (
              <p className="text-sm text-[#8A867C]">
                No order type data available.
              </p>
            ) : (
              Object.entries(analytics.orderTypeCounts)
                .sort(([, a], [, b]) => b - a)
                .map(([type, count]) => {
                  const percentage =
                    analytics.totalOrders > 0
                      ? (count /
                          analytics.totalOrders) *
                        100
                      : 0;

                  return (
                    <div key={type}>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium capitalize text-[#24231F]">
                          {String(type).replace(
                            /_/g,
                            " "
                          )}
                        </span>

                        <span className="text-sm font-semibold text-[#173F35]">
                          {count} (
                          {percentage.toFixed(0)}
                          %)
                        </span>
                      </div>

                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#F1EBDD]">
                        <div
                          className="h-full rounded-full bg-[#173F35]"
                          style={{
                            width: `${percentage}%`,
                          }}
                        />
                      </div>
                    </div>
                  );
                })
            )}
          </div>
        </div>
      </div>

      {/* Recent orders */}
      <div className="mt-6 rounded-2xl border border-[#E8E1D2] bg-white p-6 shadow-sm">
        <div>
          <h2 className="font-serif text-xl font-bold text-[#173F35]">
            Recent Orders
          </h2>

          <p className="mt-1 text-sm text-[#8A867C]">
            Latest orders included in this period.
          </p>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-[#E8E1D2] text-left">
                <th className="pb-3 text-xs font-semibold uppercase tracking-wide text-[#8A867C]">
                  Order
                </th>

                <th className="pb-3 text-xs font-semibold uppercase tracking-wide text-[#8A867C]">
                  Customer
                </th>

                <th className="pb-3 text-xs font-semibold uppercase tracking-wide text-[#8A867C]">
                  Date
                </th>

                <th className="pb-3 text-xs font-semibold uppercase tracking-wide text-[#8A867C]">
                  Status
                </th>

                <th className="pb-3 text-right text-xs font-semibold uppercase tracking-wide text-[#8A867C]">
                  Total
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredOrders
                .slice(0, 8)
                .map((order) => (
                  <tr
                    key={order._id}
                    className="border-b border-[#F1EBDD] last:border-0"
                  >
                    <td className="py-4 text-sm font-semibold text-[#173F35]">
                      #
                      {String(order._id || "")
                        .slice(-6)
                        .toUpperCase()}
                    </td>

                    <td className="py-4 text-sm text-[#625F56]">
                      {order?.customer?.name ||
                        order?.user?.name ||
                        "Guest"}
                    </td>

                    <td className="py-4 text-sm text-[#625F56]">
                      {order.createdAt
                        ? formatDate(order.createdAt)
                        : "—"}
                    </td>

                    <td className="py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(
                          order.status
                        )}`}
                      >
                        {getOrderStatusLabel(
                          order.status
                        )}
                      </span>
                    </td>

                    <td className="py-4 text-right text-sm font-semibold text-[#173F35]">
                      {formatCurrency(
                        getOrderRevenue(order)
                      )}
                    </td>
                  </tr>
                ))}

              {filteredOrders.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    className="py-10 text-center text-sm text-[#8A867C]"
                  >
                    No orders found for this period.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminAnalyticsPage;