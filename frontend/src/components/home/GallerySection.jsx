import { Link } from "react-router-dom";

const galleryItems = [
  {
    title: "Good Food",
    subtitle: "Freshly prepared favourites",
    icon: "🍽️",
    className: "md:col-span-2 md:row-span-2",
  },
  {
    title: "Family Moments",
    subtitle: "Made to be shared",
    icon: "👨‍👩‍👧‍👦",
    className: "",
  },
  {
    title: "Celebrations",
    subtitle: "Special moments",
    icon: "🎉",
    className: "",
  },
  {
    title: "Desi Flavours",
    subtitle: "Taste of India",
    icon: "🌶️",
    className: "",
  },
  {
    title: "Midway Stop",
    subtitle: "Relax & refresh",
    icon: "☕",
    className: "",
  },
];

const GallerySection = () => {
  return (
    <section className="bg-brand-cream py-20 md:py-24">
      <div className="container-midway">

        {/* Header */}
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-brand-gold">
              A Glimpse Of Aaditya&apos;s
            </p>

            <h2 className="mt-3 font-display text-4xl font-bold leading-tight text-brand-green md:text-5xl">
              Food, Family & Good Times
            </h2>

            <p className="mt-4 text-base leading-7 text-text-secondary">
              A place designed for good food, relaxed conversations and
              moments worth remembering.
            </p>
          </div>

          <Link
            to="/about"
            className="hidden shrink-0 font-semibold text-brand-green transition-colors hover:text-brand-gold md:inline-flex"
          >
            Discover Our Story →
          </Link>
        </div>

        {/* Gallery */}
        <div className="mt-12 grid auto-rows-[180px] gap-4 md:grid-cols-4 md:auto-rows-[170px]">

          {galleryItems.map((item) => (
            <div
              key={item.title}
              className={`group relative overflow-hidden rounded-2xl bg-brand-green ${item.className}`}
            >
              {/* Decorative background */}
              <div className="absolute inset-0">
                <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full border-[20px] border-brand-gold/20 transition-transform duration-500 group-hover:scale-125" />

                <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full border-[25px] border-brand-white/5 transition-transform duration-500 group-hover:scale-110" />
              </div>

              {/* Content */}
              <div className="relative flex h-full flex-col items-center justify-center p-6 text-center">
                <span
                  className={`${
                    item.className
                      ? "text-6xl md:text-7xl"
                      : "text-4xl"
                  } transition-transform duration-300 group-hover:scale-110`}
                >
                  {item.icon}
                </span>

                <h3
                  className={`mt-4 font-display font-bold text-brand-white ${
                    item.className
                      ? "text-2xl md:text-3xl"
                      : "text-lg"
                  }`}
                >
                  {item.title}
                </h3>

                <p className="mt-1 text-xs text-brand-white/60">
                  {item.subtitle}
                </p>
              </div>
            </div>
          ))}

        </div>

        {/* Mobile CTA */}
        <div className="mt-8 text-center md:hidden">
          <Link
            to="/about"
            className="font-semibold text-brand-green transition-colors hover:text-brand-gold"
          >
            Discover Our Story →
          </Link>
        </div>

      </div>
    </section>
  );
};

export default GallerySection;