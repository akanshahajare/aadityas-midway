import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMenu } from "../../services/menuService";

const FeaturedMenu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadMenu = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getMenu();

        // Backend response:
        // {
        //   success: true,
        //   count: 347,
        //   data: [...]
        // }
        const items = Array.isArray(response)
          ? response
          : response?.data || [];

        setMenuItems(items.slice(0, 8));
      } catch (err) {
        console.error("Failed to load featured menu:", err);
        setError("Unable to load our featured dishes.");
      } finally {
        setLoading(false);
      }
    };

    loadMenu();
  }, []);

  return (
    <section className="bg-brand-cream py-20 md:py-24">
      <div className="container-midway">

        {/* Section Header */}
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-brand-gold">
              From Our Kitchen
            </p>

            <h2 className="mt-3 font-display text-4xl font-bold leading-tight text-brand-green md:text-5xl">
              Favourites Worth Trying
            </h2>

            <p className="mt-4 text-base leading-7 text-text-secondary">
              Explore some of the dishes from our menu and discover your next
              favourite.
            </p>
          </div>

          <Link
            to="/menu"
            className="hidden shrink-0 font-semibold text-brand-green transition-colors hover:text-brand-gold md:inline-flex"
          >
            View Full Menu →
          </Link>
        </div>

        {/* Loading */}
        {loading && (
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border border-brand-green/10 bg-brand-white"
              >
                <div className="h-48 animate-pulse bg-brand-green/10" />

                <div className="space-y-3 p-5">
                  <div className="h-3 w-20 animate-pulse rounded bg-brand-green/10" />
                  <div className="h-5 w-3/4 animate-pulse rounded bg-brand-green/10" />
                  <div className="h-4 w-full animate-pulse rounded bg-brand-green/10" />
                  <div className="h-4 w-1/2 animate-pulse rounded bg-brand-green/10" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="mt-12 rounded-2xl border border-brand-gold/30 bg-brand-white p-8 text-center">
            <p className="font-semibold text-brand-green">
              {error}
            </p>

            <Link
              to="/menu"
              className="mt-4 inline-flex font-semibold text-brand-gold hover:text-brand-green"
            >
              Browse full menu →
            </Link>
          </div>
        )}

        {/* Menu Grid */}
        {!loading && !error && menuItems.length > 0 && (
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {menuItems.map((item) => (
              <article
                key={item._id || item.slug || item.name}
                className="group overflow-hidden rounded-2xl border border-brand-green/10 bg-brand-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Image */}
                <div className="relative flex h-48 items-center justify-center overflow-hidden bg-brand-green">
                  {item.image?.src ? (
                    <img
                      src={item.image.src}
                      alt={item.image.alt || item.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center px-6 text-center">
                      <span className="text-4xl">
                        🍽️
                      </span>

                      <span className="mt-3 font-display text-sm font-semibold text-brand-gold">
                        Aaditya&apos;s Midway
                      </span>
                    </div>
                  )}

                  {/* Vegetarian Badge */}
                  {item.dietary?.vegetarian && (
                    <span className="absolute left-3 top-3 rounded-full bg-brand-white px-3 py-1 text-xs font-bold text-brand-green shadow-sm">
                      ● Veg
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      {item.category?.name && (
                        <p className="text-[0.65rem] font-bold uppercase tracking-[0.15em] text-brand-gold">
                          {item.category.name}
                        </p>
                      )}

                      <h3 className="mt-2 font-display text-lg font-bold leading-snug text-brand-green">
                        {item.name}
                      </h3>
                    </div>

                    {item.price !== undefined &&
                      item.price !== null && (
                        <span className="shrink-0 rounded-full bg-brand-cream px-3 py-1 text-sm font-bold text-brand-green">
                          ₹{item.price}
                        </span>
                      )}
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
                      <span className="rounded-full bg-brand-cream px-2.5 py-1 text-[0.65rem] font-semibold text-text-secondary">
                        🌶️ {item.spiceLevel}
                      </span>
                    )}

                    {item.seasonal && (
                      <span className="rounded-full bg-brand-gold/10 px-2.5 py-1 text-[0.65rem] font-semibold text-brand-gold">
                        Seasonal
                      </span>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && menuItems.length === 0 && (
          <div className="mt-12 rounded-2xl border border-brand-green/10 bg-brand-white p-10 text-center">
            <p className="font-display text-xl font-bold text-brand-green">
              Our menu is being prepared.
            </p>

            <p className="mt-2 text-sm text-text-secondary">
              Please check back shortly.
            </p>
          </div>
        )}

        {/* Mobile CTA */}
        {!loading && (
          <div className="mt-10 text-center md:hidden">
            <Link to="/menu" className="btn-secondary">
              View Full Menu
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedMenu;