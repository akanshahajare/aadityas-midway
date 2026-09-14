import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { getAdminUsers } from "../services/userService";
import { getOrdersByUserId } from "../services/orderService";

const formatDate = (date) => {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatDateTime = (date) => {
  if (!date) return "—";

  return new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatCurrency = (amount) => {
  return `₹${Number(amount || 0).toFixed(2)}`;
};

const getInitials = (name = "") => {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
};

const formatStatus = (status = "") => {
  return status
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

const getStatusClasses = (status) => {
  switch (status) {
    case "received":
      return "bg-blue-50 text-blue-700";

    case "preparing":
      return "bg-amber-50 text-amber-700";

    case "ready_to_serve":
      return "bg-purple-50 text-purple-700";

    case "served":
      return "bg-green-50 text-green-700";

    case "completed":
      return "bg-emerald-50 text-emerald-700";

    case "cancelled":
      return "bg-red-50 text-red-700";

    default:
      return "bg-gray-100 text-gray-700";
  }
};

const AdminCustomersPage = () => {
  const { user, token } = useAuth();

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedUser, setSelectedUser] = useState(null);
  const [userOrders, setUserOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState("");

  useEffect(() => {
    const loadUsers = async () => {
      if (!token) {
        setError("Authentication required.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await getAdminUsers(token);
        setUsers(response.data || []);
      } catch (err) {
        console.error("Failed to load users:", err);
        setError("Unable to load users. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [token]);

  const filteredUsers = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return users.filter((item) => {
      const matchesSearch =
        !searchValue ||
        item.name?.toLowerCase().includes(searchValue) ||
        item.email?.toLowerCase().includes(searchValue);

      const matchesRole =
        roleFilter === "all" ||
        item.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  const customerCount = users.filter(
    (item) => item.role === "customer"
  ).length;

  const adminCount = users.filter(
    (item) => item.role === "admin"
  ).length;

  const openUserOrders = async (selectedUserData) => {
    setSelectedUser(selectedUserData);
    setUserOrders([]);
    setOrdersError("");

    if (!token) {
      setOrdersError("Authentication required.");
      return;
    }

    try {
      setOrdersLoading(true);

      const response = await getOrdersByUserId(
        selectedUserData._id,
        token
      );

      setUserOrders(response.data || []);
    } catch (err) {
      console.error("Failed to load user orders:", err);
      setOrdersError(
        "Unable to load this user's orders."
      );
    } finally {
      setOrdersLoading(false);
    }
  };

  const closeUserOrders = () => {
    setSelectedUser(null);
    setUserOrders([]);
    setOrdersError("");
  };

  return (
    <div className="min-h-full bg-brand-cream px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="mb-1 text-sm font-semibold uppercase tracking-[0.18em] text-brand-gold">
            User Management
          </p>

          <h1 className="font-display text-3xl font-bold text-brand-charcoal">
            Customers
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-brand-text-secondary">
            View registered users and their order history.
          </p>
        </div>

        <Link
          to="/admin"
          className="inline-flex w-fit items-center rounded-xl bg-brand-green px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-green-dark"
        >
          ← Dashboard
        </Link>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-sm text-brand-text-secondary">
            Total Users
          </p>

          <p className="mt-2 text-3xl font-bold text-brand-charcoal">
            {users.length}
          </p>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-sm text-brand-text-secondary">
            Customers
          </p>

          <p className="mt-2 text-3xl font-bold text-brand-green">
            {customerCount}
          </p>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-sm text-brand-text-secondary">
            Administrators
          </p>

          <p className="mt-2 text-3xl font-bold text-brand-gold-dark">
            {adminCount}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 rounded-2xl bg-white p-5 shadow-sm">
        <div className="grid gap-4 md:grid-cols-[1fr_220px]">
          <div>
            <label className="mb-2 block text-sm font-semibold text-brand-charcoal">
              Search users
            </label>

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search by name or email..."
              className="w-full rounded-xl bg-brand-cream px-4 py-3 text-sm text-brand-charcoal outline-none transition placeholder:text-brand-muted focus:ring-2 focus:ring-brand-gold"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-brand-charcoal">
              Role
            </label>

            <select
              value={roleFilter}
              onChange={(event) =>
                setRoleFilter(event.target.value)
              }
              className="w-full rounded-xl bg-brand-cream px-4 py-3 text-sm text-brand-charcoal outline-none transition focus:ring-2 focus:ring-brand-gold"
            >
              <option value="all">All Users</option>
              <option value="customer">Customers</option>
              <option value="admin">Administrators</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users table */}
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
        {loading ? (
          <div className="flex min-h-64 items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-brand-green/20 border-t-brand-green" />

              <p className="text-sm text-brand-text-secondary">
                Loading users...
              </p>
            </div>
          </div>
        ) : error ? (
          <div className="flex min-h-64 items-center justify-center px-6 text-center">
            <div>
              <p className="mb-2 text-lg font-semibold text-brand-charcoal">
                Unable to load users
              </p>

              <p className="text-sm text-brand-text-secondary">
                {error}
              </p>
            </div>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="flex min-h-64 items-center justify-center px-6 text-center">
            <div>
              <p className="mb-2 text-lg font-semibold text-brand-charcoal">
                No users found
              </p>

              <p className="text-sm text-brand-text-secondary">
                Try changing your search or role filter.
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left">
              <thead className="bg-brand-green text-white">
                <tr>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider">
                    User
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider">
                    Email
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider">
                    Role
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider">
                    Registered
                  </th>

                  <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map((item) => {
                  const isCurrentUser =
                    item._id === user?._id;

                  return (
                    <tr
                      key={item._id}
                      className="cursor-pointer transition hover:bg-brand-cream/50"
                      onClick={() => openUserOrders(item)}
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-green text-sm font-bold text-white">
                            {getInitials(item.name)}
                          </div>

                          <div>
                            <p className="font-semibold text-brand-charcoal">
                              {item.name}

                              {isCurrentUser && (
                                <span className="ml-2 text-xs font-medium text-brand-gold-dark">
                                  You
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-sm text-brand-text-secondary">
                        {item.email}
                      </td>

                      <td className="px-5 py-4">
                        {item.role === "admin" ? (
                          <span className="inline-flex rounded-full bg-brand-gold/15 px-3 py-1 text-xs font-semibold text-brand-gold-dark">
                            Administrator
                          </span>
                        ) : (
                          <span className="inline-flex rounded-full bg-brand-green/10 px-3 py-1 text-xs font-semibold text-brand-green">
                            Customer
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-4 text-sm text-brand-text-secondary">
                        {formatDate(item.createdAt)}
                      </td>

                      <td className="px-5 py-4 text-right">
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            openUserOrders(item);
                          }}
                          className="rounded-lg bg-brand-green px-3 py-2 text-xs font-semibold text-white transition hover:bg-brand-green-dark"
                        >
                          View Orders
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Orders modal */}
      {selectedUser && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={closeUserOrders}
        >
          <div
            className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex shrink-0 items-center justify-between bg-brand-green px-6 py-5 text-white">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-brand-gold-light">
                  Order History
                </p>

                <h2 className="mt-1 text-xl font-bold">
                  {selectedUser.name}
                </h2>

                <p className="mt-1 text-sm text-white/75">
                  {selectedUser.email}
                </p>
              </div>

              <button
                type="button"
                onClick={closeUserOrders}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-xl transition hover:bg-white/20"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            {/* Modal content */}
            <div className="min-h-0 flex-1 overflow-y-auto bg-brand-cream p-6">
              {ordersLoading ? (
                <div className="flex min-h-48 items-center justify-center">
                  <div className="text-center">
                    <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-brand-green/20 border-t-brand-green" />

                    <p className="text-sm text-brand-text-secondary">
                      Loading orders...
                    </p>
                  </div>
                </div>
              ) : ordersError ? (
                <div className="flex min-h-48 items-center justify-center text-center">
                  <div>
                    <p className="mb-2 font-semibold text-brand-charcoal">
                      Unable to load orders
                    </p>

                    <p className="text-sm text-brand-text-secondary">
                      {ordersError}
                    </p>
                  </div>
                </div>
              ) : userOrders.length === 0 ? (
                <div className="flex min-h-48 items-center justify-center text-center">
                  <div>
                    <p className="mb-2 text-lg font-semibold text-brand-charcoal">
                      No orders yet
                    </p>

                    <p className="text-sm text-brand-text-secondary">
                      This user has not placed any orders.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Summary */}
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="rounded-2xl bg-white p-4 shadow-sm">
                      <p className="text-xs font-medium text-brand-text-secondary">
                        Total Orders
                      </p>

                      <p className="mt-1 text-2xl font-bold text-brand-charcoal">
                        {userOrders.length}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-white p-4 shadow-sm">
                      <p className="text-xs font-medium text-brand-text-secondary">
                        Total Spent
                      </p>

                      <p className="mt-1 text-2xl font-bold text-brand-green">
                        {formatCurrency(
                          userOrders
                            .filter(
                              (order) =>
                                order.status !== "cancelled"
                            )
                            .reduce(
                              (total, order) =>
                                total +
                                Number(
                                  order.pricing?.total || 0
                                ),
                              0
                            )
                        )}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-white p-4 shadow-sm">
                      <p className="text-xs font-medium text-brand-text-secondary">
                        Latest Order
                      </p>

                      <p className="mt-1 text-sm font-bold text-brand-charcoal">
                        {formatDate(
                          userOrders[0]?.createdAt
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Orders */}
                  {userOrders.map((order) => (
                    <div
                      key={order._id}
                      className="rounded-2xl bg-white p-5 shadow-sm"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="text-xs font-medium text-brand-text-secondary">
                            Order #{order._id.slice(-8).toUpperCase()}
                          </p>

                          <p className="mt-1 text-sm font-semibold text-brand-charcoal">
                            {formatDateTime(order.createdAt)}
                          </p>
                        </div>

                        <span
                          className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(
                            order.status
                          )}`}
                        >
                          {formatStatus(order.status)}
                        </span>
                      </div>

                      <div className="mt-4 grid gap-4 sm:grid-cols-3">
                        <div>
                          <p className="text-xs text-brand-text-secondary">
                            Order Type
                          </p>

                          <p className="mt-1 text-sm font-semibold text-brand-charcoal">
                            {order.orderType || "—"}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-brand-text-secondary">
                            Table
                          </p>

                          <p className="mt-1 text-sm font-semibold text-brand-charcoal">
                            {order.tableNumber || "—"}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-brand-text-secondary">
                            Payment
                          </p>

                          <p className="mt-1 text-sm font-semibold text-brand-charcoal">
                            {order.payment?.method || "—"}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 space-y-2">
                        {order.items?.map((item, index) => (
                          <div
                            key={`${order._id}-${index}`}
                            className="flex items-center justify-between rounded-xl bg-brand-cream px-3 py-2"
                          >
                            <div>
                              <p className="text-sm font-medium text-brand-charcoal">
                                {item.name}
                              </p>

                              <p className="text-xs text-brand-text-secondary">
                                Qty: {item.quantity}
                              </p>
                            </div>

                            <p className="text-sm font-semibold text-brand-charcoal">
                              {formatCurrency(
                                Number(item.price || 0) *
                                  Number(item.quantity || 0)
                              )}
                            </p>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 flex items-center justify-between pt-3">
                        <span className="text-sm font-medium text-brand-text-secondary">
                          Total
                        </span>

                        <span className="text-lg font-bold text-brand-green">
                          {formatCurrency(
                            order.pricing?.total
                          )}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal footer */}
            <div className="flex shrink-0 justify-end bg-white px-6 py-4">
              <button
                type="button"
                onClick={closeUserOrders}
                className="rounded-xl bg-brand-green px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-green-dark"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCustomersPage;