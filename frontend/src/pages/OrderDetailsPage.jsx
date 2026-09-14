import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { getOrderById } from "../services/orderService";

const statusSteps = [
  {
    key: "received",
    label: "Order Received",
    description: "We've received your order.",
  },
  {
    key: "preparing",
    label: "Preparing",
    description: "Your food is being prepared.",
  },
  {
    key: "ready",
    label: "Ready",
    description: "Your order is ready to serve.",
  },
  {
    key: "served",
    label: "Served",
    description: "Enjoy your meal!",
  },
  {
    key: "completed",
    label: "Completed",
    description: "Order completed successfully.",
  },
];

const getStatusIndex = (status) => {
  const index = statusSteps.findIndex(
    (step) => step.key === status
  );

  return index === -1 ? 0 : index;
};

const formatDate = (date) => {
  return new Date(date).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const OrderDetailsPage = () => {
  const { orderId } = useParams();
  const { token, isAuthenticated } = useAuth();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOrder = async () => {
      if (!token || !isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await getOrderById(orderId, token);

        setOrder(response.data);
      } catch (err) {
        console.error("Failed to load order:", err);
        setError(err.message || "Failed to load order");
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [orderId, token, isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <main className="min-h-[70vh] bg-brand-cream px-4 py-16">
        <div className="mx-auto max-w-xl rounded-3xl bg-white p-8 text-center shadow-sm">
          <h1 className="font-serif text-3xl font-bold text-brand-green-dark">
            Login Required
          </h1>

          <p className="mt-3 text-brand-text-secondary">
            Please login to view your order details.
          </p>

          <Link
            to="/auth"
            className="mt-6 inline-flex rounded-full bg-brand-green px-6 py-3 font-semibold text-white transition hover:bg-brand-green-dark"
          >
            Login / Register
          </Link>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="min-h-[70vh] bg-brand-cream px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-brand-text-secondary">
            Loading your order...
          </p>
        </div>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="min-h-[70vh] bg-brand-cream px-4 py-16">
        <div className="mx-auto max-w-xl rounded-3xl bg-white p-8 text-center shadow-sm">
          <h1 className="font-serif text-3xl font-bold text-brand-green-dark">
            Order Not Found
          </h1>

          <p className="mt-3 text-brand-text-secondary">
            {error || "We couldn't find this order."}
          </p>

          <Link
            to="/orders"
            className="mt-6 inline-flex rounded-full bg-brand-green px-6 py-3 font-semibold text-white transition hover:bg-brand-green-dark"
          >
            Back to My Orders
          </Link>
        </div>
      </main>
    );
  }

  const currentStatusIndex = getStatusIndex(order.status);

  return (
    <main className="min-h-[70vh] bg-brand-cream px-4 py-10 sm:py-14">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/orders"
            className="text-sm font-semibold text-brand-green hover:text-brand-green-dark"
          >
            ← Back to My Orders
          </Link>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-brand-gold-dark">
                Order Details
              </p>

              <h1 className="mt-1 font-serif text-3xl font-bold text-brand-green-dark sm:text-4xl">
                #{order._id.slice(-8).toUpperCase()}
              </h1>

              <p className="mt-2 text-sm text-brand-text-secondary">
                Placed on {formatDate(order.createdAt)}
              </p>
            </div>

            <span className="w-fit rounded-full bg-brand-green px-4 py-2 text-sm font-semibold capitalize text-white">
              {order.status}
            </span>
          </div>
        </div>

        {/* Tracking */}
        <section className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
          <h2 className="font-serif text-2xl font-bold text-brand-green-dark">
            Track Your Order
          </h2>

          <div className="mt-8 space-y-6">
            {statusSteps.map((step, index) => {
              const isCompleted = index <= currentStatusIndex;
              const isCurrent = index === currentStatusIndex;

              return (
                <div
                  key={step.key}
                  className="flex items-start gap-4"
                >
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-bold ${
                        isCompleted
                          ? "border-brand-green bg-brand-green text-white"
                          : "border-brand-border bg-white text-brand-muted"
                      }`}
                    >
                      {isCompleted ? "✓" : index + 1}
                    </div>

                    {index < statusSteps.length - 1 && (
                      <div
                        className={`mt-1 h-10 w-0.5 ${
                          index < currentStatusIndex
                            ? "bg-brand-green"
                            : "bg-brand-border"
                        }`}
                      />
                    )}
                  </div>

                  <div className="pt-1">
                    <h3
                      className={`font-semibold ${
                        isCurrent
                          ? "text-brand-green-dark"
                          : "text-brand-charcoal"
                      }`}
                    >
                      {step.label}
                    </h3>

                    <p className="mt-1 text-sm text-brand-text-secondary">
                      {step.description}
                    </p>

                    {isCurrent && (
                      <span className="mt-2 inline-block text-xs font-semibold uppercase tracking-wide text-brand-gold-dark">
                        Current status
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Order Items */}
        <section className="mt-6 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
          <h2 className="font-serif text-2xl font-bold text-brand-green-dark">
            Your Items
          </h2>

          <div className="mt-6 divide-y divide-brand-border">
            {order.items.map((item) => (
              <div
                key={item.menuItem}
                className="flex items-center justify-between gap-4 py-4"
              >
                <div>
                  <h3 className="font-semibold text-brand-charcoal">
                    {item.name}
                  </h3>

                  <p className="mt-1 text-sm text-brand-text-secondary">
                    ₹{item.price} × {item.quantity}
                  </p>
                </div>

                <p className="font-semibold text-brand-green-dark">
                  ₹{item.price * item.quantity}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Order Summary */}
        <section className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="font-serif text-xl font-bold text-brand-green-dark">
              Order Information
            </h2>

            <div className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-brand-text-secondary">
                  Order Type
                </span>

                <span className="font-semibold capitalize">
                  {order.orderType.replace("-", " ")}
                </span>
              </div>

              {order.tableNumber && (
                <div className="flex justify-between gap-4">
                  <span className="text-brand-text-secondary">
                    Table
                  </span>

                  <span className="font-semibold">
                    {order.tableNumber}
                  </span>
                </div>
              )}

              <div className="flex justify-between gap-4">
                <span className="text-brand-text-secondary">
                  Payment
                </span>

                <span className="font-semibold capitalize">
                  {order.payment.method}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-brand-text-secondary">
                  Payment Status
                </span>

                <span className="font-semibold capitalize">
                  {order.payment.status}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-brand-green-dark p-6 text-white shadow-sm">
            <h2 className="font-serif text-xl font-bold">
              Bill Summary
            </h2>

            <div className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-white/70">Subtotal</span>
                <span>₹{order.pricing.subtotal}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-white/70">GST</span>
                <span>₹{order.pricing.gst}</span>
              </div>

              <div className="my-4 border-t border-white/20" />

              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>₹{order.pricing.total}</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default OrderDetailsPage;