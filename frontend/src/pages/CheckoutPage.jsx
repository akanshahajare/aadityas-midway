import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useCart } from "../context/CartContext";

const CheckoutPage = () => {
  const navigate = useNavigate();

  const { cartItems, subtotal, clearCart } = useCart();

  const [orderType, setOrderType] = useState("dine-in");
  const [paymentMethod, setPaymentMethod] = useState("cash");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    tableNumber: "",
    address: "",
    city: "",
    pincode: "",
  });

  const gst = subtotal * 0.05;
  const total = subtotal + gst;

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (cartItems.length === 0) {
      return;
    }

    alert("Order placed successfully!");

    clearCart();
    navigate("/");
  };

  if (cartItems.length === 0) {
    return (
      <main className="min-h-[70vh]">
        <section className="bg-brand-green py-14 text-brand-white">
          <div className="container-midway">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-gold">
              Checkout
            </p>

            <h1 className="mt-3 font-display text-4xl font-bold md:text-5xl">
              Nothing to checkout
            </h1>
          </div>
        </section>

        <section className="container-midway py-16">
          <div className="mx-auto max-w-xl rounded-2xl border border-brand-green/10 bg-brand-white p-10 text-center shadow-sm">
            <h2 className="font-display text-2xl font-bold text-text-primary">
              Your cart is empty
            </h2>

            <p className="mt-3 text-sm leading-6 text-text-secondary">
              Add some delicious dishes to your cart before proceeding to
              checkout.
            </p>

            <Link to="/menu" className="btn-primary mt-7 inline-flex">
              Explore Menu
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-[70vh]">
      {/* Header */}
      <section className="bg-brand-green py-14 text-brand-white">
        <div className="container-midway">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-gold">
            Aaditya's Midway
          </p>

          <h1 className="mt-3 font-display text-4xl font-bold md:text-5xl">
            Checkout
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-7 text-brand-white/70">
            Complete your details and place your order.
          </p>
        </div>
      </section>

      <section className="container-midway py-12">
        <form
          onSubmit={handleSubmit}
          className="grid gap-8 lg:grid-cols-[1fr_380px]"
        >
          {/* Checkout Form */}
          <div className="space-y-6">
            {/* Customer Details */}
            <section className="rounded-2xl border border-brand-green/10 bg-brand-white p-6 shadow-sm">
              <h2 className="font-display text-2xl font-bold text-text-primary">
                Customer Details
              </h2>

              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="name"
                    className="text-sm font-semibold text-text-primary"
                  >
                    Full Name
                  </label>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className="mt-2 w-full rounded-xl border border-brand-green/15 bg-brand-cream/40 px-4 py-3 text-sm outline-none transition focus:border-brand-gold"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="text-sm font-semibold text-text-primary"
                  >
                    Phone Number
                  </label>

                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    className="mt-2 w-full rounded-xl border border-brand-green/15 bg-brand-cream/40 px-4 py-3 text-sm outline-none transition focus:border-brand-gold"
                  />
                </div>

                <div className="md:col-span-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-semibold text-text-primary"
                  >
                    Email Address
                    <span className="ml-1 font-normal text-text-muted">
                      (optional)
                    </span>
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="mt-2 w-full rounded-xl border border-brand-green/15 bg-brand-cream/40 px-4 py-3 text-sm outline-none transition focus:border-brand-gold"
                  />
                </div>
              </div>
            </section>

            {/* Order Type */}
            <section className="rounded-2xl border border-brand-green/10 bg-brand-white p-6 shadow-sm">
              <h2 className="font-display text-2xl font-bold text-text-primary">
                Order Type
              </h2>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {[
                  {
                    value: "dine-in",
                    label: "Dine In",
                    description: "Enjoy at the restaurant",
                  },
                  {
                    value: "takeaway",
                    label: "Takeaway",
                    description: "Pick up your order",
                  },
                  {
                    value: "delivery",
                    label: "Delivery",
                    description: "Get it delivered",
                  },
                ].map((option) => (
                  <label
                    key={option.value}
                    className={`cursor-pointer rounded-xl border p-4 transition ${
                      orderType === option.value
                        ? "border-brand-gold bg-brand-gold/10"
                        : "border-brand-green/10 hover:border-brand-green/30"
                    }`}
                  >
                    <input
                      type="radio"
                      name="orderType"
                      value={option.value}
                      checked={orderType === option.value}
                      onChange={(event) => setOrderType(event.target.value)}
                      className="sr-only"
                    />

                    <p className="font-bold text-text-primary">
                      {option.label}
                    </p>

                    <p className="mt-1 text-xs text-text-secondary">
                      {option.description}
                    </p>
                  </label>
                ))}
              </div>

              {/* Table Number */}
              {orderType === "dine-in" && (
                <div className="mt-5">
                  <label
                    htmlFor="tableNumber"
                    className="text-sm font-semibold text-text-primary"
                  >
                    Table Number
                  </label>

                  <input
                    id="tableNumber"
                    name="tableNumber"
                    type="text"
                    required
                    value={formData.tableNumber}
                    onChange={handleChange}
                    placeholder="Enter table number"
                    className="mt-2 w-full rounded-xl border border-brand-green/15 bg-brand-cream/40 px-4 py-3 text-sm outline-none transition focus:border-brand-gold"
                  />
                </div>
              )}

              {/* Delivery Address */}
              {orderType === "delivery" && (
                <div className="mt-5 space-y-5">
                  <div>
                    <label
                      htmlFor="address"
                      className="text-sm font-semibold text-text-primary"
                    >
                      Delivery Address
                    </label>

                    <textarea
                      id="address"
                      name="address"
                      required
                      rows="3"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Enter complete delivery address"
                      className="mt-2 w-full resize-none rounded-xl border border-brand-green/15 bg-brand-cream/40 px-4 py-3 text-sm outline-none transition focus:border-brand-gold"
                    />
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="city"
                        className="text-sm font-semibold text-text-primary"
                      >
                        City
                      </label>

                      <input
                        id="city"
                        name="city"
                        type="text"
                        required
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="City"
                        className="mt-2 w-full rounded-xl border border-brand-green/15 bg-brand-cream/40 px-4 py-3 text-sm outline-none transition focus:border-brand-gold"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="pincode"
                        className="text-sm font-semibold text-text-primary"
                      >
                        Pincode
                      </label>

                      <input
                        id="pincode"
                        name="pincode"
                        type="text"
                        required
                        value={formData.pincode}
                        onChange={handleChange}
                        placeholder="Pincode"
                        className="mt-2 w-full rounded-xl border border-brand-green/15 bg-brand-cream/40 px-4 py-3 text-sm outline-none transition focus:border-brand-gold"
                      />
                    </div>
                  </div>
                </div>
              )}
            </section>

            {/* Payment */}
            <section className="rounded-2xl border border-brand-green/10 bg-brand-white p-6 shadow-sm">
              <h2 className="font-display text-2xl font-bold text-text-primary">
                Payment Method
              </h2>

              <div className="mt-5 space-y-3">
                <label
                  className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition ${
                    paymentMethod === "cash"
                      ? "border-brand-gold bg-brand-gold/10"
                      : "border-brand-green/10 hover:border-brand-green/30"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash"
                    checked={paymentMethod === "cash"}
                    onChange={(event) =>
                      setPaymentMethod(event.target.value)
                    }
                  />

                  <div>
                    <p className="font-bold text-text-primary">
                      Cash Payment
                    </p>

                    <p className="mt-1 text-xs text-text-secondary">
                      Pay at the restaurant or on delivery.
                    </p>
                  </div>
                </label>

                <label
                  className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition ${
                    paymentMethod === "online"
                      ? "border-brand-gold bg-brand-gold/10"
                      : "border-brand-green/10 hover:border-brand-green/30"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="online"
                    checked={paymentMethod === "online"}
                    onChange={(event) =>
                      setPaymentMethod(event.target.value)
                    }
                  />

                  <div>
                    <p className="font-bold text-text-primary">
                      Online Payment
                    </p>

                    <p className="mt-1 text-xs text-text-secondary">
                      Secure online payment will be available soon.
                    </p>
                  </div>
                </label>
              </div>
            </section>
          </div>

          {/* Order Summary */}
          <aside className="h-fit rounded-2xl border border-brand-green/10 bg-brand-white p-6 shadow-sm lg:sticky lg:top-28">
            <h2 className="font-display text-2xl font-bold text-text-primary">
              Order Summary
            </h2>

            <div className="mt-6 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="flex items-start justify-between gap-4"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-text-primary">
                      {item.name}
                    </p>

                    <p className="mt-1 text-xs text-text-muted">
                      Qty: {item.quantity}
                    </p>
                  </div>

                  <p className="shrink-0 text-sm font-semibold text-text-primary">
                    ₹
                    {(
                      (Number(item.price) || 0) * item.quantity
                    ).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 border-t border-brand-green/10 pt-5">
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Subtotal</span>
                <span className="font-semibold">
                  ₹{subtotal.toFixed(2)}
                </span>
              </div>

              <div className="mt-3 flex justify-between text-sm">
                <span className="text-text-secondary">GST (5%)</span>
                <span className="font-semibold">
                  ₹{gst.toFixed(2)}
                </span>
              </div>

              <div className="mt-5 border-t border-brand-green/10 pt-5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-text-primary">
                    Total
                  </span>

                  <span className="font-display text-2xl font-bold text-brand-green">
                    ₹{total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary mt-7 w-full"
            >
              Place Order
            </button>

            <Link
              to="/cart"
              className="mt-3 block text-center text-sm font-semibold text-brand-green transition hover:text-brand-brown"
            >
              ← Back to Cart
            </Link>
          </aside>
        </form>
      </section>
    </main>
  );
};

export default CheckoutPage;