import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const CartPage = () => {
  const {
    cartItems,
    cartCount,
    subtotal,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const gst = subtotal * 0.05;
  const total = subtotal + gst;

  return (
    <main className="min-h-[70vh]">
      {/* Header */}
      <section className="bg-brand-green py-14 text-brand-white">
        <div className="container-midway">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-gold">
            Your Order
          </p>

          <h1 className="mt-3 font-display text-4xl font-bold md:text-5xl">
            Your Cart
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-7 text-brand-white/70">
            Review your selected dishes before placing your order.
          </p>
        </div>
      </section>

      <section className="container-midway py-12">
        {cartItems.length === 0 ? (
          /* Empty Cart */
          <div className="mx-auto max-w-xl rounded-2xl border border-brand-green/10 bg-brand-white p-10 text-center shadow-sm">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-brand-cream text-brand-green">
              <svg
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="9" cy="20" r="1" />
                <circle cx="19" cy="20" r="1" />
                <path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h8.8a2 2 0 0 0 1.9-1.4L22 8H6" />
              </svg>
            </div>

            <h2 className="mt-6 font-display text-2xl font-bold text-text-primary">
              Your cart is empty
            </h2>

            <p className="mt-3 text-sm leading-6 text-text-secondary">
              Looks like you haven't added anything yet. Explore our menu and
              find something delicious.
            </p>

            <Link to="/menu" className="btn-primary mt-7 inline-flex">
              Explore Menu
            </Link>
          </div>
        ) : (
          /* Cart */
          <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
            {/* Cart Items */}
            <div>
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="font-display text-2xl font-bold text-text-primary">
                    Your Items
                  </h2>

                  <p className="mt-1 text-sm text-text-secondary">
                    {cartCount} {cartCount === 1 ? "item" : "items"} in your
                    cart
                  </p>
                </div>

                <button
                  type="button"
                  onClick={clearCart}
                  className="text-sm font-semibold text-brand-brown transition hover:text-brand-green"
                >
                  Clear Cart
                </button>
              </div>

              <div className="space-y-4">
                {cartItems.map((item) => {
                  const price = Number(item.price) || 0;
                  const itemTotal = price * item.quantity;

                  return (
                    <article
                      key={item._id}
                      className="flex gap-4 rounded-2xl border border-brand-green/10 bg-brand-white p-4 shadow-sm"
                    >
                      {/* Image */}
                      <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-brand-cream">
                        {item.image?.src ? (
                          <img
                            src={item.image.src}
                            alt={item.image.alt || item.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-brand-green/30">
                            <span className="font-display text-2xl font-bold">
                              A
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Details */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="font-display text-lg font-bold text-text-primary">
                              {item.name}
                            </h3>

                            {item.category?.name && (
                              <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-brand-brown">
                                {item.category.name}
                              </p>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => removeFromCart(item._id)}
                            className="text-text-muted transition hover:text-brand-brown"
                            aria-label={`Remove ${item.name}`}
                          >
                            ×
                          </button>
                        </div>

                        <div className="mt-4 flex items-center justify-between gap-3">
                          <div className="flex items-center rounded-lg border border-brand-green/15">
                            <button
                              type="button"
                              onClick={() => decreaseQuantity(item._id)}
                              className="flex h-9 w-9 items-center justify-center text-lg font-semibold text-brand-green transition hover:bg-brand-cream"
                              aria-label={`Decrease ${item.name} quantity`}
                            >
                              −
                            </button>

                            <span className="w-8 text-center text-sm font-bold text-text-primary">
                              {item.quantity}
                            </span>

                            <button
                              type="button"
                              onClick={() => increaseQuantity(item._id)}
                              className="flex h-9 w-9 items-center justify-center text-lg font-semibold text-brand-green transition hover:bg-brand-cream"
                              aria-label={`Increase ${item.name} quantity`}
                            >
                              +
                            </button>
                          </div>

                          <p className="font-bold text-brand-green">
                            ₹{itemTotal.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>

            {/* Summary */}
            <aside className="h-fit rounded-2xl border border-brand-green/10 bg-brand-white p-6 shadow-sm lg:sticky lg:top-28">
              <h2 className="font-display text-2xl font-bold text-text-primary">
                Order Summary
              </h2>

              <div className="mt-6 space-y-4 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">Subtotal</span>
                  <span className="font-semibold text-text-primary">
                    ₹{subtotal.toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">GST (5%)</span>
                  <span className="font-semibold text-text-primary">
                    ₹{gst.toFixed(2)}
                  </span>
                </div>

                <div className="border-t border-brand-green/10 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-text-primary">Total</span>
                    <span className="font-display text-2xl font-bold text-brand-green">
                      ₹{total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <Link
                to="/checkout"
                className="btn-primary mt-7 flex w-full justify-center"
              >
                Proceed to Checkout
              </Link>

              <Link
                to="/menu"
                className="mt-3 block text-center text-sm font-semibold text-brand-green transition hover:text-brand-brown"
              >
                ← Continue Shopping
              </Link>
            </aside>
          </div>
        )}
      </section>
    </main>
  );
};

export default CartPage;
