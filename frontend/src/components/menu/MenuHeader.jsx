const MenuHeader = () => {
  return (
    <section className="bg-brand-green py-16 text-brand-white">
      <div className="container-midway">
        <div className="max-w-3xl">
          <div className="mb-5 flex items-center gap-3">
            <span className="gold-line" />

            <span className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-gold-light">
              Aaditya's Midway
            </span>
          </div>

          <h1 className="heading-lg">
            Our Menu
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-brand-white/70">
            From desi favourites and hearty Indian meals to Chinese,
            pizzas, beverages and desserts — there's something for
            every mood.
          </p>
        </div>
      </div>
    </section>
  );
};

export default MenuHeader;