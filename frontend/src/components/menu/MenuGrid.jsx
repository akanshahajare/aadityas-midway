import MenuCard from "./MenuCard";

const MenuGrid = ({ items, loading, error }) => {
  if (loading) {
    return (
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div
            key={item}
            className="animate-pulse overflow-hidden rounded-2xl border border-brand-green/10 bg-brand-white"
          >
            <div className="aspect-[4/3] bg-brand-green/10" />

            <div className="space-y-3 p-5">
              <div className="h-5 w-2/3 rounded bg-brand-green/10" />
              <div className="h-4 w-full rounded bg-brand-green/10" />
              <div className="h-4 w-1/3 rounded bg-brand-green/10" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-brand-gold/20 bg-brand-white p-10 text-center">
        <p className="text-text-secondary">{error}</p>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="rounded-2xl border border-brand-green/10 bg-brand-white p-10 text-center">
        <h3 className="font-display text-2xl font-semibold text-brand-green">
          No dishes found
        </h3>

        <p className="mt-2 text-sm text-text-secondary">
          Try another search or choose a different category.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <MenuCard
          key={item._id || item.slug}
          item={item}
        />
      ))}
    </div>
  );
};

export default MenuGrid;