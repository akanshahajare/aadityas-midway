import { useState } from "react";
import { useCart } from "../../context/CartContext";

const MenuCard = ({ item }) => {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addToCart(item);
    setAdded(true);

    setTimeout(() => {
      setAdded(false);
    }, 1500);
  };

  return (
    <article className="group overflow-hidden rounded-2xl border border-brand-green/10 bg-brand-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-brand-green">
        {item.image?.src ? (
          <img
            src={item.image.src}
            alt={item.image.alt || item.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full border border-brand-gold/50">
                <span className="font-display text-2xl font-bold text-brand-gold">
                  A
                </span>
              </div>

              <p className="text-xs font-semibold uppercase tracking-wider text-brand-gold-light">
                Aaditya's Midway
              </p>
            </div>
          </div>
        )}

        {/* Vegetarian Badge */}
        {item.dietary?.vegetarian && (
          <span
            title="Vegetarian"
            className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full bg-brand-white/95 shadow"
          >
            <span className="h-3 w-3 rounded-full border-2 border-green-700 bg-green-600" />
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-display text-xl font-semibold leading-tight text-brand-green">
            {item.name}
          </h3>

          <span className="shrink-0 font-bold text-brand-gold-dark">
            ₹{item.price}
          </span>
        </div>

        {/* Description */}
        {item.description && (
          <p className="mt-3 line-clamp-2 text-sm leading-6 text-text-secondary">
            {item.description}
          </p>
        )}

        {/* Tags */}
        <div className="mt-4 flex flex-wrap gap-2">
          {item.spiceLevel && (
            <span className="rounded-full bg-brand-cream px-2.5 py-1 text-[11px] font-medium capitalize text-brand-brown">
              {item.spiceLevel}
            </span>
          )}

          {item.seasonal && (
            <span className="rounded-full bg-brand-gold/10 px-2.5 py-1 text-[11px] font-semibold text-brand-gold-dark">
              Seasonal
            </span>
          )}

          {item.servingInfo && (
            <span className="rounded-full bg-brand-cream px-2.5 py-1 text-[11px] text-text-secondary">
              {item.servingInfo}
            </span>
          )}
        </div>

        {/* Add to Cart */}
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={item.isAvailable === false}
          className="mt-5 w-full rounded-xl bg-brand-green px-4 py-3 text-sm font-bold text-brand-white transition hover:bg-brand-green-light disabled:cursor-not-allowed disabled:opacity-50"
        >
          {item.isAvailable === false
            ? "Unavailable"
            : added
              ? "✓ Added to Cart"
              : "Add to Cart"}
        </button>
      </div>
    </article>
  );
};

export default MenuCard;